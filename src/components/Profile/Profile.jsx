import {
  Alert,
  Box,
  Button,
  Container,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../Header/Header";

function Profile() {
  const navigate = useNavigate();

  const [userName, setUserName] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [errorMessages, setErrorMessages] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChangePassword = () => {
    // Clear previous error messages
    setErrorMessages({
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

    // Validate inputs
    if (!oldPassword.trim() || !newPassword.trim() || !confirmPassword.trim()) {
      setErrorMessages((prevErrors) => ({
        oldPassword: !oldPassword.trim()
          ? "Old password is required"
          : prevErrors.oldPassword,
        newPassword: !newPassword.trim()
          ? "New password is required"
          : prevErrors.newPassword,
        confirmPassword: !confirmPassword.trim()
          ? "Confirm password is required"
          : prevErrors.confirmPassword,
      }));
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessages({
        newPassword: "New passwords do not match with Confirm Password",
        confirmPassword: "Confirm passwords do not match with New Password",
      });
      return;
    }

    // Rest of the code remains unchanged
    const requestBody = {
      oldPassword,
      newPassword,
    };

    fetch("http://localhost:8080/admin/changeSuperAdminPassword/1", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Password change failed. Please check your inputs.");
        }
      })
      .then((data) => {
        setMessage("Password changed successfully!");

        // Wait for 1 second before navigating
        setTimeout(() => {
          // Navigate to the home page ("/") after successful password change
          navigate("/");
        }, 1500);
      })
      .catch((error) => {
        setMessage("Password not changed. " + error.message);
        setErrorMessages({
          oldPassword: error.message,
          newPassword: "",
          confirmPassword: "",
        });
      });
  };

  const displayErrorMessages = () => {
    setErrorMessages((prevErrors) => ({
      oldPassword: !oldPassword.trim() ? prevErrors.oldPassword : "",
      newPassword: !newPassword.trim() ? prevErrors.newPassword : "",
      confirmPassword: !confirmPassword.trim()
        ? prevErrors.confirmPassword
        : "",
    }));
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
          <Typography variant="h4">Profile</Typography>

          <Box mt={4}>
            <Typography variant="h5">Change Password</Typography>
            <TextField
              label="Old Password"
              type="password"
              value={oldPassword}
              onChange={(e) => {
                setOldPassword(e.target.value);
                displayErrorMessages();
              }}
              fullWidth
              margin="normal"
              error={Boolean(errorMessages.oldPassword)}
              helperText={errorMessages.oldPassword}
            />
            <TextField
              label="New Password"
              type="password"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                displayErrorMessages();
              }}
              fullWidth
              margin="normal"
              error={Boolean(errorMessages.newPassword)}
              helperText={errorMessages.newPassword}
            />
            <TextField
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                displayErrorMessages();
              }}
              fullWidth
              margin="normal"
              error={Boolean(errorMessages.confirmPassword)}
              helperText={errorMessages.confirmPassword}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                handleChangePassword();
              }}
            >
              Change Password
            </Button>

            {message && (
              <Alert severity="success" sx={{ marginTop: 2 }}>
                {message}
              </Alert>
            )}
          </Box>
        </Box>
      </Container>
    </div>
  );
}

export default Profile;
