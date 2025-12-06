import React, { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "../Components/DataTable";
import ClientNavbar from "../Components/ClientNavbar";
import "../Style/ClientDashboard.css";
import { useNavigate } from "react-router-dom";

function ClientDashboard() {
  const [clientID, setClientID] = useState(null);
  const [cases, setCases] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [caseFilter, setCaseFilter] = useState("all");
  const [selectedId, setSelectedId] = useState(null);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCaseDescription, setNewCaseDescription] = useState("");

  const navigate = useNavigate();

  // Common pre-written case descriptions
  const commonIssues = [
    "Internet is slow or unstable.",
    "No internet connection at all.",
    "Billing issue: Incorrect charged amount.",
    "Router keeps restarting or disconnecting."
  ];

  // Load client ID
  useEffect(() => {
    let id = cookieStore.get("clientID")?.value;

    if (!id) {
      axios
        .get(`${import.meta.env.VITE_BACKEND_API_URL}/clients/${id}`)
        .then((res) => {
          id = res.data._id;
          localStorage.setItem("clientID", id);
          setClientID(id);
        })
        .catch((err) => console.error("Client load error", err));
    } else {
      setClientID(id);
    }
  }, []);

  // Load cases
  useEffect(() => {
    if (!clientID) return;

    axios
      .get(`${import.meta.env.VITE_BACKEND_API_URL}/clients/${clientID}/cases`)
      .then((res) => {
        setCases(res.data);
        setFiltered(res.data);
      })
      .catch((err) => console.error(err));
  }, [clientID]);

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

  function createNewCase(e) {
    e.preventDefault();

    const body = {
      clientID: clientID,
      case_description: newCaseDescription,
      case_status: "unsolved",
      createdAt: new Date(),
      updatedAt: new Date()
    };

    axios
      .post(`${import.meta.env.VITE_BACKEND_API_URL}/cases`, body)
      .then(res => {
        setCases(prev => [...prev, res.data]);
        setFiltered(prev => [...prev, res.data]);
        setShowCreateModal(false);
        setNewCaseDescription("");
      })
      .catch(err => console.log("Case creation error:", err));
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
      <ClientNavbar />

      <div className="client-container">
        <h2>Your Cases</h2>

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
            className="client-search"
            type="text"
            placeholder="Search cases..."
            onChange={(e) => handleSearch(e.target.value)}
          />

          <button
            className="client-btn add-btn"
            onClick={() => setShowCreateModal(true)}
          >
            + New Case
          </button>

        </div>

        <div className="client-table">
          <DataTable
            columns={columns}
            data={visibleCases}
            selectedId={selectedId}
            setSelectedId={setSelectedId}
          />
        </div>
      </div>

      {/* CREATE CASE MODAL */}
      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Create New Case</h3>

            <form className="modal-form" onSubmit={createNewCase}>

              {/* Dropdown that autofills issue */}
              <select
                className="modal-select"
                onChange={(e) => setNewCaseDescription(e.target.value)}
              >
                <option value="">Select a common issue...</option>
                {commonIssues.map((issue, idx) => (
                  <option key={idx} value={issue}>{issue}</option>
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

    </>
  );
}

export default ClientDashboard;
