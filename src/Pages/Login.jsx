import { Email, Lock } from "@mui/icons-material";
import { CircularProgress, Snackbar } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../components/style.css";

const Login = () => {
  const [values, setValues] = useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true); // Set loading state to true during login

      const response = await axios.post(
        "http://3.21.185.105:3006/admin/login",
        values
      );

      if (response.data.status) {
        localStorage.setItem("token", response.data.token);

        // Store username and password in localStorage
        localStorage.setItem("username", values.username);
        localStorage.setItem("password", values.password);

        setOpenSnackbar(true); // Open the success snackbar
        setTimeout(() => {
          setOpenSnackbar(false); // Close the snackbar after 1 second
          navigate("/dd");
        }, 1000);
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred during login");
    } finally {
      setLoading(false); // Set loading state back to false after login attempt
    }
  };

  const handleInputChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });

    setErrors({
      ...errors,
      [e.target.name]: "", // Clear the validation error when the user types
    });
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 loginPage">
      <div className="p-4 rounded w-400 h-400 border loginForm">
        <h3 className="mb-4">Login</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <div className="d-flex align-items-center ">
              <Email sx={{ fontSize: 18, marginRight: 2 }} />
              <input
                name="username"
                autoComplete="off"
                placeholder="Enter Username"
                required
                onChange={handleInputChange}
                className={`form-control rounded-3 ${
                  errors.username && "border border-danger"
                }`}
              />
              <div className="text-danger">{errors.username}</div>
            </div>
          </div>
          <div className="mb-3">
            <div className="d-flex align-items-center">
              <Lock sx={{ fontSize: 18, marginRight: 2 }} />
              <input
                type="password"
                name="password"
                placeholder="Enter Password"
                required
                onChange={handleInputChange}
                className={`form-control rounded-3 ${
                  errors.password && "border border-danger"
                }`}
              />
              <div className="text-danger">{errors.password}</div>
            </div>
          </div>
          <div className="text-danger mb-4" style={{ fontSize: "1.5rem" }}>
            {error && <strong>{error}</strong>}
          </div>
          <div className="text-center">
            {/* Conditionally render the button or CircularProgress */}
            {loading ? (
              <CircularProgress size={24} />
            ) : (
              <button
                type="submit"
                className="btn btn-primary w-50 rounded-15 mb-2"
              >
                Log in
              </button>
            )}
          </div>
        </form>
      </div>
      {/* Snackbar for login success */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={1000} // Adjust as needed
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MuiAlert
          onClose={handleCloseSnackbar}
          severity="success"
          sx={{ width: "100%" }}
        >
          Logging Successful
        </MuiAlert>
      </Snackbar>
    </div>
  );
};

export default Login;
