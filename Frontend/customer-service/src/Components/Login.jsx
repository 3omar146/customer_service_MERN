import React, { useState } from "react";
import axios from "axios";
import "../Style/Login.css";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
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

      if (userType === "client") navigate("/client/dashboard");
      else if (userType === "agent") navigate("/agent/dashboard");
      else if (userType === "supervisor") navigate("/supervisor/dashboard");
      else setError("Unknown user type.");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
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
          <div className="login-password-field">
            <input
              type={showPwd ? "text" : "password"}
              placeholder="Enter your password..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <span
              className="login-eye-icon"
              onClick={() => setShowPwd(!showPwd)}
            >
              {showPwd ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {error && <p className="login-error">{error}</p>}

          <button type="submit" className="login-btn">
            Login
          </button>

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
