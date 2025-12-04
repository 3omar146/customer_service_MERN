// pages/SupervisorAgents.jsx
import React, { useEffect, useState } from "react";
import DataTable from "../Components/DataTable";
import axios from "axios";

const SupervisorAgents = ({ supervisorId }) => {
  const [agents, setAgents] = useState([]);
 

  const columns = [
    { header: "Name", accessor: "name" },
    { header: "Email", accessor: "email" },
    { header: "Department", accessor: "department" },
    { header: "Role", accessor: "role" },
    { header: "Active", accessor: "isActive" },
    { header: "Last Update", accessor: "updatedAt" },
  ];

  useEffect(() => {   
    const url = `${import.meta.env.VITE_BACKEND_API_URL}/agents/supervisor/${supervisorId}`;
    axios.get(url)
       .then((res) => setAgents(res.data))
      .catch((err) => console.error("Error fetching agents:", err));
  }, [supervisorId]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">My Agents</h2>
      <DataTable columns={columns} data={agents} />
    </div>
  );
};

export default SupervisorAgents;
