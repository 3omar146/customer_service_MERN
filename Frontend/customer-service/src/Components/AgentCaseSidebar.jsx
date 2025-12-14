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

    const handleMarkSolved = async (caseId) => {
        try {
            await axios.patch(
                `${import.meta.env.VITE_BACKEND_API_URL}/cases/solve/${caseId}`,
                {},
                { withCredentials: true }
            );

            // remove solved case from sidebar list
            setAssignedCases((prev) => prev.filter((c) => c._id !== caseId));

            // refresh other parts if needed
            if (window.refreshSidebar) window.refreshSidebar();
        } catch (error) {
            console.error("Error marking case solved:", error);
        }
    };

    return (
        <div className="agent-cases-sidebar">
            <CasesTable
                title="pending  Cases"
                cases={assignedCases}
                loading={loading}
                isSupervisorView={false}
                layout="list"
                onMarkSolved={handleMarkSolved}
            />
        </div>
    );
};

export default AgentCaseSidebar;
