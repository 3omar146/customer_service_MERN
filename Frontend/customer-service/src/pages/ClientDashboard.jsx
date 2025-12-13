import React, { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "../Components/DataTable";
import Navbar from "../Components/Navbar.jsx";
import "../Style/ClientDashboard.css";

function ClientDashboard() {
  const [client, setClient] = useState(null);
  const [cases, setCases] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [caseFilter, setCaseFilter] = useState("all");
  const [selectedId, setSelectedId] = useState(null);

  // CREATE MODAL
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCaseDescription, setNewCaseDescription] = useState("");

  // EDIT MODAL
  const [showEditModal, setShowEditModal] = useState(false);
  const [editCaseDescription, setEditCaseDescription] = useState("");
  const [caseToEdit, setCaseToEdit] = useState(null);

  const commonIssues = [
    "Internet is slow or unstable.",
    "No internet connection at all.",
    "Billing issue: Incorrect charged amount.",
    "Router keeps restarting or disconnecting."
  ];

  // -------------------------------
  // LOAD AUTHENTICATED CLIENT
  // -------------------------------
  useEffect(() => {
    async function fetchClient() {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_API_URL}/clients/default`,
          { withCredentials: true }
        );

        setClient(res.data);
      } catch (err) {
        console.error("Failed to load client:", err);
      }
    }

    fetchClient();
  }, []);

  // -------------------------------
  // LOAD CASES AFTER CLIENT LOADS
  // -------------------------------
  useEffect(() => {
    if (!client?._id) return;

    axios
      .get(
        `${import.meta.env.VITE_BACKEND_API_URL}/clients/${client._id}/cases`,
        { withCredentials: true }
      )
      .then((res) => {
        setCases(res.data);
        setFiltered(res.data);
      })
      .catch((err) => console.error("Failed to load cases:", err));
  }, [client]);

  // -------------------------------
  // SEARCH FILTER
  // -------------------------------
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

  // -------------------------------
  // CREATE CASE
  // -------------------------------
  function createNewCase(e) {
    e.preventDefault();

    const body = {
      clientID: client._id,
      case_description: newCaseDescription,
      case_status: "unsolved",
      createdAt: new Date(),
      updatedAt: new Date()
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
      .catch((err) => console.log("Case creation error:", err));
  }

  // -------------------------------
  // EDIT CASE (ONLY UNSOLVED)
  // -------------------------------
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
      {
        case_description: editCaseDescription,
        updatedAt: new Date()
      },
      { withCredentials: true }
    )
    .then((res) => {
      const updated = res.data;

      // Update UI state
      setCases((prev) =>
        prev.map((c) => (c._id === updated._id ? updated : c))
      );

      setFiltered((prev) =>
        prev.map((c) => (c._id === updated._id ? updated : c))
      );

      setShowEditModal(false);
      setCaseToEdit(null);
    })
    .catch((err) => {
      console.error("Error updating case:", err);
      alert("Case update failed");
    });
}


  const visibleCases =
    caseFilter === "all"
      ? filtered
      : filtered.filter((c) => c.case_status.toLowerCase() === caseFilter);

  const columns = [
    { header: "Description", accessor: "case_description" },
    { header: "Status", accessor: "case_status" },
    { header: "Requested", accessor: "createdAt" },
    { header: "Last Update", accessor: "updatedAt" }
  ];

  return (
    <>
      <Navbar type="client" />

      <div className="client-container">
        <h2>Your Cases</h2>

        <div className="client-top-row">
          {/* FILTER */}
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

          {/* SEARCH */}
          <input
            className="client-search"
            type="text"
            placeholder="Search cases..."
            onChange={(e) => handleSearch(e.target.value)}
          />

          {/* NEW CASE */}
          <button
            className="client-btn add-btn"
            onClick={() => setShowCreateModal(true)}
          >
            + New Case
          </button>

          {/* EDIT CASE — ONLY IF SELECTED & UNSOLVED */}
          {selectedId &&
            cases.find((c) => c._id === selectedId)?.case_status ===
              "unsolved" && (
              <button className="client-btn edit-btn" onClick={openEditCase}>
                Edit Case
              </button>
            )}
        </div>

        {/* TABLE */}
        <div className="client-table">
          <DataTable
            columns={columns}
            data={visibleCases}
            selectedId={selectedId}
            setSelectedId={setSelectedId}
          />
        </div>
      </div>

      {/* --------------------------------------------------- */}
      {/* CREATE CASE MODAL */}
      {/* --------------------------------------------------- */}
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

                <button type="submit" className="modal-submit">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --------------------------------------------------- */}
      {/* EDIT CASE MODAL */}
      {/* --------------------------------------------------- */}
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

                <button type="submit" className="modal-submit">
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
