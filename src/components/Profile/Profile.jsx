import { Box, Button, Container, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import Header from "../Header/Header";

function Profile() {
  const [userName, setUserName] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleChangePassword = () => {
    // Create the request payload
    const requestBody = {
      oldPassword,
      newPassword,
    };

    // Make the API request
    fetch(
      "http://ec2-3-139-78-36.us-east-2.compute.amazonaws.com:8000/admin/changeSuperAdminPassword/1",
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
        // Handle any additional logic or update the state as needed
      })
      .catch((error) => {
        setMessage(error.message);
      });
  };

  return (
    <div>
      <Header></Header>
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
          {/*<Box mt={2}>
            <Typography variant="h6">User Name: {userName}</Typography>
          </Box> */}
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
              onClick={handleChangePassword}
            >
              Change Password
            </Button>
            <Typography mt={2}>{message}</Typography>
          </Box>
        </Box>
      </Container>
    </div>
  );
}

export default Profile;
