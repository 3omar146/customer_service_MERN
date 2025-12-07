import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import DataTable from "../Components/DataTable";
import Navbar from "../Components/Navbar";
import "../Style/AgentDetails.css";

export default function CaseDetails({ isSupervisorView = true }) {
  const location = useLocation();
  const navigate = useNavigate();
  const CaseID = location.state?.CaseID;

  const [caseItem, setCaseItem] = useState(null);
  const [report, setReport] = useState([]);
  const [agents, setAgents] = useState([]);
  const [selectedAgentId, setSelectedAgentId] = useState(null);
  const [loadingAgents, setLoadingAgents] = useState(true);
  const [error, setError] = useState("");

  /* -------------------- AGENTS TABLE COLUMNS -------------------- */
  const agentColumns = [
    { header: "Name", accessor: "name" },
    { header: "Email", accessor: "email" },
    { header: "Department", accessor: "department" },
    { header: "Active", accessor: "isActive" },
  ];

  /* -------------------- FETCH CASE DETAILS -------------------- */
  useEffect(() => {
    if (!CaseID) {
      setError("Case ID not provided.");
      return;
    }

    axios
      .get(`${import.meta.env.VITE_BACKEND_API_URL}/cases/${CaseID}`)
      .then(res => setCaseItem(res.data))
      .catch(err => {
        console.error(err);
        setError("Failed to load case details.");
      });
  }, [CaseID]);

  /* -------------------- FETCH REPORT (SOLVED ONLY) -------------------- */
  useEffect(() => {
    if (!caseItem || caseItem.case_status !== "solved") return;

    axios
      .get(`${import.meta.env.VITE_BACKEND_API_URL}/logs/case/${CaseID}`)
      .then(res => setReport(res.data))
      .catch(err => console.error("Error fetching report:", err));
  }, [caseItem, CaseID]);

  /* -------------------- FETCH ALL AGENTS -------------------- */
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_API_URL}/agents/supervisor`, { withCredentials: true })
      .then(res => setAgents(res.data))
      .catch(err => console.error("Error fetching agents:", err))
      .finally(() => setLoadingAgents(false));
  }, []);

  /* -------------------- ASSIGN AGENT -------------------- */
async function assignAgent() {
  if (!selectedAgentId) return;

  try {
    await axios.patch(
      `${import.meta.env.VITE_BACKEND_API_URL}/agents/assign/${CaseID}/agent/${selectedAgentId}`
    );

    // Update UI without reload
    const assignedAgent = agents.find(a => a._id === selectedAgentId);

    setCaseItem(prev => ({
      ...prev,
      assignedAgentID: assignedAgent
    }));

    setSelectedAgentId(null);
  } catch (error) {
    console.error("Error assigning agent:", error);
  }
}


  /* -------------------- UNASSIGN AGENT -------------------- */
  async function unassignAgent() {
    try {

      await axios.patch(
        `${import.meta.env.VITE_BACKEND_API_URL}/cases/unassign/${CaseID}/agent/${caseItem.assignedAgentID._id}`
      );

      setCaseItem({ ...caseItem, assignedAgentID: null });
    } catch (error) {
      console.error("Error unassigning agent:", error);
    }
  }

  if (error) return <p>{error}</p>;
  if (!caseItem) return <p>Loading case details...</p>;

  return (
    <>
      <Navbar type="supervisor" />

      <div className="agent-details-container">
        <h2 className="page-title">Case Details</h2>

        {/* -------------------- CASE INFO -------------------- */}
        <div className="agent-details-top">
          <div className="agent-info">
            <p><strong>Description:</strong> {caseItem.case_description}</p>
            <p><strong>Status:</strong> {caseItem.case_status}</p>
            <p><strong>Created At:</strong> {new Date(caseItem.createdAt).toLocaleString()}</p>
          </div>

          {isSupervisorView && (
            <button
              className="delete-button"
              onClick={() => {
                axios
                  .delete(`${import.meta.env.VITE_BACKEND_API_URL}/cases/${CaseID}`)
                  .then(() => {
                    alert("Case deleted");
                    navigate(-1);
                  });
              }}
            >
              Delete Case
            </button>
          )}
        </div>

        {/* -------------------- CASE REPORT -------------------- */}
       {caseItem.case_status === "solved" && (
  <div className="report">
    <h3>Case Log</h3>

    {report.length === 0 ? (
      <p>No Log available.</p>
    ) : (
      report.map((log, index) => (
        <div key={index}>
          <p><strong>Agent:</strong> {log.agentName}</p>
          <p><strong>Email:</strong> {log.agentEmail}</p>
          <p><strong>Action Type:</strong> {log.actionType}</p>
          <p><strong>Protocol:</strong> {log.actionProtocol}</p>
          <p>
            <strong>Time:</strong>{" "}
            {new Date(log.timestamp).toLocaleString()}
          </p>
          <hr />
        </div>
      ))
    )}
  </div>
)}
        {/* -------------------- ASSIGNED AGENT -------------------- */}
        <div className="assigned-cases">
          <h3>Assigned Agent</h3>

          {!caseItem.assignedAgentID  ? (
            <p>No agent assigned.</p>
          ) : (
            <div className="agent-info">
              <p><strong>Name:</strong> {caseItem.assignedAgentID.name}</p>
              <p><strong>Email:</strong> {caseItem.assignedAgentID.email}</p>

              {isSupervisorView&&caseItem.case_status!=="solved"&& (
                <button className="solve-btn" onClick={unassignAgent}>
                  Unassign Agent
                </button>
              )}
            </div>
          )}
        </div>

        {/* -------------------- AGENTS TABLE -------------------- */}
        {caseItem.case_status === "unsolved" && (
          <div className="agent-data-table">
            <h3>Available Agents</h3>

            {loadingAgents ? (
              <p>Loading agents...</p>
            ) : (
              <>
                <DataTable
                  columns={agentColumns}
                  data={agents}
                  selectedId={selectedAgentId}
                  setSelectedId={setSelectedAgentId}
                />

                {selectedAgentId && (
                  <button className="solve-btn" onClick={assignAgent}>
                    Assign Selected Agent
                  </button>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
}
