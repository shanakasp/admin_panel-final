// EditCategoryDialog.js

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";
import React from "react";

function EditCategory({
  isOpen,
  onClose,
  onSave,
  categoryName,
  imageUrl,
  onNameChange,
  onImageUrlChange,
}) {
  return (
    <Dialog open={isOpen} onClose={onClose} aria-labelledby="form-dialog-title">
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
          value={categoryName}
          onChange={onNameChange}
        />
        <TextField
          margin="dense"
          id="imageUrl"
          label="Image URL"
          type="text"
          fullWidth
          value={imageUrl}
          onChange={onImageUrlChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={onSave} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default EditCategory;
