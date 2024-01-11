import { Box, Button, Container, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import Header from "../Header/Header";

function AddCategory() {
  const [categoryName, setCategoryName] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const handleAddCategory = () => {
    const apiUrl =
      "http://ec2-3-139-78-36.us-east-2.compute.amazonaws.com:8000/category/placeCategory";

    const requestData = {
      category_name: categoryName,
      image_url: imageUrl,
    };

    fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    })
      .then((response) => response.json())
      .then((data) => {
        // Handle the response from the backend as needed
        console.log("Response from server:", data);
      })
      .catch((error) => {
        console.error("Error while adding category:", error);
      });
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
            <Typography variant="h6">Enter Category Name</Typography>
            <TextField
              label="Category Name"
              type="text"
              fullWidth
              margin="normal"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
            />
            <Typography variant="h6">Enter Category Name</Typography>
            <TextField
              label="Image Link"
              type="text"
              fullWidth
              margin="normal"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />

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
}

export default AddCategory;
