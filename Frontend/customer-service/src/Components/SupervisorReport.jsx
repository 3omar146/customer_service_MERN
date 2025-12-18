import React, { useEffect, useState } from "react";
import axios from "axios";
import "../Style/SupervisorTable.css";

const SupervisorReport = ({ onClose }) => {
  const [report, setReport] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const casesRes = await axios.get(
          `${import.meta.env.VITE_BACKEND_API_URL}/cases/supervisor/report`,
          { withCredentials: true }
        );

        const agentsRes = await axios.get(
          `${import.meta.env.VITE_BACKEND_API_URL}/agents/supervisor/report`,
          { withCredentials: true }
        );

        setReport({
          ...casesRes.data,
          ...agentsRes.data,
        });
      } catch (err) {
        console.error("Error fetching report:", err);
      }
    };

    fetchReport();
  }, []);

  if (!report) {
    return (
      <div className="modal-overlay">
        <div className="modal-box report-box">
          <h3>Loading Report...</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay">
      <div className="modal-box report-box report-content">

        {/* Case statssss */}
        <h3 className="report-header">1. Case Statistics</h3>

        <div className="report-block">
          <p><strong>Unsolved:</strong> {report.totalUnsolved}</p>
          <p><strong>Pending:</strong> {report.totalPending}</p>
          <p><strong>Solved:</strong> {report.totalSolved}</p>
          <p><strong>Average Solving Time:</strong> {report.averageSolvingTime.toFixed(2)} hrs</p>
        </div>

        {/* Oldest unsolved cases */}
        <h3 className="report-header">2. Oldest 5 Unsolved Cases</h3>

        {report.oldestUnsolved.length === 0 ? (
          <p className="empty-msg">No unsolved cases 🎉</p>
        ) : (
          <ol className="report-list">
            {report.oldestUnsolved.map((c) => (
              <li key={c._id}>
                <span className="item-title">{c.case_description}</span>
                <span className="item-sub">({c.hoursSinceCreated.toFixed(1)} hrs ago)</span>
              </li>
            ))}
          </ol>
        )}

        {/* Agent statsss*/}
        <h3 className="report-header">3. Agents Overview</h3>

        <div className="report-block">
          <p><strong>Active Agents:</strong> {report.activeAgents}</p>
          <p><strong>Inactive Agents:</strong> {report.inactiveAgents}</p>
        </div>

        {/* top agents */}
        <h3 className="report-header">4. Top Agents by Solved Cases</h3>

        {report.topSolved.length === 0 ? (
          <p className="empty-msg">No solved cases yet</p>
        ) : (
          <ol className="report-list">
            {report.topSolved.map((a, index) => (
              <li key={index}>
                <span className="item-title">{a.agentName}</span>
                <span className="item-sub">({a.solvedCount} solved)</span>
              </li>
            ))}
          </ol>
        )}

        {/* fastest solvers */}
        <h3 className="report-header">5. Fastest Agents (Avg. Solve Time)</h3>

        {report.topAvgSolve.length === 0 ? (
          <p className="empty-msg">Not enough solved cases</p>
        ) : (
          <ol className="report-list">
            {report.topAvgSolve.map((a, index) => (
              <li key={index}>
                <span className="item-title">{a.agentName}</span>
                <span className="item-sub">({a.avgSolveTime.toFixed(2)} hrs)</span>
              </li>
            ))}
          </ol>
        )}

        {/* close btn to set show report in parent to false */}
        <button className="modal-cancel" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default SupervisorReport;
