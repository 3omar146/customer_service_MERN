import React, { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "../Components/DataTable";
import "../Style/ClientDashboard.css";
import "../Style/SupervisorTable.css";

const ClientDashboard = ({ clientID }) => {
  const [client, setClient] = useState(null);
  const [cases, setCases] = useState([]);
  const [filteredCases, setFilteredCases] = useState([]);
  const [caseFilter, setCaseFilter] = useState("all");
  const [selectedId, setSelectedId] = useState(null);

  const [showNewCaseModal, setShowNewCaseModal] = useState(false);
  const [newCase, setNewCase] = useState({ case_description: "" });

  // Columns for Client case view
  const caseColumns = [
    { header: "Description", accessor: "case_description" },
    { header: "Status", accessor: "case_status" },
    { header: "Requested", accessor: "createdAt" },
    { header: "Last Update", accessor: "updatedAt" },
  ];

  // Fetch Client Profile
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_API_URL}/client/${clientID}`)
      .then((res) => setClient(res.data))
      .catch((err) => console.error("Profile error:", err));
  }, [clientID]);

  // Fetch Client Cases
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_API_URL}/client/cases/${clientID}`)
      .then((res) => {
        setCases(res.data);
        setFilteredCases(res.data);
      })
      .catch((err) => console.error("Cases error:", err));
  }, [clientID]);

  // Search Handler
  function handleSearch(query) {
    const q = query.toLowerCase();
    setFilteredCases(
      cases.filter(
        (c) =>
          c.case_description.toLowerCase().includes(q) ||
          c.case_status.toLowerCase().includes(q)
      )
    );
  }

  // Filtering by status
  const ActiveCases =
    caseFilter === "all"
      ? filteredCases
      : filteredCases.filter((c) => c.case_status?.toLowerCase() === caseFilter);

  // Modal Submit
  function handleNewCaseSubmit(e) {
    e.preventDefault();

    const body = { ...newCase, clientID };

    axios
      .post(`${import.meta.env.VITE_BACKEND_API_URL}/cases`, body)
      .then((res) => {
        setCases((prev) => [res.data, ...prev]);
        setFilteredCases((prev) => [res.data, ...prev]);
        setShowNewCaseModal(false);
        setNewCase({ case_description: "" });
      })
      .catch((err) => console.error("Add case error:", err));
  }

  return (
    <div className="client-container">
      {client && (
        <div className="client-header">
          <h2>Welcome {client.firstName} {client.lastName}</h2>
          <p>Your customer statistics and active cases</p>
        </div>
      )}

      {/* Filter + Search */}
      <div className="client-top-row">
        <select
          className="client-select"
          value={caseFilter}
          onChange={(e) => setCaseFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="unsolved">Unsolved</option>
          <option value="pending">Pending</option>
          <option value="solved">Solved</option>
        </select>

        <input
          type="text"
          placeholder="Search cases..."
          className="client-search"
          onChange={(e) => handleSearch(e.target.value)}
        />

        <button
          className="client-btn"
          onClick={() => setShowNewCaseModal(true)}
        >
          + Request Case
        </button>

        <button
          disabled={!selectedId}
          className="client-btn"
        >
          View Details
        </button>
      </div>

      {/* Table */}
      <div className="client-table">
        <DataTable
          columns={caseColumns}
          data={ActiveCases}
          selectedId={selectedId}
          setSelectedId={setSelectedId}
        />
      </div>

      {/* NEW CASE MODAL */}
      {showNewCaseModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Request a New Case</h3>

            <form onSubmit={handleNewCaseSubmit} className="modal-form">
              <textarea
                placeholder="Describe your issue..."
                required
                value={newCase.case_description}
                onChange={(e) =>
                  setNewCase({ ...newCase, case_description: e.target.value })
                }
              />

              <div className="modal-actions">
                <button
                  type="button"
                  className="modal-cancel"
                  onClick={() => setShowNewCaseModal(false)}
                >
                  Cancel
                </button>

                <button type="submit" className="modal-submit">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientDashboard;
