
import "../Style/CaseCard.css";
import { useNavigate } from "react-router-dom";


function CaseCard({ caseItem, onSolve, onAssign, onUnassign, isSupervisorView = false }) {
  const navigate = useNavigate();
  function handleSolve(e) {
    e.stopPropagation();
    navigate(`/action-protocol/${caseItem._id}`);
  }
  function handleUnassign(e) {
    e.stopPropagation()
    onUnassign && onUnassign(caseItem._id)

  }
  function handleAssign(e) {
    e.stopPropagation();
    console.log("Assign clicked INSIDE CaseCard for:", caseItem._id); // 
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
        {caseItem.assignedAgentID || "Unassigned"}

      </p>

      {isSupervisorView && (
        <>
          {caseItem.case_status === "pending" && (
            <button className="solve-btn" onClick={handleUnassign}>
              unassign
            </button>
          )}
        </>
      )

      }

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