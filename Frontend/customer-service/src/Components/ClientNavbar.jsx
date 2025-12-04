import React from "react";
import "../Style/ClientNavbar.css";

function ClientNavbar() {
  return (
    <nav className="client-nav">
      <h3 className="nav-title">Client Portal</h3>

      <div className="nav-links">
        <button onClick={() => (window.location.href = "/client/dashboard")}>
          Dashboard
        </button>

        <button onClick={() => (window.location.href = "/client/profile")}>
          Profile
        </button>

        <button
          className="logout"
          onClick={() => {
            localStorage.removeItem("clientID");
            window.location.href = "/client/dashboard";
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default ClientNavbar;
