// components/DataTable.jsx
import React from "react";

const DataTable = ({ columns, data }) => {
  return (
    <div className="overflow-x-auto w-full border rounded-lg shadow">
      <table className="w-full border-collapse">
        <thead className="bg-gray-100">
          <tr>
            {columns.map((col) => (
              <th
                key={col.accessor}
                className="px-4 py-2 text-left font-semibold border-b"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data?.length > 0 ? (
            data.map((row) => (
              <tr key={row._id} className="hover:bg-gray-50">
                {columns.map((col) => {
                  let value = row[col.accessor];

                  // Format booleans
                  if (typeof value === "boolean") {
                    value = value ? "Active" : "Inactive";
                  }

                  // Format dates
                  if (value && col.accessor === "updatedAt") {
                    value = new Date(value).toLocaleString();
                  }

                  return (
                    <td key={col.accessor} className="px-4 py-2 border-b">
                      {value || "-"}
                    </td>
                  );
                })}
              </tr>
            ))
          ) : (
            <tr>
              <td className="text-center py-4 text-gray-500" colSpan={columns.length}>
                No Agents Found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
