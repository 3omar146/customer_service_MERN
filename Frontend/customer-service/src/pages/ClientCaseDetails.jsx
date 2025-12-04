import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ClientNavbar from "../Components/ClientNavbar";
import "../Style/ClientCaseDetails.css";

function ClientCaseDetails() {
  const { caseId } = useParams();
  const [caseData, setCaseData] = useState(null);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_API_URL}/cases/${caseId}`)
      .then((res) => setCaseData(res.data))
      .catch((err) => console.error("Error loading case:", err));
  }, [caseId]);

  if (!caseData) {
    return <p className="loading-text">Loading case...</p>;
  }

  return (
    <>
      <ClientNavbar />
      <div className="case-container">
        <h2>Case Details</h2>

        <div className="case-info-box">
          <p><strong>Description:</strong> {caseData.case_description}</p>
          <p><strong>Status:</strong> {caseData.case_status}</p>
          <p><strong>Created:</strong> {new Date(caseData.createdAt).toLocaleString()}</p>
          <p><strong>Last Update:</strong> {new Date(caseData.updatedAt).toLocaleString()}</p>

          {caseData.assignedAgentID ? (
            <p><strong>Assigned Agent ID:</strong> {caseData.assignedAgentID}</p>
          ) : (
            <p><strong>Assigned Agent:</strong> Not yet assigned</p>
          )}
        </div>

        <button
          className="back-btn"
          onClick={() => window.location.href = "/client/dashboard"}
        >
          Back to Cases
        </button>
      </div>
    </>
  );
}

export default ClientCaseDetails;
