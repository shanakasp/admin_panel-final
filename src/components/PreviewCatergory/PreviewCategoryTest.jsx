import { Edit } from "@mui/icons-material";
import {
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { storage } from "../AddCategory/Firebaseconfig";
import Header from "../Header/Header";
import "./previewstyles.css";

function PreviewCategory() {
  const [notificationTimeout, setNotificationTimeout] = useState(null);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [editCategoryId, setEditCategoryId] = useState(null);
  const [editCategoryName, setEditCategoryName] = useState("");
  const [editImageUrl, setEditImageUrl] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const uploadImageToFirebase = async (selectedFile) => {
    const storageRef = storage.ref();
    const imageRef = storageRef.child(`images/${selectedFile.name}`);
    await imageRef.put(selectedFile);
    const imageUrl = await imageRef.getDownloadURL();
    console.log("Image uploaded to Firebase:", imageUrl);
    return imageUrl;
  };

  useEffect(() => {
    fetch("http://localhost:8080/category/getAllCategories")
      .then((response) => response.json())
      .then((data) => setCategories(data.result.data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const handleEditDialogClose = () => {
    setIsEditDialogOpen(false);
  };

  const filteredCategories = Array.isArray(categories)
    ? categories
        .filter(
          (category) =>
            category.category_name &&
            category.category_name
              .toLowerCase()
              .startsWith(search.toLowerCase())
        )
        .sort((a, b) => a.category_name.localeCompare(b.category_name))
    : [];

  const handleEditClick = (categoryId, categoryName, imageUrl) => {
    setEditCategoryId(categoryId);
    setEditCategoryName(categoryName);
    setEditImageUrl(imageUrl);
    setIsEditDialogOpen(true);
  };

  const handleEditSave = async () => {
    try {
      // Check if a new image is selected
      if (editImageUrl instanceof File) {
        // Upload image to Firebase
        const imageUrl = await uploadImageToFirebase(editImageUrl);

        // Save category name and image URL in the database
        await fetch(
          `http://localhost:8080/category/updateCategoryByID/${editCategoryId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              category_name: editCategoryName,
              image_url: imageUrl,
            }),
          }
        );
      } else {
        // If no new image is selected, update only the category name
        await fetch(
          `http://localhost:8080/category/updateCategoryByID/${editCategoryId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              category_name: editCategoryName,
              image_url: editImageUrl,
            }),
          }
        );
      }

      // Fetch updated data from the server
      const response = await fetch(
        "http://localhost:8080/category/getAllCategories"
      );
      const data = await response.json();
      setCategories(data.result.data);

      handleEditDialogClose();
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };

  return (
    <div>
      <Header setSearch={setSearch} />

      <div className="categoryContainer">
        {filteredCategories.map((category, index) => (
          <Card key={category.category_id} className={`card cardHover`}>
            <CardContent>
              <div className="imageContainer">
                <Link
                  to={`/form/${category.category_id}`}
                  style={{ textDecoration: "none" }}
                >
                  <img
                    src={category.image_url}
                    alt={category.category_name}
                    className="categoryImage"
                  />
                </Link>
                <div className="buttonsContainer">
                  {/* Edit Icon */}
                  <IconButton
                    color="primary"
                    onClick={() =>
                      handleEditClick(
                        category.category_id,
                        category.category_name,
                        category.image_url
                      )
                    }
                  >
                    <Edit />
                  </IconButton>
                </div>
              </div>

              {/* Category Name with Link */}
              <Link
                to={`/form/${category.category_id}`}
                style={{ textDecoration: "none" }}
              >
                <Button variant="contained" color="primary">
                  {category.category_name}
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Dialog */}
      <Dialog
        open={isEditDialogOpen}
        onClose={handleEditDialogClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Edit Category</DialogTitle>
        <DialogContent>
          {/* Display current name */}
          <div style={{ marginBottom: "10px" }}>
            <strong>Current Name:</strong> {editCategoryName}
          </div>

          {/* Display current image preview */}
          {imagePreview && (
            <div style={{ marginBottom: "10px" }}>
              <strong>Image Preview:</strong>{" "}
              <img
                src={imagePreview}
                alt="Image Preview"
                style={{ maxWidth: "100%", maxHeight: "150px" }}
              />
            </div>
          )}

          {/* Input for new name */}
          <TextField
            autoFocus
            margin="dense"
            id="categoryName"
            label="New Category Name"
            type="text"
            fullWidth
            value={editCategoryName}
            onChange={(e) => setEditCategoryName(e.target.value)}
          />

          {/* Display current image preview */}
          {editImageUrl && (
            <div style={{ marginBottom: "10px" }}>
              <p>Current Image Preview:</p>
              <img
                src={editImageUrl}
                alt="Current Preview"
                style={{ maxWidth: "100%", maxHeight: "200px" }}
              />
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleEditSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default PreviewCategory;
