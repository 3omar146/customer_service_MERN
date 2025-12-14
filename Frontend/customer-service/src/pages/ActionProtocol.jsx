import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";
import "../Style/actionprotocol.css";

export default function ActionProtocol() {
    const { caseId } = useParams();
    const navigate = useNavigate();

    const [protocols, setProtocols] = useState([]);
    const [loading, setLoading] = useState(true);


    const [showForm, setShowForm] = useState(false);
    const [newType, setNewType] = useState("");
    const [newSteps, setNewSteps] = useState("");

    useEffect(() => {
        async function fetchProtocols() {
            try {
                const res = await axios.get(
                    `${import.meta.env.VITE_BACKEND_API_URL}/protocols`,
                    {withCredentials: true }
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

    const handleSelectProtocol = async (protocolId) => {
        try {
            await axios.patch(
                `${import.meta.env.VITE_BACKEND_API_URL}/cases/${caseId}`,
                { recommendedActionProtocol: protocolId },
                { withCredentials: true }
            );

            console.log("Protocol selected:", protocolId);
            navigate("/agent/dashboard");

        } catch (error) {
            console.error("Error setting protocol:", error);
        }
    };

    const handleCreateProtocol = async () => {
        try {
            if (!newType.trim() || !newSteps.trim()) {
                return;
            }

            const res = await axios.post(
                `${import.meta.env.VITE_BACKEND_API_URL}/protocols`,
                {

                    steps: newSteps,
                    type: newType
                },
                { withCredentials: true }
            );

            console.log("Action protocol created:", res.data);

            setProtocols((prev) => [...prev, res.data]);

            setNewType("");
            setNewSteps("");
            setShowForm(false);


        } catch (error) {
            console.error("Error creating action protocol:", error);
        }
    };

    return (
        <>
        <Navbar type = "agent"></Navbar>
        <div className="protocol-page">
            <h2>Available Action Protocols for This Case</h2>

            <div className="center-button">
                <button
                    className="add-protocol-btn"
                    onClick={() => setShowForm(!showForm)}
                >
                    Add Action Protocol
                </button>
            </div>



            {showForm && (
                <div className="new-protocol-form">
                    <input
                        type="text"
                        placeholder="Protocol Type"
                        value={newType}
                        onChange={(e) => setNewType(e.target.value)}
                    />

                    <textarea
                        placeholder="Protocol Steps"
                        value={newSteps}
                        onChange={(e) => setNewSteps(e.target.value)}
                    />

                    <button className="create-btn" onClick={handleCreateProtocol}>
                        Create Protocol
                    </button>
                </div>
            )}

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
        </>
    );
}
