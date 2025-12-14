import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../Components/Navbar.jsx";
import "../Style/ClientProfile.css";

function ClientProfile() {
  const [client, setClient] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [updatedData, setUpdatedData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: ""
  });

  // Load authenticated client
  async function loadClient() {
    try {
      // AuthMiddleware returns logged-in client
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_API_URL}/clients/default`,
        { withCredentials: true }
      );

      const data = res.data;
      setClient(data);

      setUpdatedData({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone
      });

    } catch (err) {
      console.error("Failed to load client profile:", err);
    }
  }

  useEffect(() => {
    loadClient();
  }, []);

  function handleSubmit(e) {
    e.preventDefault();

    axios
      .put(
        `${import.meta.env.VITE_BACKEND_API_URL}/clients/${client._id}`,
        updatedData,
        { withCredentials: true }
      )
      .then((res) => {
        setClient(res.data);
        setEditMode(false);
      })
      .catch((err) => console.error("Profile update failed:", err));
  }

  if (!client) return <p>Loading profile...</p>;

  return (
    <>
      <Navbar type="client" />

      <div className="profile-container">
        <h2 className="profile-title">My Profile</h2>

        {!editMode ? (
          <div className="profile-box">

            <p>
              <strong>Name:</strong> {client.firstName} {client.lastName}
            </p>

            <p>
              <strong>Email:</strong> {client.email}
            </p>

            <p>
              <strong>Phone:</strong> {client.phone}
            </p>

            <div className="profile-actions">
              <button className="profile-btn" onClick={() => setEditMode(true)}>
                Edit Profile
              </button>

              {/* Logout handled by Navbar only (no localStorage anymore) */}
            </div>
          </div>
        ) : (
          <form className="profile-form" onSubmit={handleSubmit}>
            <input
              required
              type="text"
              placeholder="First Name"
              value={updatedData.firstName}
              onChange={(e) =>
                setUpdatedData({ ...updatedData, firstName: e.target.value })
              }
            />

            <input
              required
              type="text"
              placeholder="Last Name"
              value={updatedData.lastName}
              onChange={(e) =>
                setUpdatedData({ ...updatedData, lastName: e.target.value })
              }
            />

            <input
              required
              type="email"
              placeholder="Email"
              value={updatedData.email}
              onChange={(e) =>
                setUpdatedData({ ...updatedData, email: e.target.value })
              }
            />

            <input
              type="text"
              placeholder="Phone"
              value={updatedData.phone}
              onChange={(e) =>
                setUpdatedData({ ...updatedData, phone: e.target.value })
              }
            />

            <div className="profile-actions">
              <button className="profile-btn" type="submit">
                Save
              </button>

              <button
                className="cancel-btn"
                type="button"
                onClick={() => setEditMode(false)}
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

export default ClientProfile;
