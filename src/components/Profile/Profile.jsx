import {
  Alert,
  Box,
  Button,
  CircularProgress,
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
  const [loading, setLoading] = useState(false);

  // Function to validate password strength
  const isStrongPassword = (password) => {
    // Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one symbol
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleChangePassword = () => {
    // Validate new password strength
    if (!isStrongPassword(newPassword)) {
      setErrorMessages({
        newPassword:
          "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one symbol.",
        confirmPassword: "",
      });
      return;
    }

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

    // Compare the entered old password with the locally stored password
    const storedPassword = localStorage.getItem("password");

    if (oldPassword !== storedPassword) {
      setErrorMessages({
        oldPassword: "Entered old password is incorrect",
        newPassword: "",
        confirmPassword: "",
      });
      return;
    }

    // Check if the new password and confirm password values are equal
    if (newPassword !== confirmPassword) {
      setErrorMessages({
        // newPassword: "New passwords do not match with Confirm Password",
        confirmPassword: "Confirm passwords do not match with New Password",
      });
      return;
    }

    // Set loading to true
    setLoading(true);

    // Continue with the password change process
    const requestBody = {
      oldPassword,
      newPassword,
    };

    fetch("http://3.143.231.155:3006/admin/changeSuperAdminPassword/1", {
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
      })
      .finally(() => {
        // Set loading back to false after completion
        setLoading(false);
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
              sx={{ marginTop: 2 }}
              onClick={() => {
                handleChangePassword();
              }}
              disabled={loading} // Disable the button when loading is true
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Change Password"
              )}
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
