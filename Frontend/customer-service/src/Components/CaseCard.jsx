import React from "react";
import { useNavigate } from "react-router-dom";

const CaseCard = ({ caseItem }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/case/${caseItem._id}`); // go to ActionProtocol page
  };

  return (
    <div
      onClick={handleClick}
      className="border rounded-lg p-4 shadow hover:shadow-lg cursor-pointer"
    >
      <h2 className="text-xl font-bold mb-2">{caseItem.case_description}</h2>
      <p>Status: {caseItem.case_status}</p>
      <p>Assigned Agent ID: {caseItem.assignedAgentID}</p>
      <p>Client ID: {caseItem.clientID}</p>
    </div>
  );
};

export default CaseCard;
