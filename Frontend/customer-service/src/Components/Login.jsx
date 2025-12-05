import React, { useState } from "react";
import axios from "axios";
import "../Style/Login.css";
import { useNavigate } from "react-router-dom";
export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_API_URL}/authentication/login`,
        { email, password },
        { withCredentials: true }
      );

      const userType = res.data.type;

      // Redirect based on type
      if (userType === "client") {
        navigate("/client/dashboard");
      } else if (userType === "agent") {
        navigate("/agent/dashboard");
      } else if (userType === "supervisor") {
        navigate("/supervisor/dashboard");
      } else {
        setError("Unknown user type.");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. Please try again."
      );
    }
  };

  return (
  <div className="login-wrapper">
    <div className="login-card">
      <h2 className="login-title">Login</h2>

      <form className="login-form" onSubmit={handleSubmit}>
        <label>Email</label>
        <input
          type="email"
          placeholder="Enter your email..."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>Password</label>
        <input
          type="password"
          placeholder="Enter your password..."
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p className="login-error">{error}</p>}

        <button type="submit" className="login-btn">
          Login
        </button>

        {/* ---- SIGN UP LINK ---- */}
        <p className="signup-text">
          Don't have an account?{" "}
          <a href="/signup" className="signup-link">
            Sign up
          </a>
        </p>
      </form>
    </div>
  </div>
);

}
