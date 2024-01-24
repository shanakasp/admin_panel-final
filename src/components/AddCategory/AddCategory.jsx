import {
  Alert,
  Box,
  Button,
  Container,
  TextField,
  ThemeProvider,
  Typography,
  createTheme,
} from "@mui/material";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import React, { useState } from "react";
import { v4 } from "uuid";
import Header from "../Header/Header";
import { storage } from "./Firebaseconfig";

const AddCategory = () => {
  const [categoryName, setCategoryName] = useState("");
  const [imageUpload, setImageUpload] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [categoryNameError, setCategoryNameError] = useState(null);
  const [imageError, setImageError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [notification, setNotification] = useState(null);

  const handleAddCategory = async () => {
    setNotification(null);
    setCategoryNameError(null);
    setImageError(null);
    setSuccessMessage(null);

    if (!categoryName.trim()) {
      setCategoryNameError("Please enter category name.");
      return;
    }

    if (imageUpload === null) {
      setImageError("Please upload an image for the category.");
      return;
    }

    const imageRef = ref(storage, `images/${imageUpload.name + v4()}`);

    try {
      const snapshot = await uploadBytes(imageRef, imageUpload);
      const imageUrl = await getDownloadURL(snapshot.ref);

      const apiUrl =
        "http://ec2-3-144-111-86.us-east-2.compute.amazonaws.com:8080/category/placeCategory";
      const requestData = {
        category_name: categoryName,
        image_url: imageUrl,
      };

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();

      setSuccessMessage("Saved Successfully");
      setTimeout(() => {
        setSuccessMessage(null);
        window.location.reload();
      }, 1500);

      setCategoryName("");
      setImageUpload(null);
      setImagePreview(null);
    } catch (error) {
      console.error("Error handling category:", error);

      setNotification({
        type: "error",
        message: "Not Saved Successfully: An error occurred",
      });

      setCategoryName("");
      setImageUpload(null);
      setImagePreview(null);
    }
  };

  const handleImagePreview = (event) => {
    const file = event.target.files[0];

    if (!file) return;

    const allowedTypes = [
      ".jpg",
      ".jpeg",
      ".png",
      ".gif",
      ".tiff",
      ".eps",
      ".raw",
    ];
    const fileType = file.name.toLowerCase().slice(file.name.lastIndexOf("."));

    if (!allowedTypes.includes(fileType)) {
      setImageError(
        "Invalid image type. Please select JPEG, PNG, GIF, TIFF, EPS, RAW images."
      );
      return;
    }

    setImageUpload(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const theme = createTheme({
    palette: {
      success: {
        main: "#4CAF50",
      },
      error: {
        main: "#f44336",
      },
      info: {
        main: "#2196F3",
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <div>
        <Header />

        <Container className="containerborder" maxWidth="sm">
          {successMessage && (
            <Alert severity="success" sx={{ marginTop: 2 }}>
              {successMessage}
            </Alert>
          )}
          <Box
            sx={{
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              border: "2px solid #2196f3",
              color: "primary",
              padding: 5,
            }}
          >
            <Typography variant="h4">Add Category</Typography>
            <Box mt={4}>
              <Typography variant="h6">Enter Category Name</Typography>
              <TextField
                label="Category Name"
                type="text"
                fullWidth
                margin="normal"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
              />
              {categoryNameError && (
                <Alert severity="error" sx={{ marginBottom: 2 }}>
                  {categoryNameError}
                </Alert>
              )}

              <Typography
                variant="h6"
                style={{ marginBottom: "10px", marginTop: "10px" }}
              >
                Select Category Image
              </Typography>
              <input
                type="file"
                accept=".jpg, .jpeg, .png, .gif, .tiff, .eps, .raw"
                onChange={handleImagePreview}
              />
              {imageError && (
                <Alert severity="error" sx={{ marginTop: 2 }}>
                  {imageError}
                </Alert>
              )}
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{
                    maxWidth: "100%",
                    marginTop: "10px",
                    marginBottom: "20px",
                  }}
                />
              )}

              <br />
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddCategory}
                style={{
                  marginBottom: "10px",
                  marginTop: "20px",
                }}
              >
                Add Category
              </Button>
            </Box>
          </Box>
        </Container>
      </div>
    </ThemeProvider>
  );
};

export default AddCategory;
