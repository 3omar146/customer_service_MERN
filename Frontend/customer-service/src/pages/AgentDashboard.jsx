import React, { useEffect, useState } from "react";
import { fetchCases } from "../api/cases";
import CaseCard from "../Components/CaseCard";

const AgentDashboard = () => {
    const [cases, setCases] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getCases = async () => {
            try {
                const data = await fetchCases();
                setCases(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        getCases();
    }, []);

    if (loading) return <p>Loading cases...</p>;
    if (cases.length === 0) return <p>No cases assigned yet.</p>;

    return (
        <div className="p-6 grid grid-cols-3 gap-4">
            {cases.map((caseItem) => (
                <CaseCard key={caseItem._id} caseItem={caseItem} />
            ))}
        </div>
    );
};

export default AgentDashboard;
