import { Delete, Edit } from "@mui/icons-material";
import {
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
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { storage } from "../AddCategory/Firebaseconfig";
import Header from "../Header/Header";
import "./styles.css";
function PreviewCategory() {
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [editCategoryId, setEditCategoryId] = useState(null);
  const [editCategoryName, setEditCategoryName] = useState("");
  const [editImageUrl, setEditImageUrl] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteCategoryId, setDeleteCategoryId] = useState(null);

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

  const filteredCategories = Array.isArray(categories)
    ? categories.filter((category) =>
        category.category_name.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  const handleEditClick = (categoryId, categoryName, imageUrl) => {
    setEditCategoryId(categoryId);
    setEditCategoryName(categoryName);
    setEditImageUrl(imageUrl);
    setIsEditDialogOpen(true);
  };

  const handleEditDialogClose = () => {
    setIsEditDialogOpen(false);
  };

  const handleEditSave = async () => {
    // Check if a new image is selected
    if (editImageUrl instanceof File) {
      try {
        // Upload image to Firebase
        const imageUrl = await uploadImageToFirebase(editImageUrl);

        // Save category name and image URL in the database
        fetch(
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
        )
          .then((response) => response.json())
          .then((data) => {
            console.log("Category updated successfully:", data);

            handleEditDialogClose();

            // Fetch updated data from the server
            fetch("http://localhost:8080/category/getAllCategories")
              .then((response) => response.json())
              .then((data) => setCategories(data.result.data))
              .catch((error) => console.error("Error fetching data:", error));
          })
          .catch((error) => {
            console.error("Error updating category:", error);
          });
      } catch (error) {
        console.error("Error uploading image to Firebase:", error);
      }
    } else {
      // If no new image is selected, update only the category name
      fetch(
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
      )
        .then((response) => response.json())
        .then((data) => {
          console.log("Category updated successfully:", data);

          handleEditDialogClose();

          // Fetch updated data from the server
          fetch("http://localhost:8080/category/getAllCategories")
            .then((response) => response.json())
            .then((data) => setCategories(data.result.data))
            .catch((error) => console.error("Error fetching data:", error));
        })
        .catch((error) => {
          console.error("Error updating category:", error);
        });
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
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      setEditImageUrl(URL.createObjectURL(selectedFile));

      // Preview the image
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
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

                {/* Two Buttons */}
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

                  {/* Delete Icon */}
                  <IconButton
                    color="secondary"
                    onClick={() => handleDeleteClick(category.category_id)}
                  >
                    <Delete />
                  </IconButton>
                </div>
              </div>

              {/* Category Name with Link */}
              <Link
                to={`/form/${category.category_id}`}
                style={{ textDecoration: "none" }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  style={{
                    fontSize:
                      category.category_name.length > 10 ? "14px" : "10px",
                    lineHeight:
                      category.category_name.length > 10 ? "1.4" : "1.2",
                    marginTop: "10px",
                    transition: "color 0.3s ease-in-out",
                  }}
                  onMouseOver={(e) =>
                    (e.target.style.backgroundColor = "#3f51b5")
                  }
                  onMouseOut={(e) =>
                    (e.target.style.backgroundColor = "#2196f3")
                  }
                >
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
          <DialogContentText>
            Edit the details for the selected category.
          </DialogContentText>

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

          {/* Input for new image */}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ marginBottom: "10px" }}
          />

          {editImageUrl && (
            <div>
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
          <DialogContentText style={{ fontSize: "17px", color: "black" }}>
            Are you sure to delete the category? This will remove this category
            and relevant questions too.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="secondary">
            Confirm Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default PreviewCategory;
