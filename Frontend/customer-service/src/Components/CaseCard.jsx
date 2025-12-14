import "../Style/CaseCard.css";
import { useNavigate } from "react-router-dom";

function CaseCard({
  caseItem,
  onAssign,
  onUnassign,
  onMarkSolved,
  isSupervisorView = false
}) {
  const navigate = useNavigate();

  // DOES THIS CASE HAVE A PROTOCOL?
  const hasProtocol = !!caseItem.recommendedActionProtocol;

  function goToProtocolPage(e) {
    e.stopPropagation();
    navigate(`/protocols/${caseItem._id}`);
  }

  function handleAssign(e) {
    e.stopPropagation();
    onAssign && onAssign(caseItem._id);
  }

  function handleUnassign(e) {
    e.stopPropagation();
    onUnassign && onUnassign(caseItem._id);
  }

  function handleMarkSolved(e) {
    
    e.stopPropagation();
    onMarkSolved(caseItem._id);
  }

  return (
    <div className="case-card">
      <span className="case-label">Description:</span>
      <strong>{caseItem.case_description}</strong>
     

      <p className="case-info">
        <span className="case-label">Status:</span> {caseItem.case_status}
      </p>

    
      

  

      {isSupervisorView && (
        <>
        <p className="case-info">
        <span className="case-label">Assigned Agent:</span>{" "}
        {caseItem.agentEmail || "Unassigned"}
      </p>
          {caseItem.case_status === "pending" && (
            <button className="solve-btn" onClick={handleUnassign}>
              unassign
            </button>
          )}
        </>
      )
    }

      {/* AGENT VIEW */}
      {!isSupervisorView && (
        <>
          {/* UNSOLVED CASE → ONLY ASSIGN */}
          {caseItem.case_status === "unsolved" && (
            <button className="solve-btn" onClick={handleAssign}>
              Assign
            </button>
          )}
                    {caseItem.recommendedActionProtocol && (
            <p className="case-info">
                <span className="case-label">Selected Protocol :</span>{" "}
                  {caseItem.recommendedActionProtocol.type || caseItem.recommendedActionProtocol}
            </p>
          )}


          {/* PENDING CASES */}
          {caseItem.case_status === "pending" && (
            <>
              {/* PENDING + NO PROTOCOL → SHOW SOLVE */}
              {!hasProtocol && (
                <button className="solve-btn" onClick={goToProtocolPage}>
                  Solve
                </button>
              )}

              {/* PENDING + HAS PROTOCOL SELECTED */}
              {hasProtocol && (
                <>
                  <button className="solve-btn" onClick={goToProtocolPage}>
                    Change Action Protocol
                  </button>

                  <button className="solve-btn" onClick={handleMarkSolved}>
                    Mark as Solved
                  </button>
                </>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}

export default CaseCard;
