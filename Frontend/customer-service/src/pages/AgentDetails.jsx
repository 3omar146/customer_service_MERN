import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import CaseCard from "../Components/CaseCard";
import DataTable from "../Components/DataTable";
import "../Style/AgentDetails.css";
import Navbar from "../Components/Navbar";

export default function AgentDetails({ isSupervisorView = true }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { AgentID } = location.state || {};
  
  const [agent, setAgent] = useState(null);
  const [report, setReport] = useState(null);
  const [pendingCases, setPendingCases] = useState([]);
  const [solvedCases, setSolvedCases] = useState([]);
  const [unsolvedCases, setUnsolvedCases] = useState([]);
  const [loadingUnsolvedCases, setLoadingUnsolvedCases] = useState(true);
  const [loadingPendingCases, setLoadingPendingCases] = useState(true);
  const [loadingSolvedCases, setLoadingSolvedCases] = useState(true);
  const [selectedId, setSelectedId] = useState(null);

  // columns in the table of unsolved cases
  const columns = [
  { header: "Description", accessor: "case_description" },
  { header: "Status", accessor: "case_status" },
  { header: "Created At", accessor: "createdAt" },
];

  // Fetch agent details
  useEffect(() => {
    axios.get(`${import.meta.env.VITE_BACKEND_API_URL}/agents/SpecificAgent/${AgentID}`)
      .then(res => {
        const data = res.data.agent ?? (Array.isArray(res.data) ? res.data[0] : res.data);
        setAgent(data);
      })
      .catch(err => console.error("Error fetching agent details:", err));
  }, [AgentID]);

  // Fetch agent report
  useEffect(() => {
    axios.get(`${import.meta.env.VITE_BACKEND_API_URL}/agents/Agentreport/${AgentID}`,{withCredentials:true})
      .then(res => setReport(res.data))
      .catch(err => console.error("Error fetching report:", err));
  }, [AgentID]);

  // Fetch pending cases
  useEffect(() => {
    const fetchPendingCases = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_API_URL}/cases/pending/${AgentID}`,{withCredentials:true});
        setPendingCases(res.data);
      } catch (err) {
        console.error("Error fetching pending cases:", err);
      } finally {
        setLoadingPendingCases(false);
      }
    };
    fetchPendingCases();
  }, [AgentID]);

  // Fetch solved cases
  useEffect(() => {
    const fetchSolvedCases = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_API_URL}/cases/solved/${AgentID}`);
        setSolvedCases(res.data);
      } catch (err) {
        console.error("Error fetching solved cases:", err);
      } finally {
        setLoadingSolvedCases(false);
      }
    };
    fetchSolvedCases();
  }, [AgentID]);
  //fetch unsolved cases
  useEffect(() => {
    const fetchUnSolvedCases = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_API_URL}/cases/unassigned/`,{withCredentials:true});
        setUnsolvedCases(res.data);
      } catch (err) {
        console.error("Error fetching solved cases:", err);
      } finally {
        setLoadingUnsolvedCases(false);
      }
    };
    fetchUnSolvedCases();
  }, [AgentID]);

  async function assignCase() {
  if (!selectedId) return;

  try {
    await axios.patch(
      `${import.meta.env.VITE_BACKEND_API_URL}/agents/assign/${selectedId}/agent/${AgentID}`,
      { agentId: AgentID }
    );

    alert("Case assigned successfully!");
window.location.reload();

    // Remove assigned case from unsolved list
    setUnsolvedCases(prev => prev.filter(c => c._id !== selectedId));

    setSelectedId(null);
  } catch (error) {
    console.error("Error assigning case:", error);
  }
}
async function unassignCase(caseId){
  if (!caseId) return;

  try {
    await axios.patch(

      `${import.meta.env.VITE_BACKEND_API_URL}/cases/unassign/${caseId}/agent/${AgentID}`,
      { agentId: null } // or just remove agentId from payload
    );

    // Update local state
    setPendingCases(prev => prev.map(c =>
      c._id === caseId ? { ...c, assignedAgentID: null, agentEmail: null } : c
    ));

    alert("Case unassigned successfully!");
window.location.reload();
  } catch (error) {
    console.error("Error unassigning case:", error);
  }
}

  // Handle solving a case (only in agent view)
  // const handleSolve = async (caseId) => {
  //   try {
  //     await axios.patch(`${import.meta.env.VITE_BACKEND_API_URL}/cases/solve/${caseId}`);
  //     setPendingCases(prev =>
  //       prev.map(c => c._id === caseId ? { ...c, case_status: "solved" } : c)
  //     );
  //   } catch (err) {
  //     console.error("Error solving case:", err);
  //   }
  // };

  if (!agent) return <p>Loading agent details...</p>;

  return (
    <>
    <Navbar type="supervisor"/>
    <div className="agent-details-container">
      <h2 className="page-title">Agent Details</h2>

      <div className="agent-details-top">
        <div className="agent-info">
          <p><strong>Name:</strong> {agent.name || "N/A"}</p>
          <p><strong>Email:</strong> {agent.email || "N/A"}</p>
          <p><strong>Role:</strong> {agent.role || "N/A"}</p>
          <p><strong>Active:</strong> {agent.isActive ? "Yes" : "No"}</p>
          <p><strong>Last Update:</strong> {agent.updatedAt ? new Date(agent.updatedAt).toLocaleString() : "N/A"}</p>
        </div>

        <button
          className="delete-button"
          onClick={() =>
            axios.delete(`${import.meta.env.VITE_BACKEND_API_URL}/agents/${AgentID}`)
              .then(() => { 
                alert("Agent deleted");
                navigate(-1);
              })
              .catch(err => console.error("Error deleting agent:", err))
          }
        >
          Delete Agent
        </button>
      </div>

      <div className="report">
        <h3>{agent.name} Report</h3>
        {!report ? (
          <p>Loading report...</p>
        ) : (
          Object.entries(report).map(([key, value]) => (
            <p key={key}><strong>{key}:</strong> {value?.toString() || "N/A"}</p>
          ))
        )}
      </div>

      {/* Pending Cases Section */}
      <div className="assigned-cases">
        <h3>Pending Cases</h3>
        {loadingPendingCases ? (
          <p>Loading pending cases...</p>
        ) : pendingCases.length === 0 ? (
          <p>No pending cases assigned to this agent.</p>
        ) : (
          <div className="cases-grid">
            {pendingCases.map(caseItem => (
      <CaseCard
  key={caseItem._id}
  caseItem={caseItem}
  onUnassign={isSupervisorView ? unassignCase : undefined}
  isSupervisorView={isSupervisorView}
/>

            ))}
          </div>
        )}
      </div>

      {/* Solved Cases Section */}
      <div className="assigned-cases">
        <h3>Solved Cases</h3>
        {loadingSolvedCases ? (
          <p>Loading solved cases...</p>
        ) : solvedCases.length === 0 ? (
          <p>No solved cases assigned to this agent.</p>
        ) : (
          <div className="cases-grid">
            {solvedCases.map(caseItem => (
              <CaseCard
                key={caseItem._id}
                caseItem={caseItem}
                isSupervisorView={isSupervisorView}
              />
            ))}
          </div>
        )}
      </div>

      {/* Alternative DataTable view for unsolved cases */}
      {/* Unsolved Cases Table */}
<div className="agent-data-table">
  <h3>Unsolved Cases</h3>

  {loadingUnsolvedCases ? (
    <p>Loading cases...</p>
  ) : unsolvedCases.length === 0 ? (
    <p>No unsolved cases.</p>
  ) : (
    <>
      <DataTable
        columns={columns}
        data={unsolvedCases}
        selectedId={selectedId}
        setSelectedId={setSelectedId}
      />

      {/* Assign button only when selecting an unsolved case */}
      {selectedId && (
        <button
          className="solve-btn"
          style={{ marginTop: "15px" }}
          onClick={assignCase}
        >
          Assign Selected Case to agent {agent.name}
        </button>
      )}
    </>
  )}
</div>

    </div>
    </>
  );
}
