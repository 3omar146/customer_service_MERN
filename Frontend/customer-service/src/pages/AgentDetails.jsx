import React, { useState, useEffect } from "react";
import axios from "axios";
import "../Style/AgentDetails.css";

export default function AgentDetails({ AgentID }) {
  const [agent, setAgent] = useState(null);
  const [report, setReport] = useState(null);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_BACKEND_API_URL}/agents/${AgentID}`)
      .then(res => {
        const data = res.data.agent ?? (Array.isArray(res.data) ? res.data[0] : res.data);
        setAgent(data);
      })
      .catch(err => console.error("Error fetching agent details:", err));
  }, [AgentID]);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_BACKEND_API_URL}/agents/report/${AgentID}`)
      .then(res => setReport(res.data))
      .catch(err => console.error("Error fetching report:", err));
  }, [AgentID]);

  if (!agent) return <p>Loading agent details...</p>;

  return (
   <div className="agent-details-container">
  {/* Centered page title */}
  <h2 className="page-title">Agent Details</h2>

  <div className="agent-details-top">
    {/* Agent Info Left */}
    <div className="agent-info">
      <p><strong>Name:</strong> {agent.name || "N/A"}</p>
      <p><strong>Email:</strong> {agent.email || "N/A"}</p>
      <p><strong>Department:</strong> {agent.department || "N/A"}</p>
      <p><strong>Role:</strong> {agent.role || "N/A"}</p>
      <p><strong>Active:</strong> {agent.isActive ? "Yes" : "No"}</p>
      <p><strong>Last Update:</strong> {agent.updatedAt ? new Date(agent.updatedAt).toLocaleString() : "N/A"}</p>
    </div>

    {/* Delete Button Right */}
    <button
      className="delete-button"
      onClick={() =>
        axios.delete(`${import.meta.env.VITE_BACKEND_API_URL}/agents/${AgentID}`)
          .then(() => alert("Agent deleted"))
          .catch(err => console.error("Error deleting agent:", err))
      }
    >
      Delete Agent
    </button>
  </div>

  {/* Report Centered */}
  <div className="report">
    <h3>Report</h3>
    {!report ? (
      <p>Loading report...</p>
    ) : (
      Object.entries(report).map(([key, value]) => (
        <p key={key}><strong>{key}:</strong> {value?.toString() || "N/A"}</p>
      ))
    )}
  </div>
</div>

  );
}
