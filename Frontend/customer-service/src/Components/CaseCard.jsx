import "../Style/CaseCard.css";

function CaseCard({ caseItem, onSolve, onAssign, isSupervisorView = false }) {

  function handleSolve(e) {
    e.stopPropagation();
    onSolve && onSolve(caseItem._id);
  }

  function handleAssign(e) {
    e.stopPropagation();
    onAssign && onAssign(caseItem._id);
  }

  return (
    <div className="case-card">
        <span className="case-label">Description:</span> <strong>{caseItem.case_description}</strong>

      <p className="case-info">
        <span className="case-label">Status:</span> {caseItem.case_status}
      </p>

      <p className="case-info">
        <span className="case-label">Assigned Agent:</span>{" "}
        {caseItem.agentEmail || "Unassigned"}
      </p>

      {/* Render buttons only if not supervisor view */}
      {!isSupervisorView && (
        <>
          {caseItem.case_status === "pending" && (
            <button className="solve-btn" onClick={handleSolve}>
              Solve
            </button>
          )}
          {caseItem.case_status === "unsolved" && (
            <button className="solve-btn" onClick={handleAssign}>
              Assign 
            </button>
          )}
        </>
      )}
    </div>
  );
}

export default CaseCard;
