import React, { useState } from "react";
import "../Style/Signup.css";

export default function SignUpPage() {
  const [form, setForm] = useState({
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    password: ""
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Just demo validation
    if (!form.email || !form.password) {
      setError("Please fill in all required fields.");
      return;
    }

    alert("Client signed up:\n" + JSON.stringify(form, null, 2));
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
          <input
            type="password"
            name="password"
            placeholder="Create a password..."
            value={form.password}
            onChange={handleChange}
            required
          />

          {error && <p className="signup-error">{error}</p>}

          <button type="submit" className="signup-btn">Create Account</button>
        </form>

      </div>
    </div>
  );
}
