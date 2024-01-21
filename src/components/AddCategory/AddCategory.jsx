import {
  Alert,
  Box,
  Button,
  Container,
  Snackbar,
  TextField,
  ThemeProvider,
  Typography,
  createTheme,
} from "@mui/material";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import React, { useState } from "react";
import { v4 } from "uuid";
import Header from "../Header/Header";
import "./AddCategory.css";
import { storage } from "./Firebaseconfig";
const AddCategory = () => {
  // State variables
  const [categoryName, setCategoryName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageUpload, setImageUpload] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [notification, setNotification] = useState(null);

  // Function to handle adding a category
  const handleAddCategory = async () => {
    if (!categoryName.trim()) {
      setNotification({
        type: "error",
        message: "Not Saved Successfully: Category Name is required",
      });
      setTimeout(() => {
        window.location.reload();
      }, 1500);

      return;
    }

    // Check if an image is selected
    if (imageUpload === null) {
      setNotification({
        type: "error",
        message: "Not Saved Successfully: Image is required",
      });

      // Wait for 2 seconds (adjust as needed) before refreshing the page
      setTimeout(() => {
        window.location.reload();
      }, 1500);

      return;
    }

    // Upload image to Firebase Storage
    const imageRef = ref(storage, `images/${imageUpload.name + v4()}`);

    try {
      const snapshot = await uploadBytes(imageRef, imageUpload);
      const imageUrl = await getDownloadURL(snapshot.ref);
      console.log("Image successfully saved to Firebase:", imageUrl);

      // Send category data to the server
      const apiUrl = "http://localhost:8080/category/placeCategory";
      const requestData = {
        category_name: categoryName,
        image_url: imageUrl,
      };
      console.log(" Request data ", categoryName, imageUrl);

      // Send a POST request to the backend
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();
      console.log("Response from server:", data);

      // Show success notification
      setNotification({
        type: "success",
        message: "Saved Successfully",
      });
      setTimeout(() => {
        window.location.reload();
      }, 1500);
      // Clear input fields after successful image upload
      setCategoryName("");
      setImageUpload(null);
      setImagePreview(null);
    } catch (error) {
      console.error("Error handling category:", error);
      // Show error notification
      setNotification({
        type: "error",
        message: "Not Saved Successfully: An error occurred",
      });
    }
  };

  // Function to handle image preview
  const handleImagePreview = (event) => {
    const file = event.target.files[0];
    setImageUpload(file);

    // Preview the image
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Global theme for notifications
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
          <Box
            sx={{
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              border: "2px solid #2196f3", // Add border styling here
              color: "primary",
              padding: 5, // Optionally, add padding for better appearance
            }}
          >
            <Typography variant="h4">Add Category</Typography>
            <Box mt={4}>
              {/* Category Name Input */}
              <Typography variant="h6">Enter Category Name</Typography>
              <TextField
                label="Category Name"
                type="text"
                fullWidth
                margin="normal"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
              />

              {/* Category Image Input with Preview */}
              <Typography
                variant="h6"
                style={{
                  marginBottom: "10px",
                  marginTop: "10px",
                }}
              >
                Select Category Image
              </Typography>
              <input type="file" onChange={handleImagePreview} />
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
              <br></br>
              {/* Add Category Button */}
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

              {/* Snackbar Notification */}
              <Snackbar
                open={notification !== null}
                autoHideDuration={6000}
                onClose={() => setNotification(null)}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
              >
                <Alert
                  severity={
                    notification && notification.type
                      ? notification.type
                      : "info"
                  }
                  onClose={() => setNotification(null)}
                >
                  {notification && notification.message
                    ? notification.message
                    : ""}
                </Alert>
              </Snackbar>
            </Box>
          </Box>
        </Container>
      </div>
    </ThemeProvider>
  );
};

export default AddCategory;
