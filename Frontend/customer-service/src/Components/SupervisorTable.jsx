// pages/SupervisorTable.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DataTable from "./DataTable";
import axios from "axios";
import "../Style/SupervisorTable.css";

const SupervisorTable = ({ supervisorID }) => {

  const navigate =useNavigate();
  const [agents, setAgents] = useState([]);
  const [cases, setCases] = useState([]);
  const [dataMode, setDataMode] = useState("agents");
  const [selectedId, setSelectedId] = useState(null);
  const [caseFilter, setCaseFilter] = useState("all");

  // -------------------
  // Columns Definitions
  // -------------------
  const agentColumns = [
    { header: "Name", accessor: "name" },
    { header: "Email", accessor: "email" },
    { header: "Department", accessor: "department" },
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
  // Fetch AGENTS
  // -------------------
  useEffect(() => {
    const url = `${import.meta.env.VITE_BACKEND_API_URL}/agents/supervisor/${supervisorID}`;

    axios
      .get(url)
      .then((res) => setAgents(res.data))
      .catch((err) => console.error("Error fetching agents:", err));
  }, [supervisorID]);

  // -------------------
  // Fetch CASES
  // -------------------
  useEffect(() => {
    const url = `${import.meta.env.VITE_BACKEND_API_URL}/cases/supervisor/${supervisorID}`;

    axios
      .get(url)
      .then((res) => setCases(res.data))
      .catch((err) => console.error("Error fetching cases:", err));
  }, []);

  // -------------------
  // Filtering Cases
  // -------------------
  const filteredCases =
    caseFilter === "all"
      ? cases
      : cases.filter((c) => c.case_status?.toLowerCase() === caseFilter);

  const ActiveColumns = dataMode === "agents" ? agentColumns : caseColumns;
  const ActiveData = dataMode === "agents" ? agents : filteredCases;

  return (
    <div className="supervisor-container">
      <h2 className="supervisor-title">{dataMode === "agents"?"My Agents":"Cases"}</h2>

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

        {/* RIGHT SIDE: BUTTON */}
        <div className="supervisor-right-controls">
          {dataMode === "agents" && (
            <button disabled = {!selectedId} className="supervisor-btn" onClick={()=>navigate("/agentDetail")}>Show Details</button>
          )}

          {dataMode === "cases" && (
            <button disabled = {!selectedId} className="supervisor-btn">Show Details</button>
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
    </div>
  );
};

export default SupervisorTable;
