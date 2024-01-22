import { Box, Button, Container, TextField, Typography } from "@mui/material";
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
  const [errorMessages, setErrorMessages] = useState([]);

  const handleChangePassword = () => {
    // Clear previous error messages
    setErrorMessages([]);

    // Validate inputs
    if (!oldPassword || !newPassword || !confirmPassword) {
      setErrorMessages(["All fields must be filled"]);
      // Reset input fields to null
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessages(["Entered passwords do not match"]);
      // Reset input fields to null
      setNewPassword("");
      setConfirmPassword("");
      setOldPassword("");
      return;
    }

    // Create the request payload
    const requestBody = {
      oldPassword,
      newPassword,
    };

    // Make the API request
    fetch(
      "http://ec2-3-144-111-86.us-east-2.compute.amazonaws.com:8080/admin/changeSuperAdminPassword/1",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      }
    )
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Password change failed. Please check your inputs.");
        }
      })
      .then((data) => {
        setMessage("Password changed successfully!");
        // Navigate to the home page ("/") after successful password change
        navigate("/");
      })
      .catch((error) => {
        setErrorMessages([error.message]);
      });
  };

  // Function to display error messages for 4 seconds
  const displayErrorMessages = () => {
    setTimeout(() => {
      setErrorMessages([]);
    }, 4000);
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
              onChange={(e) => setOldPassword(e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="New Password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              fullWidth
              margin="normal"
            />
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                handleChangePassword();
                displayErrorMessages();
              }}
            >
              Change Password
            </Button>
            {errorMessages.map((error, index) => (
              <Typography key={index} color="error" mt={2}>
                {error}
              </Typography>
            ))}
            <Typography mt={2}>{message}</Typography>
          </Box>
        </Box>
      </Container>
    </div>
  );
}

export default Profile;
