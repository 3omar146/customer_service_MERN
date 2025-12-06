import React, { useState, useEffect } from "react";
import axios from "axios";
import CaseCard from "./CaseCard";
import "../Style/CaseCard.css";

export default function Cases({ url, action }) {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch cases from backend
    const fetchCases = async () => {
      try {
        const res = await axios.get(url);
        setCases(res.data); // expect backend returns an array of cases
      } catch (err) {
        console.error("Error fetching cases:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCases();
  }, [url]); // refetch if URL changes

  // Function to handle solving or assigning a case
  const handleAction = async (caseId) => {
    try {
      if (action === "solve") {
        await axios.put(`${url}/solve/${caseId}`);
        setCases((prevCases) =>
          prevCases.map((c) =>
            c._id === caseId ? { ...c, case_status: "solved" } : c
          )
        );
      } else if (action === "assign") {
        // Example: assign agent logic here
        await axios.patch(`${url}/assign/${caseId}`);
        // optionally update local state if needed
      }
    } catch (err) {
      console.error(`Error during ${action} action:`, err);
    }
  };

  if (loading) return <p>Loading cases...</p>;

  return (
    <div className="cases-container">
      {cases.length === 0 ? (
        <p>No cases found.</p>
      ) : (
        cases.map((caseItem) => (
          <CaseCard
            key={caseItem._id}
            caseItem={caseItem}
            onSolve={handleAction} // one function for solve/assign
          />
        ))
      )}
    </div>
  );
}
