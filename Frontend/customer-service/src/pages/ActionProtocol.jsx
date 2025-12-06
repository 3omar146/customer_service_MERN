import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "../Style/ActionProtocol.css";

export default function ActionProtocol() {
    const { caseId } = useParams();
    const navigate = useNavigate();

    const [protocols, setProtocols] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchProtocols() {
            try {
                const res = await axios.get(
                    `${import.meta.env.VITE_BACKEND_API_URL}/protocols`
                );
                setProtocols(res.data);
            } catch (error) {
                console.error("Error fetching action protocols:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchProtocols();
    }, []);

    // ⭐ FIXED: Correctly updates case
    const handleSelectProtocol = async (protocolId) => {
        try {
            await axios.patch(
                `${import.meta.env.VITE_BACKEND_API_URL}/cases/${caseId}`,
                { recommendedActionProtocol: protocolId },
                { withCredentials: true }
            );
            console.log("Protocol selected:", protocolId);
            alert("Protocol selected successfully!");
            navigate("/agent/dashboard");

        } catch (error) {
            console.error("Error setting protocol:", error);
        }
    };

    return (
        <div className="protocol-page">
            <h2>Available Action Protocols for Case: {caseId}</h2>

            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="protocol-grid">
                    {protocols.map((p) => (
                        <div key={p._id} className="protocol-card">
                            <h3 className="protocol-type">{p.type}</h3>
                            <p className="protocol-steps">{p.steps}</p>

                            <button
                                className="select-btn"
                                onClick={() => handleSelectProtocol(p._id)}
                            >
                                Select
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
