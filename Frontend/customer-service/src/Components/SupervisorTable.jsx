// pages/SupervisorTable.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DataTable from "./DataTable";
import axios from "axios";
import SupervisorReport from "./SupervisorReport";
import "../Style/SupervisorTable.css";

const SupervisorTable = ({ supervisorID }) => {

  const navigate = useNavigate();

  const [agents, setAgents] = useState([]);
  const [cases, setCases] = useState([]);
  const [dataMode, setDataMode] = useState("agents");
  const [selectedId, setSelectedId] = useState(null);
  const [caseFilter, setCaseFilter] = useState("all");
  const [agentFilter, setAgentFilter] = useState("all");

  const [filteredAgents, setFilteredAgents] = useState([]);
  const [filteredCases, setFilteredCasesState] = useState([]);

  // Add agent modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAgent, setNewAgent] = useState({
    name: "",
    email: "",
    password: "",
    role: ""
  });

  // NEW — REPORT MODAL
  const [showReport, setShowReport] = useState(false);

  // -------------------
  // Column Definitions
  // -------------------
  const agentColumns = [
    { header: "Name", accessor: "name" },
    { header: "Email", accessor: "email" },
    { header: "Role", accessor: "role" },
    { header: "Active", accessor: "isActive" },
    { header: "Last Update", accessor: "updatedAt" },
  ];

  const caseColumns = [
    { header: "Case Description", accessor: "case_description" },
    { header: "Status", accessor: "case_status" },
    { header: "Assigned Agent", accessor: "agentName" },
    { header: "Agent Email", accessor: "agentEmail" },
    { header: "Created At", accessor: "createdAt" },
    { header: "Updated At", accessor: "updatedAt" },
  ];

  // -------------------
  // Add agent
  // -------------------
  function addAgent() {
    setShowAddModal(true);
  }

  function handleAddAgentSubmit(e) {
    e.preventDefault();

    const body = { ...newAgent };

    axios.post(`${import.meta.env.VITE_BACKEND_API_URL}/agents`, body, { withCredentials: true })
      .then(res => {
        setAgents(prev => [...prev, res.data]);
        setFilteredAgents(prev => [...prev, res.data]);
        setShowAddModal(false);
        setNewAgent({ name: "", email: "", password: "", role: "" });
      })
      .catch(err => console.error("Error adding agent:", err));
  }

  // -------------------
  // Search handler
  // -------------------
  function handleSearch(query) {
    const q = query.toLowerCase();

    if (dataMode === "agents") {
      setFilteredAgents(
        agents.filter(
          (a) =>
            a.name.toLowerCase().includes(q) ||
            a.email.toLowerCase().includes(q) ||
            a.role.toLowerCase().includes(q)
        )
      );
    } else {
      setFilteredCasesState(
        cases.filter(
          (c) =>
            c.case_description.toLowerCase().includes(q) ||
            c.case_status.toLowerCase().includes(q) ||
            (c.agentName && c.agentName.toLowerCase().includes(q)) ||
            (c.agentEmail && c.agentEmail.toLowerCase().includes(q))
        )
      );
    }
  }

  // -------------------
  // Fetch AGENTS
  // -------------------
  useEffect(() => {
    const url = `${import.meta.env.VITE_BACKEND_API_URL}/agents/supervisor`;

    axios
      .get(url, { withCredentials: true })
      .then((res) => {
        setAgents(res.data);
        setFilteredAgents(res.data);
      })
      .catch((err) => console.error("Error fetching agents:", err));
  }, []);

  // -------------------
  // Fetch CASES
  // -------------------
  useEffect(() => {
    const url = `${import.meta.env.VITE_BACKEND_API_URL}/cases/supervisor/`;

    axios
      .get(url, { withCredentials: true })
      .then((res) => {
        setCases(res.data);
        setFilteredCasesState(res.data);
      })
      .catch((err) => console.error("Error fetching cases:", err));
  }, []);

  // -------------------
  // Filters
  // -------------------
  const filteredAgents2 =
    agentFilter === "all"
      ? filteredAgents
      : agentFilter === "active"
      ? filteredAgents.filter((a) => a.isActive === true)
      : filteredAgents.filter((a) => a.isActive === false);

  const filteredCases2 =
    caseFilter === "all"
      ? filteredCases
      : filteredCases.filter((c) => c.case_status?.toLowerCase() === caseFilter);

  const ActiveColumns = dataMode === "agents" ? agentColumns : caseColumns;
  const ActiveData = dataMode === "agents" ? filteredAgents2 : filteredCases2;

  return (
    <div className="supervisor-container">
      {/* TOP BAR */}
      <div className="supervisor-top-row">

        {/* LEFT SIDE CONTROLS */}
        <div className="supervisor-left-controls">
          <select
            className="supervisor-select"
            value={dataMode}
            onChange={(e) => setDataMode(e.target.value)}
          >
            <option value="agents">Agents</option>
            <option value="cases">Cases</option>
          </select>

          {dataMode === "agents" && (
            <select
              className="supervisor-select"
              value={agentFilter}
              onChange={(e) => setAgentFilter(e.target.value)}
            >
              <option value="all">All Agents</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          )}

          {dataMode === "cases" && (
            <select
              className="supervisor-select"
              value={caseFilter}
              onChange={(e) => setCaseFilter(e.target.value)}
            >
              <option value="all">All</option>
              <option value="solved">Solved</option>
              <option value="unsolved">Unsolved</option>
              <option value="pending">Pending</option>
            </select>
          )}
        </div>

        {/* SEARCH BAR */}
        <input
          type="text"
          placeholder="Search..."
          className="supervisor-search"
          onChange={(e) => handleSearch(e.target.value)}
        />

        {/* RIGHT SIDE CONTROLS */}
        <div className="supervisor-right-controls">

          {/* ALWAYS SHOW REPORT BUTTON */}
          

          {dataMode === "agents" && (
            <>
            
              <button className="supervisor-btn add-btn" onClick={addAgent}>
                +
              </button>

              <button
            className="supervisor-btn"
            onClick={() => setShowReport(true)}
          >
            Generate Report
          </button>

              <button
                disabled={!selectedId}
                className="supervisor-btn"
                onClick={() =>
                  navigate("/agentDetail", { state: { AgentID: selectedId } })
                }
              >
                Show Details
              </button>
            </>
          )}

          {dataMode === "cases" && (
            <>
            <button
            className="supervisor-btn"
            onClick={() => setShowReport(true)}
          >
            Generate Report
          </button>
            <button disabled={!selectedId} className="supervisor-btn"    onClick={() =>
                  navigate("/CaseDetail", { state: { CaseID: selectedId } })
                }>
              Show Details
            </button>
            </>
          )}
        </div>
      </div>

      {/* TABLE */}
      <div className="supervisor-table-container">
        <DataTable
          columns={ActiveColumns}
          data={ActiveData}
          selectedId={selectedId}
          setSelectedId={setSelectedId}
        />
      </div>

      {/* ADD AGENT MODAL */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Add New Agent</h3>

            <form onSubmit={handleAddAgentSubmit} className="modal-form">
              <input
                type="text"
                placeholder="Name"
                required
                value={newAgent.name}
                onChange={(e) => setNewAgent({ ...newAgent, name: e.target.value })}
              />

              <input
                type="email"
                placeholder="Email"
                required
                value={newAgent.email}
                onChange={(e) => setNewAgent({ ...newAgent, email: e.target.value })}
              />

              <input
                type="password"
                placeholder="Password"
                required
                value={newAgent.password}
                onChange={(e) => setNewAgent({ ...newAgent, password: e.target.value })}
              />

              <select
                required
                value={newAgent.role}
                onChange={(e) => setNewAgent({ ...newAgent, role: e.target.value })}
              >
                <option value="">Select Role</option>
                <option value="Agent">Agent</option>
                <option value="Senior Agent">Senior Agent</option>
              </select>

              <div className="modal-actions">
                <button type="button" className="modal-cancel" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>

                <button type="submit" className="modal-submit">
                  Add Agent
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* REPORT MODAL */}
      {showReport && (
        <SupervisorReport onClose={() => setShowReport(false)} />
      )}

    </div>
  );
};

export default SupervisorTable;
