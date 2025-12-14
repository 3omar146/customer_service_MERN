import React, { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "../Components/DataTable";
import Navbar from "../Components/Navbar.jsx";
import "../Style/ClientDashboard.css";

function ClientDashboard() {
  const [cases, setCases] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [caseFilter, setCaseFilter] = useState("all");
  const [selectedId, setSelectedId] = useState(null);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCaseDescription, setNewCaseDescription] = useState("");

  const [showEditModal, setShowEditModal] = useState(false);
  const [editCaseDescription, setEditCaseDescription] = useState("");
  const [caseToEdit, setCaseToEdit] = useState(null);

  const commonIssues = [
    "Internet is slow or unstable.",
    "No internet connection at all.",
    "Billing issue: Incorrect charged amount.",
    "Router keeps restarting or disconnecting."
  ];


  useEffect(() => {
    async function fetchCases() {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_API_URL}/cases`,
          { withCredentials: true }
        );

        setCases(res.data);
        setFiltered(res.data);
      } catch (err) {
        console.error("Failed to load cases:", err);
      }
    }

    fetchCases();
  }, []);

  // ================= SEARCH =================
  function handleSearch(query) {
    const q = query.toLowerCase();
    setFiltered(
      cases.filter(
        (c) =>
          c.case_description.toLowerCase().includes(q) ||
          c.case_status.toLowerCase().includes(q)
      )
    );
  }

  // ================= CREATE CASE =================
  function createNewCase(e) {
    e.preventDefault();

    const body = {
      case_description: newCaseDescription,
      case_status: "unsolved"
    };

    axios
      .post(`${import.meta.env.VITE_BACKEND_API_URL}/cases`, body, {
        withCredentials: true
      })
      .then((res) => {
        setCases((prev) => [...prev, res.data]);
        setFiltered((prev) => [...prev, res.data]);
        setShowCreateModal(false);
        setNewCaseDescription("");
      })
      .catch((err) => console.error("Case creation error:", err));
  }

  // ================= EDIT CASE =================
  function openEditCase() {
    const selected = cases.find((c) => c._id === selectedId);
    if (!selected || selected.case_status !== "unsolved") return;

    setCaseToEdit(selected);
    setEditCaseDescription(selected.case_description);
    setShowEditModal(true);
  }

  function submitEditCase(e) {
    e.preventDefault();

    axios
      .put(
        `${import.meta.env.VITE_BACKEND_API_URL}/cases/${caseToEdit._id}`,
        { case_description: editCaseDescription },
        { withCredentials: true }
      )
      .then((res) => {
        const updated = res.data;

        setCases((prev) =>
          prev.map((c) => (c._id === updated._id ? updated : c))
        );

        setFiltered((prev) =>
          prev.map((c) => (c._id === updated._id ? updated : c))
        );

        setShowEditModal(false);
        setCaseToEdit(null);
      })
      .catch((err) => console.error("Error updating case:", err));
  }

  // ================= FILTERING =================
  const visibleCases =
    caseFilter === "all"
      ? filtered
      : filtered.filter((c) => c.case_status.toLowerCase() === caseFilter);

  const selectedCase = selectedId
    ? cases.find((c) => c._id === selectedId)
    : null;

  const isUnsolved = selectedCase?.case_status === "unsolved";

  // ================= UI =================
  return (
    <>
      <Navbar type="client" />

      <div className="client-container">
        <h2>Your Cases</h2>

        <div className="client-top-row">
          <div className="client-left-controls">
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
          </div>

          <input
            className="client-search center-search"
            type="text"
            placeholder="Search cases..."
            onChange={(e) => handleSearch(e.target.value)}
          />

          <div className="client-right-controls">
            <button
              className="client-btn add-btn"
              onClick={() => setShowCreateModal(true)}
            >
              + New Case
            </button>

            <button
              className={`client-btn edit-btn ${
                !isUnsolved ? "disabled-btn" : ""
              }`}
              disabled={!selectedId || !isUnsolved}
              onClick={openEditCase}
            >
              Edit Case
            </button>
          </div>
        </div>

        <div className="client-table">
          <DataTable
            columns={[
              { header: "Description", accessor: "case_description" },
              { header: "Status", accessor: "case_status" },
              { header: "Requested", accessor: "createdAt" },
              { header: "Last Update", accessor: "updatedAt" }
            ]}
            data={visibleCases}
            selectedId={selectedId}
            setSelectedId={setSelectedId}
          />
        </div>
      </div>

      {/* CREATE MODAL */}
      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Create New Case</h3>

            <form className="modal-form" onSubmit={createNewCase}>
              <select
                className="modal-select"
                onChange={(e) => setNewCaseDescription(e.target.value)}
              >
                <option value="">Select a common issue...</option>
                {commonIssues.map((issue, idx) => (
                  <option key={idx} value={issue}>
                    {issue}
                  </option>
                ))}
              </select>

              <textarea
                required
                placeholder="Describe your issue..."
                value={newCaseDescription}
                onChange={(e) => setNewCaseDescription(e.target.value)}
              />

              <div className="modal-actions">
                <button
                  type="button"
                  className="modal-cancel"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </button>

                <button className="modal-submit" type="submit">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Edit Case</h3>

            <form className="modal-form" onSubmit={submitEditCase}>
              <textarea
                required
                value={editCaseDescription}
                onChange={(e) => setEditCaseDescription(e.target.value)}
              />

              <div className="modal-actions">
                <button
                  type="button"
                  className="modal-cancel"
                  onClick={() => {
                    setShowEditModal(false);
                    setCaseToEdit(null);
                  }}
                >
                  Cancel
                </button>

                <button className="modal-submit" type="submit">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default ClientDashboard;
