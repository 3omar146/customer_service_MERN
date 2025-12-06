import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import CaseCard from "./CaseCard";
import "../Style/ListofCases.css";

export default function CasesTable({ isSupervisorView = false },cases, handleBtn, loadingstate) {
    return (
      <>
        <div className="assigned-cases">
          <h3>{Cases}</h3>
          {loadingstate ? (
            <p>Loading {cases}...</p>
          ) : cases.length === 0 ? (
            <p>No Unsolved cases.</p>
          ) : (
            <div className="cases-grid">
              {cases.map(caseItem => (
                <CaseCard
                  key={caseItem._id}
                  caseItem={caseItem}
                  onSolve={!isSupervisorView ? handleBtn : undefined}
                  isSupervisorView={isSupervisorView}
                />
              ))}
            </div>
          )}
        </div>
        </>
    );
}