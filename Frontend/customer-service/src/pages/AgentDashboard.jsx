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
          `${import.meta.env.VITE_BACKEND_API_URL}/cases/unassigned`);
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


  return (
    <div style={{ display: "flex", gap: "20px" }}>   {/* ⭐ LAYOUT FIX */}


      <div style={{ flex: 1 }}>
        <h2>Unassigned Cases</h2>
        <CasesTable
          title="Unassigned Cases"
          cases={unsolvedCases}
          loading={loadingUnsolvedCases}
          isSupervisorView={false}
          onAssign={handleAssign}
        />
      </div>

      {/* RIGHT SIDE – SIDEBAR */}
      <div style={{ width: "300px" }}>
        <AgentCaseSidebar />
      </div>

    </div>
  );
};

