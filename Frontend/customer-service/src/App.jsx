import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import ClientDashboard from "./pages/ClientDashboard.jsx";
import ClientProfile from "./pages/ClientProfile.jsx";
import SupervisorTable from "./Components/SupervisorTable.jsx";
import AgentDetails from "./pages/AgentDetails.jsx";
import AgentDashboard from "./pages/AgentDashboard.jsx";
import LoginPage from "./Components/Login.jsx";
import SignUpPage from "./Components/Signup.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/client/dashboard" element={<ClientDashboard />} />
        <Route path="/" element={<LoginPage />} />
                <Route path="/login" element={<LoginPage />} />
        <Route path="/supervisor/dashboard" element={<SupervisorTable />} />

        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/client/profile" element={<ClientProfile />} />
        <Route path="agent/dashboard" element={< AgentDashboard/>} />
      </Routes>
    </Router>
  );
}

export default App;
