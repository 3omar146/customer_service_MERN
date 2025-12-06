import { useState, useEffect } from "react";
import axios from "axios";
import CasesTable from "./CasesTable";

const AgentCaseSidebar = () => {
    const [assignedCases, setAssignedCases] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchCases() {
            try {
                const res = await axios.get(
                    `${import.meta.env.VITE_BACKEND_API_URL}/cases/assigned`,
                    { withCredentials: true }
                );

                setAssignedCases(res.data);
            } catch (error) {
                console.error("Error fetching assigned cases:", error);
            } finally {
                setLoading(false);
            }
        }
        window.refreshSidebar = fetchCases;

        fetchCases();
    }, []);

    return (
        <div className="agent-cases-sidebar">
            <CasesTable
                title="Assigned Cases"
                cases={assignedCases}
                loading={loading}
                isSupervisorView={false}
            />
        </div>
    );
};

export default AgentCaseSidebar;
