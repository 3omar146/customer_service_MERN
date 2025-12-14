import React, { useEffect, useState } from "react";
import Navbar from '../Components/Navbar.jsx';
import CasesTable from "../Components/CasesTable.jsx";
import axios from "axios";
import AgentCaseSidebar from "../Components/AgentCaseSidebar.jsx";



export default function AgentDashboard() {
  const [unsolvedCases, setUnsolvedCases] = useState([]);
  const [loadingUnsolvedCases, setLoadingUnsolvedCases] = useState(true);

  useEffect(() => {
    const fetchUnsolvedCases = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_API_URL}/cases/unassigned`,{ withCredentials: true });
        setUnsolvedCases(res.data);
      } catch (err) {
        console.error("Error fetching unassigned cases:", err);
      } finally {
        setLoadingUnsolvedCases(false);
      }
    };

    fetchUnsolvedCases();
  }, []);

  const handleAssign = async (caseId) => {
    try {
      console.log("Assign clicked for case:", caseId);

      await axios.patch(
        `${import.meta.env.VITE_BACKEND_API_URL}/cases/assign/${caseId}`,
        {},
        { withCredentials: true }
      );
      setUnsolvedCases(prev => prev.filter(c => c._id !== caseId));

      if (window.refreshSidebar) {
        window.refreshSidebar();
      }

    } catch (err) {
      console.error("Error assigning case:", err);
    }
  };
  const handleMarkSolved = async (caseId) => {
    try {
      alert("ana roht el functioin ")
      await axios.patch(
        `${import.meta.env.VITE_BACKEND_API_URL}/cases/solve/${caseId}`,
        {},
        { withCredentials: true }
      );

      if (window.refreshSidebar) window.refreshSidebar();

    } catch (err) {
      console.error("Error marking case solved:", err);
    }
  };



  return (
    <>    <Navbar type="agent" />
      <div
        style={{
          display: "flex",
          gap: "20px",
          alignItems: "flex-start",
          padding: "20px",
        }}
      >

        {/* LEFT — Unassigned Cases */}
        <div style={{ flex: 1 }}>
          <h2>Unassigned Cases</h2>

          <CasesTable
            title="Unassigned Cases"
            cases={unsolvedCases}
            loading={loadingUnsolvedCases}
            isSupervisorView={false}
            onAssign={handleAssign}
            onMarkSolved={handleMarkSolved}

            layout="grid"
          />
        </div>


        {/* ⭐⭐ RIGHT — Pending Cases Sidebar (WITH SEPARATOR) ⭐⭐ */}
        <div
          style={{
            width: "350px",
            paddingLeft: "20px",
            borderLeft: "3px solid #e6e6e6",   // <-- THIS IS THE SEPARATOR
            background: "#fafafa",
            borderRadius: "8px",
            boxShadow: "0 0 8px rgba(0,0,0,0.05)",
          }}
        >
          <h2>Pending Cases</h2>
          <AgentCaseSidebar />
        </div>

      </div>
    </>
  );
};