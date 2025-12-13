import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../Components/Navbar";
import "../Style/ProfilePage.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";

function ProfilePage() {
  const location = useLocation();
  const navigate = useNavigate();

  const type = location.state?.type;

  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);

  // Password-change toggle inside EDIT MODE
  const [changePassword, setChangePassword] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [showOldPwd, setShowOldPwd] = useState(false);
  const [showNewPwd, setShowNewPwd] = useState(false);

  const [updatedData, setUpdatedData] = useState({});

  // Human-friendly fields with backend keys
  const fieldMap = {
    client: [
      { key: "firstName", label: "First Name" },
      { key: "lastName", label: "Last Name" },
      { key: "email", label: "Email" },
      { key: "phone", label: "Phone" }
    ],

    agent: [
      { key: "name", label: "Name" },
      { key: "email", label: "Email" },
      { key: "role", label: "Role" }
    ],

    supervisor: [
      { key: "name", label: "Name" },
      { key: "email", label: "Email" },
      { key: "role", label: "Role" }
    ]
  };

  // Load user
  async function loadUser() {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_API_URL}/user`,
        { withCredentials: true }
      );

      const usr = res.data;
      setUser(usr);

      // initialize edit form
      const initial = {};
      fieldMap[type].forEach(({ key }) => (initial[key] = usr[key] || ""));
      setUpdatedData(initial);

    } catch (err) {
      console.error("Failed to load user:", err);
    }
  }

  useEffect(() => {
    loadUser();
  }, [type]);

  // ---------------------------------------------------
  // SUBMIT HANDLER (PROFILE + OPTIONAL PASSWORD UPDATE)
  // ---------------------------------------------------
  async function handleSubmit(e) {
    e.preventDefault();

    try {
      // ALWAYS UPDATE NORMAL FIELDS
      const res1 = await axios.patch(
        `${import.meta.env.VITE_BACKEND_API_URL}/user`,
        updatedData,
        { withCredentials: true }
      );

      let updatedUser = res1.data.user;

      // OPTIONAL PASSWORD UPDATE
      if (changePassword) {
        await axios.patch(
          `${import.meta.env.VITE_BACKEND_API_URL}/user/password`,
          { oldPassword, newPassword },
          { withCredentials: true }
        );
      }

      // Reset edit mode
      setUser(updatedUser);
      setEditMode(false);
      setChangePassword(false);
      setOldPassword("");
      setNewPassword("");

    } catch (err) {
      console.error("Update failed:", err);
      alert(err.response?.data?.message || "Error updating profile");
    }
  }

  if (!user) return <p>Loading profile...</p>;

  return (
    <>
      <Navbar type={type} />

      <div className="profile-container">
        <h2 className="profile-title">My Profile</h2>

        {/* ---------------- VIEW MODE ---------------- */}
        {!editMode ? (
          <div className="profile-box">
            {fieldMap[type].map(({ key, label }) => (
              <p className="info" key={key}>
                <strong>{label}:</strong> {String(user[key])}
              </p>
            ))}

            <div className="profile-actions">
              <button className="profile-btn" onClick={() => setEditMode(true)}>
                Edit Profile
              </button>

              <button
                className="logout-btn"
                onClick={async () => {
                  await axios.post(
                    `${import.meta.env.VITE_BACKEND_API_URL}/logout`,
                    {},
                    { withCredentials: true }
                  );
                  navigate("/login");
                }}
              >
                Logout
              </button>
            </div>
          </div>
        ) : (
          /* ---------------- EDIT MODE ---------------- */
          <form className="profile-form" onSubmit={handleSubmit}>

            {/* Editable fields */}
            {fieldMap[type].map(({ key, label }) => {
              const isReadOnly = key === "role";

              return (
                <input
                  key={key}
                  type="text"
                  placeholder={label}
                  value={updatedData[key]}
                  disabled={isReadOnly}
                  style={
                    isReadOnly
                      ? { background: "#eee", cursor: "not-allowed" }
                      : {}
                  }
                  onChange={(e) =>
                    !isReadOnly &&
                    setUpdatedData({ ...updatedData, [key]: e.target.value })
                  }
                />
              );
            })}

            {/*  Change password checkbox */}
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "12px"
              }}
            >
              <input
                type="checkbox"
                checked={changePassword}
                onChange={(e) => setChangePassword(e.target.checked)}
              />
              Change Password
            </label>

            {/* Password fields appear ONLY if checkbox is checked */}
            {changePassword && (
              <>
                {/* Old Password */}
                <div className="password-field">
                  <input
                    type={showOldPwd ? "text" : "password"}
                    placeholder="Old Password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                  />
                  <span
                    className="eye-icon"
                    onClick={() => setShowOldPwd(!showOldPwd)}
                  >
                    {showOldPwd ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>

                {/* New Password */}
                <div className="password-field">
                  <input
                    type={showNewPwd ? "text" : "password"}
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <span
                    className="eye-icon"
                    onClick={() => setShowNewPwd(!showNewPwd)}
                  >
                    {showNewPwd ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
              </>
            )}

            {/* ACTION BUTTONS */}
            <div className="profile-actions">
              <button className="profile-btn" type="submit">
                Save
              </button>

              <button
                className="cancel-btn"
                type="button"
                onClick={() => {
                  setEditMode(false);
                  setChangePassword(false);
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </>
  );
}

export default ProfilePage;
