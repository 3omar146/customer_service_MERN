import React from "react";
import "../Style/Navbar.css";
import axios from "axios";
import { FaUserCircle, FaSignOutAlt, FaHome } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function Navbar({ type }) {

  const navigate = useNavigate();

  const handleHome = () => {
    navigate(`/${type}/dashboard`);
  };

 const handleProfile = () => {
  navigate("/profile", { state: { type } });
};


  const handleLogout = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_API_URL}/authentication/logout`,
        {},
        { withCredentials: true }
      );
      navigate("/", { replace: true });
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <nav className="client-nav">
      <h3 className="nav-title">
        {type.charAt(0).toUpperCase() + type.slice(1)} Portal
      </h3>

      <div className="nav-links">

        <button title="Home" onClick={handleHome}>
          <FaHome />
        </button>

        <button title="Profile" onClick={handleProfile}>
          <FaUserCircle />
        </button>

        <button className="logout" title="Logout" onClick={handleLogout}>
          <FaSignOutAlt />
        </button>

      </div>
    </nav>
  );
}

export default Navbar;
