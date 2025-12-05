import React from "react";
import "../Style/DataTable.css";
import { useNavigate } from "react-router-dom";
const DataTable = ({ columns, data, selectedId, setSelectedId }) => {
  const navigate = useNavigate();
  return (
    <div className="data-table-wrapper">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.accessor}>{col.header}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.map((row) => {
            let isSelected = row._id === selectedId;

            return (
              <tr
                key={row._id}
                className={isSelected ? "selected" : ""}
                onClick={() => {
                 setSelectedId(isSelected ? null : row._id);
                  }}
              >
                {columns.map((col) => {
                  let value = row[col.accessor];

                  if (typeof value === "boolean") {
                    value = value ? "Active" : "Inactive";
                  }

                  if (value && (col.accessor === "createdAt" || col.accessor === "updatedAt")) {
                    value = new Date(value).toLocaleString();
                  }

                  return <td key={col.accessor}>{value || "-"}</td>;
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
