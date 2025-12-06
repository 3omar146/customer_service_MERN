import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../Style/Signup.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function SignUpPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    password: ""
  });

  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_API_URL}/authentication/signup`,
        form,
        { withCredentials: true }
      );

      setSuccessMsg("Account created successfully!");

      setTimeout(() => {
        navigate('/client/dashboard');
      }, 800);

    } catch (err) {
      setError(err.response?.data?.message || "Signup failed. Try again.");
    }
  };

  return (
    <div className="signup-wrapper">
      <div className="signup-card">
        <h2 className="signup-title">Client Sign Up</h2>

        <form className="signup-form" onSubmit={handleSubmit}>
          <label>First Name</label>
          <input
            type="text"
            name="firstName"
            placeholder="First name..."
            value={form.firstName}
            onChange={handleChange}
            required
          />

          <label>Last Name</label>
          <input
            type="text"
            name="lastName"
            placeholder="Last name..."
            value={form.lastName}
            onChange={handleChange}
            required
          />

          <label>Phone Number</label>
          <input
            type="text"
            name="phone"
            placeholder="e.g. +201234567890"
            value={form.phone}
            onChange={handleChange}
            required
          />

          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter email..."
            value={form.email}
            onChange={handleChange}
            required
          />

          <label>Password</label>
          <div className="signup-password-field">
            <input
              type={showPwd ? "text" : "password"}
              name="password"
              placeholder="Create a password..."
              value={form.password}
              onChange={handleChange}
              required
            />

            <span
              className="signup-eye-icon"
              onClick={() => setShowPwd(!showPwd)}
            >
              {showPwd ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {error && <p className="signup-error">{error}</p>}
          {successMsg && <p className="signup-success">{successMsg}</p>}

          <button type="submit" className="signup-btn">
            Create Account
          </button>

          <p className="login-text">
            Already have an account?{" "}
            <a href="/login" className="login-link">
              Login
            </a>
          </p>
        </form>

      </div>
    </div>
  );
}
