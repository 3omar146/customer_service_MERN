import React, { useEffect, useState } from 'react';
import SupervisorTable from '../Components/SupervisorTable.jsx';
import Navbar from '../Components/Navbar.jsx';
import axios from "axios";
import "../Style/SupervisorDashboard.css";

const SupervisorDashboard = () => {

  const [stats, setStats] = useState({
    totalAgents: 0,
    activeAgents: 0,
    inactiveAgents: 0,

    solvedCases: 0,
    unsolvedCases: 0,
    pendingCases: 0,
  });

  // Fetch stats once on load
  useEffect(() => {
    async function fetchStats() {
      try {
        const agentsRes = await axios.get(
          `${import.meta.env.VITE_BACKEND_API_URL}/agents/supervisor`,
          { withCredentials: true }
        );

        const casesRes = await axios.get(
          `${import.meta.env.VITE_BACKEND_API_URL}/cases/supervisor`,
          { withCredentials: true }
        );

        const agents = agentsRes.data;
        const cases = casesRes.data;

        setStats({
          totalAgents: agents.length,
          activeAgents: agents.filter(a => a.isActive).length,
          inactiveAgents: agents.filter(a => !a.isActive).length,

          solvedCases: cases.filter(c => c.case_status?.toLowerCase() === "solved").length,
          unsolvedCases: cases.filter(c => c.case_status?.toLowerCase() === "unsolved").length,
          pendingCases: cases.filter(c => c.case_status?.toLowerCase() === "pending").length,
        });

      } catch (err) {
        console.error("Error loading dashboard stats:", err);
      }
    }

    fetchStats();
  }, []);

  return (
    <div className="container">
      <Navbar type="supervisor" />

      {/* stats */}
      <div className="stats-container">
        
        {/*agents card */}
        <div className="stat-card">
          <h3>{stats.totalAgents}</h3>
          <p>Total Agents</p>
          <small>Active: {stats.activeAgents}  Inactive: {stats.inactiveAgents}</small>
        </div>

        {/* unsolved */}
        <div className="stat-card">
          <h3>{stats.unsolvedCases}</h3>
          <p>Unsolved Cases</p>
        </div>

        {/* solved */}
        <div className="stat-card">
          <h3>{stats.solvedCases}</h3>
          <p>Solved Cases</p>
        </div>

        {/* pending */}
        <div className="stat-card">
          <h3>{stats.pendingCases}</h3>
          <p>Pending Cases</p>
        </div>

      </div>

      {/* table */}
      <SupervisorTable />
    </div>
  );
};

export default SupervisorDashboard;
