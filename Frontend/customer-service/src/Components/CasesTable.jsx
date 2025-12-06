import React from "react";
import CaseCard from "./CaseCard.jsx";
import "../Style/agentdashboard.css";

export default function CasesTable({
  title = "Cases",
  cases = [],
  loading = false,
  isSupervisorView = false,
  onAssign,
  onUnassign,
  onMarkSolved,
  layout = "grid",
}) {
  return (
    <div className="assigned-cases">
      {loading ? (
        <p>Loading {title.toLowerCase()}...</p>
      ) : cases.length === 0 ? (
        <p>No {title.toLowerCase()} found.</p>
      ) : (
        <div className={layout === "list" ? "case-list" : "case-grid"}>
          {cases.map((caseItem) => (
            <CaseCard
              key={caseItem._id}
              caseItem={caseItem}
              onAssign={onAssign}
              onUnassign={onUnassign}
              onMarkSolved={onMarkSolved}
              isSupervisorView={isSupervisorView}
            />
          ))}
        </div>
      )}
    </div>
  );
}
