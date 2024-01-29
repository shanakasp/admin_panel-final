import { Delete, Edit } from "@mui/icons-material";
import {
  Alert,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  TextField,
} from "@mui/material";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { v4 } from "uuid";
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
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteCategoryId, setDeleteCategoryId] = useState(null);
  const [notification, setNotification] = useState(null);
  const [selectedImageFile, setSelectedImageFile] = useState(null);

  const MAX_CHARACTERS = 50;

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
    setNotification(null); // Clear any existing notifications
    clearNotificationTimeout();
  };

  const clearNotificationTimeout = () => {
    if (notificationTimeout) {
      clearTimeout(notificationTimeout);
    }
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
      // Validate category name
      if (!editCategoryName.trim()) {
        console.error("Please enter category name.");
        return;
      }

      // Validate image
      if (!selectedImageFile) {
        console.error("Please upload an image for the category.");
        return;
      }

      // Upload the new image to Firebase
      const imageRef = ref(storage, `images/${selectedImageFile.name + v4()}`);
      const snapshot = await uploadBytes(imageRef, selectedImageFile);
      const imageUrl = await getDownloadURL(snapshot.ref);

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

      // Fetch updated data from the server
      const response = await fetch(
        "http://localhost:8080/category/getAllCategories"
      );
      const data = await response.json();
      setCategories(data.result.data);

      handleEditDialogClose();
    } catch (error) {
      console.error("Error updating category:", error);

      // Handle error as needed, e.g., set an error notification
    }
  };

  const handleDeleteClick = (categoryId) => {
    setDeleteCategoryId(categoryId);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    fetch(
      `http://localhost:8080/category/deleteCategoryByID/${deleteCategoryId}`,
      {
        method: "DELETE",
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log("Category deleted successfully:", data);

        fetch("http://localhost:8080/category/getAllCategories")
          .then((response) => response.json())
          .then((data) => setCategories(data.result.data))
          .catch((error) => console.error("Error fetching data:", error));
      })
      .catch((error) => {
        console.error("Error deleting category:", error);
      })
      .finally(() => {
        setIsDeleteDialogOpen(false);
      });
  };

  const handleCancelDelete = () => {
    setIsDeleteDialogOpen(false);
  };
  const handleImageChange = (e) => {
    // Update the selected image file when the user selects a new image
    setSelectedImageFile(e.target.files[0]);
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

                {/* Two Buttons */}
                <div className="buttonsContainer" style={{ display: "flex" }}>
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

                  {/* Category Name with Link */}
                  <Link
                    to={`/form/${category.category_id}`}
                    style={{ textDecoration: "none", flex: 1 }}
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      style={{
                        fontSize: `${
                          category.category_name.length > 15 ? "14px" : "20px"
                        }`,
                        lineHeight: `${
                          category.category_name.length > 15 ? "1.4" : "1.2"
                        }`,
                        marginTop: "10px",
                        transition: "color 0.3s ease-in-out",
                        width: "100%",
                        textTransform: "none",
                        whiteSpace: "pre-line", // Allows for line breaks
                      }}
                    >
                      {category.category_name}
                    </Button>
                  </Link>

                  {/* Delete Icon */}
                  <IconButton
                    color="error"
                    onClick={() => handleDeleteClick(category.category_id)}
                  >
                    <Delete />
                  </IconButton>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Dialog */}
      <Dialog
        open={isEditDialogOpen}
        onClose={handleEditDialogClose}
        aria-labelledby="form-dialog-title"
        sx={{
          alignItems: "center",
          textAlign: "center", // Center the content
          width: "440px", // Set a maximum width for the dialog
          margin: "auto", // Center the dialog horizontally
        }}
      >
        {notification && (
          <Alert
            severity={notification.type ? notification.type : "info"}
            onClose={() => {
              setNotification(null);
              clearNotificationTimeout();
            }}
          >
            {notification.message}
          </Alert>
        )}
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
              <strong>Current Image Preview:</strong>
              <img
                src={editImageUrl}
                alt="Current Preview"
                style={{
                  maxWidth: "100%",
                  maxHeight: "200px",
                  marginTop: "10px",
                }}
              />
            </div>
          )}
          <div>
            Select new image
            <br />
            <input
              type="file"
              accept=".jpg, .jpeg, .png, .gif, .tiff, .eps, .raw"
              onChange={handleImageChange} // Handle the file change event
            />
          </div>
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

      <div className="delete">
        {/* Delete Confirmation Dialog */}
        <Dialog
          open={isDeleteDialogOpen}
          onClose={handleCancelDelete}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle
            id="form-dialog-title"
            style={{ fontSize: "20px", fontWeight: "bold", color: "red" }}
          >
            Warning!
          </DialogTitle>
          <DialogContent>
            <DialogContentText
              style={{
                fontSize: "17px",
                color: "black",
                maxWidth: "none", // Allow content to spread along width
                margin: 0, // Remove margin
              }}
            >
              Are you sure you want to delete this category? <br></br> This will
              remove category and relevant questions too.
            </DialogContentText>
            <DialogActions className="buttons">
              <Button
                onClick={handleCancelDelete}
                color="secondary"
                style={{ border: "1px solid #000" }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmDelete}
                color="secondary"
                style={{ border: "1px solid #000" }}
              >
                Confirm Delete
              </Button>
            </DialogActions>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

export default PreviewCategory;
