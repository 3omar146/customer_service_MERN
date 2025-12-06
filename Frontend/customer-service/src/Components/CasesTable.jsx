import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import CaseCard from "./CaseCard.jsx";
import "../Style/ListofCases.css";

export default function CasesTable({
  title = "Cases",
  cases = [],
  loading = false,
  isSupervisorView = false,
  onSolve = () => {},
}) {
  return (
    <div className="assigned-cases">
      {loading ? (
        <p>Loading {title.toLowerCase()}...</p>
      ) : cases.length === 0 ? (
        <p>No {title.toLowerCase()} found.</p>
      ) : (
        <div className="cases-grid">
          {cases.map((caseItem) => (
            <CaseCard
              key={caseItem._id}
              caseItem={caseItem}
              onSolve={!isSupervisorView ? () => onSolve(caseItem._id) : undefined}
              isSupervisorView={isSupervisorView}
            />
          ))}
        </div>
      )}
    </div>
  );
}
