import React, { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "../Components/DataTable";
import "../Style/ClientDashboard.css";

function ClientDashboard() {
  const [clientID, setClientID] = useState(null);
  const [cases, setCases] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [caseFilter, setCaseFilter] = useState("all");
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    let id = localStorage.getItem("clientID");

    if (!id) {
      axios.get(`${import.meta.env.VITE_BACKEND_API_URL}/clients/default`)
        .then(res => {
          id = res.data._id;
          localStorage.setItem("clientID", id);
          setClientID(id);
        });
    } else {
      setClientID(id);
    }
  }, []);

  useEffect(() => {
    if (!clientID) return;

    axios
      .get(`${import.meta.env.VITE_BACKEND_API_URL}/clients/cases/${clientID}`)
      .then((res) => {
        setCases(res.data);
        setFiltered(res.data);
      })
      .catch(err => console.error(err));
  }, [clientID]);

  function handleSearch(query) {
    const q = query.toLowerCase();
    setFiltered(
      cases.filter(
        c =>
          c.case_description.toLowerCase().includes(q) ||
          c.case_status.toLowerCase().includes(q)
      )
    );
  }

  const visibleCases =
    caseFilter === "all"
      ? filtered
      : filtered.filter(c => c.case_status.toLowerCase() === caseFilter);

  const columns = [
    { header: "Description", accessor: "case_description" },
    { header: "Status", accessor: "case_status" },
    { header: "Requested", accessor: "createdAt" },
    { header: "Last Update", accessor: "updatedAt" }
  ];

  return (
    <div className="client-container">
      <h2>Your Active Cases</h2>

      <div className="client-top-row">
        <select
          className="client-select"
          value={caseFilter}
          onChange={e => setCaseFilter(e.target.value)}
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
          onChange={e => handleSearch(e.target.value)}
        />

        <button className="client-btn">
          + New Case
        </button>

        <button disabled={!selectedId} className="client-btn">
          View Details
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
  );
}

export default ClientDashboard;
