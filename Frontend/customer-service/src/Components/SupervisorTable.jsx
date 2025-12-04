// pages/SupervisorAgents.jsx
import React, { useEffect, useState } from "react";
import DataTable from "./DataTable";
import axios from "axios";

const SupervisorTable = ({ supervisorId }) => {
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
    { header: "Agent's Email", accessor: "agentEmail" },
    { header: "Created At", accessor: "createdAt" },
    { header: "Updated At", accessor: "updatedAt" },
  ];

  // -------------------
  // Fetch AGENTS
  // -------------------
  useEffect(() => {
    const url = `${import.meta.env.VITE_BACKEND_API_URL}/agents/supervisor/${supervisorId}`;

    axios
      .get(url)
      .then((res) => setAgents(res.data))
      .catch((err) => console.error("Error fetching agents:", err));
  }, [supervisorId]);

  // -------------------
  // Fetch CASES
  // -------------------
  useEffect(() => {
    const url = `${import.meta.env.VITE_BACKEND_API_URL}/cases/supervisor/${supervisorId}`;

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
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">My Agents & Cases</h2>

      {/* Dropdown selector */}
      <div className="mb-4 flex gap-4 items-center">
        <select
          className="px-4 py-2 border rounded"
          value={dataMode}
          onChange={(e) => setDataMode(e.target.value)}
        >
          <option value="agents">Agents</option>
          <option value="cases">Cases</option>
        </select>

        {/* AGENTS MODE → Show Details */}
        {dataMode === "agents" && (
          <button className="px-4 py-2 bg-blue-600 text-white rounded">
            Show Details
          </button>
        )}

        {/* CASES MODE → Filter + Show Case Details */}
        {dataMode === "cases" && (
          <>
            <select
              className="px-4 py-2 border rounded"
              value={caseFilter}
              onChange={(e) => setCaseFilter(e.target.value)}
            >
              <option value="all">All</option>
              <option value="solved">Solved</option>
              <option value="unsolved">Unsolved</option>
              <option value="pending">Pending</option>
            </select>

            <button className="px-4 py-2 bg-blue-600 text-white rounded">
              Show Case Details
            </button>
          </>
        )}
      </div>

      {/* Data Table */}
      <DataTable
        columns={ActiveColumns}
        data={ActiveData}
        selectedId={selectedId}
        setSelectedId={setSelectedId}
      />
    </div>
  );
};

export default SupervisorAgents;
