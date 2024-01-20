import { Email, Lock } from "@mui/icons-material";
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
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:8080/admin/login",
        values
      );

      if (response.data.status) {
        localStorage.setItem("token", response.data.token);

        navigate("/dd");
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred during login");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 loginPage">
      <div className="p-4 rounded w-400 h-400 border loginForm">
        <div className="text-warning">{error && error}</div>
        <h3>Login</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="position-relative w-100 ">
              <strong>Username:</strong>
            </label>
            <div className="d-flex align-items-center">
              <Email sx={{ fontSize: 18, marginRight: 2 }} />
              <input
                name="username"
                autoComplete="off"
                placeholder="Enter Username"
                required
                onChange={(e) =>
                  setValues((prevValues) => ({
                    ...prevValues,
                    username: e.target.value,
                  }))
                }
                className="form-control rounded-0"
              />
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="password">
              <strong>Password:</strong>
            </label>
            <div className="d-flex align-items-center">
              <Lock sx={{ fontSize: 18, marginRight: 2 }} />
              <input
                type="password"
                name="password"
                placeholder="Enter Password"
                required
                onChange={(e) =>
                  setValues((prevValues) => ({
                    ...prevValues,
                    password: e.target.value,
                  }))
                }
                className="form-control rounded-0"
              />
            </div>
          </div>
          <div className="text-center">
            <button
              type="submit"
              className="btn btn-primary w-50 rounded-15 mb-2"
            >
              Log in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
