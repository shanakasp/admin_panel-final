import { Box, Button, Container, TextField, Typography } from "@mui/material";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import React, { useState } from "react";
import { v4 } from "uuid";
import Header from "../Header/Header";
import { storage } from "./Firebaseconfig";

const AddCategory = () => {
  // State variables
  const [categoryName, setCategoryName] = useState("");
  const [imageUpload, setImageUpload] = useState(null);

  // Function to handle adding a category
  const handleAddCategory = async () => {
    // Check if an image is selected
    if (imageUpload === null) return;

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
        image_url: imageUrl, // Update to use the obtained URL
      };

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

      // Clear input fields after successful image upload
      setCategoryName("");
      setImageUpload(null); // Set to null instead of calling without parameters
    } catch (error) {
      console.error("Error handling category:", error);
    }
  };

  return (
    <div>
      <Header />
      <Container maxWidth="sm">
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
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

            {/* Category Image Input */}
            <Typography variant="h6">Select Category Image</Typography>
            <input
              type="file"
              onChange={(event) => {
                setImageUpload(event.target.files[0]);
              }}
            />

            {/* Add Category Button */}
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddCategory}
            >
              Add Category
            </Button>
          </Box>
        </Box>
      </Container>
    </div>
  );
};

export default AddCategory;
