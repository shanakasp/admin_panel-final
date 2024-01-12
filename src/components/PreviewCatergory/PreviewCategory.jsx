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
import Header from "../Header/Header";
import "./styles.css";

function PreviewCategory() {
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [editCategoryId, setEditCategoryId] = useState(null);
  const [editCategoryName, setEditCategoryName] = useState("");
  const [editImageUrl, setEditImageUrl] = useState("");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteCategoryId, setDeleteCategoryId] = useState(null);

  useEffect(() => {
    // Fetch data from your backend API
    fetch(
      "http://ec2-3-139-78-36.us-east-2.compute.amazonaws.com:8000/category/getAllCategories"
    )
      .then((response) => response.json())
      .then((data) => setCategories(data.result.data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const filteredCategories = categories.filter((category) =>
    category.category_name.toLowerCase().includes(search.toLowerCase())
  );

  const handleEditClick = (categoryId, categoryName, imageUrl) => {
    setEditCategoryId(categoryId);
    setEditCategoryName(categoryName);
    setEditImageUrl(imageUrl);
    setIsEditDialogOpen(true);
  };

  const handleEditDialogClose = () => {
    setIsEditDialogOpen(false);
  };

  const handleEditSave = () => {
    // Send a request to update the category with the provided data
    fetch(
      `http://ec2-3-139-78-36.us-east-2.compute.amazonaws.com:8000/category/updateCategoryByID/${editCategoryId}`,
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

        // Close the edit dialog
        handleEditDialogClose();

        // Refresh the category list
        fetch(
          "http://ec2-3-139-78-36.us-east-2.compute.amazonaws.com:8000/category/getAllCategories"
        )
          .then((response) => response.json())
          .then((data) => setCategories(data.result.data))
          .catch((error) => console.error("Error fetching data:", error));
      })
      .catch((error) => {
        console.error("Error updating category:", error);
      });
  };

  const handleDeleteClick = (categoryId) => {
    // Open a custom styled delete confirmation dialog
    setDeleteCategoryId(categoryId);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    // Proceed with the delete logic
    fetch(
      `http://ec2-3-139-78-36.us-east-2.compute.amazonaws.com:8000/category/deleteCategoryByID/${deleteCategoryId}`,
      {
        method: "DELETE",
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log("Category deleted successfully:", data);

        // Refresh the category list after successful deletion
        fetch(
          "http://ec2-3-139-78-36.us-east-2.compute.amazonaws.com:8000/category/getAllCategories"
        )
          .then((response) => response.json())
          .then((data) => setCategories(data.result.data))
          .catch((error) => console.error("Error fetching data:", error));
      })
      .catch((error) => {
        console.error("Error deleting category:", error);
      })
      .finally(() => {
        // Close the delete dialog
        setIsDeleteDialogOpen(false);
      });
  };

  const handleCancelDelete = () => {
    // Close the delete dialog
    setIsDeleteDialogOpen(false);
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
                  className="categoryName"
                  onMouseOver={(e) =>
                    (e.target.style.backgroundColor = "#2196f3")
                  }
                  onMouseOut={(e) =>
                    (e.target.style.backgroundColor = "#3f51b5")
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
          <TextField
            autoFocus
            margin="dense"
            id="categoryName"
            label="Category Name"
            type="text"
            fullWidth
            value={editCategoryName}
            onChange={(e) => setEditCategoryName(e.target.value)}
          />
          <TextField
            margin="dense"
            id="imageUrl"
            label="Image URL"
            type="text"
            fullWidth
            value={editImageUrl}
            onChange={(e) => setEditImageUrl(e.target.value)}
          />
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
