import React, { useEffect, useState } from "react";
import Navbar from '../Components/Navbar.jsx';
import CasesTable from "../Components/CasesTable.jsx";
import axios from "axios";


export default function AgentDashboard(){
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
      await axios.patch(
        `${import.meta.env.VITE_BACKEND_API_URL}/cases/assign/${caseId}`,
        { withCredentials: true }
      );

      setUnsolvedCases((prev) =>
        prev.map((c) =>
          c._id === caseId ? { ...c, case_status: "pending" } : c
        )
      );
    } catch (err) {
      console.error("Error assigning case:", err);
    }
  };

   
    return (
       <div>
        {/* <Navbar type = {"agent"}></Navbar> */}
      <h2>Unassigned Cases</h2>
      <CasesTable
        title="Unassigned Cases"
        cases={unsolvedCases}
        loading={loadingUnsolvedCases}
        isSupervisorView={false}
        onSolve={handleAssign}
      />
    </div>
    );
};

