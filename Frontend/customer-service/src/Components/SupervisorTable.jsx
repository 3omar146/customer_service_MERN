// pages/SupervisorTable.jsx
import React, { useEffect, useState } from "react";
import DataTable from "./DataTable";
import axios from "axios";
import "../Style/SupervisorTable.css";

const SupervisorTable = ({ supervisorID }) => {
  const [agents, setAgents] = useState([]);
  const [cases, setCases] = useState([]);
  const [dataMode, setDataMode] = useState("agents");
  const [selectedId, setSelectedId] = useState(null);
  const [caseFilter, setCaseFilter] = useState("all");
  const [filteredAgents, setFilteredAgents] = useState([]);
  const [filteredCases, setFilteredCasesState] = useState([]);

  // NEW STATE FOR ADD AGENT MODAL
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAgent, setNewAgent] = useState({
    name: "",
    email: "",
    password: "",
    role: ""
  });

  // -------------------
  // Columns Definitions
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

  /////add agent handler///
  function addAgent() {
    setShowAddModal(true);
  }

  // submit handler
  function handleAddAgentSubmit(e) {
    e.preventDefault();

    const body = {
      ...newAgent,
      supervisorID: supervisorID
    };

    axios.post(`${import.meta.env.VITE_BACKEND_API_URL}/agents`, body)
      .then(res => {
        setAgents(prev => [...prev, res.data]);
        setFilteredAgents(prev => [...prev, res.data]);
        setShowAddModal(false);
        setNewAgent({ name: "", email: "", password: "", role: "" });
      })
      .catch(err => console.error("Error adding agent:", err));
  }

  ///search handler///
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
    const url = `${import.meta.env.VITE_BACKEND_API_URL}/agents/supervisor/${supervisorID}`;

    axios
      .get(url)
      .then((res) => {
        setAgents(res.data);
        setFilteredAgents(res.data);
      })
      .catch((err) => console.error("Error fetching agents:", err));
  }, [supervisorID]);

  // -------------------
  // Fetch CASES
  // -------------------
  useEffect(() => {
    const url = `${import.meta.env.VITE_BACKEND_API_URL}/cases/supervisor/${supervisorID}`;

    axios
      .get(url)
      .then((res) => {
        setCases(res.data);
        setFilteredCasesState(res.data);
      })
      .catch((err) => console.error("Error fetching cases:", err));
  }, []);

  // -------------------
  // Filtering Cases
  // -------------------
  const filteredCases2 =
    caseFilter === "all"
      ? filteredCases
      : filteredCases.filter((c) => c.case_status?.toLowerCase() === caseFilter);

  const ActiveColumns = dataMode === "agents" ? agentColumns : caseColumns;
  const ActiveData = dataMode === "agents" ? filteredAgents : filteredCases2;

  return (
    <div className="supervisor-container">
      <h2 className="supervisor-title">{dataMode === "agents" ? "My Agents" : "Cases"}</h2>

      {/* TOP BAR SPLIT LEFT + RIGHT */}
      <div className="supervisor-top-row">

        {/* LEFT SIDE: FILTERS */}
        <div className="supervisor-left-controls">
          <select
            className="supervisor-select"
            value={dataMode}
            onChange={(e) => setDataMode(e.target.value)}
          >
            <option value="agents">Agents</option>
            <option value="cases">Cases</option>
          </select>

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

        {/* MIDDLE: SEARCH BAR (NEW) */}
        <input
          type="text"
          placeholder="Search..."
          className="supervisor-search"
          onChange={(e) => handleSearch(e.target.value)}
        />

        {/* RIGHT SIDE: BUTTON */}
        <div className="supervisor-right-controls">
          {dataMode === "agents" && (
            <>
              {/* PLUS BUTTON */}
              <button className="supervisor-btn add-btn" onClick={addAgent}>
                +
              </button>

              <button disabled={!selectedId} className="supervisor-btn">
                Show Details
              </button>
            </>
          )}

          {dataMode === "cases" && (
            <button disabled={!selectedId} className="supervisor-btn">
              Show Details
            </button>
          )}
        </div>

        {dataMode === "cases" && (
          <button disabled={!selectedId} className="supervisor-btn">
            Show Details
          </button>
        )}
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

    </div>
  );
};

export default SupervisorTable;
