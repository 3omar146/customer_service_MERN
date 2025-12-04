import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import ClientDashboard from "./pages/ClientDashboard.jsx";
import ClientProfile from "./pages/ClientProfile.jsx";
import SupervisorTable from "./Components/SupervisorTable.jsx";
import AgentDetails from "./pages/AgentDetails.jsx";

function App() {
  return (
    <Router>
      <Routes>

        <Route path="/client/dashboard" element={<ClientDashboard />} />
        <Route path="/client/profile" element={<ClientProfile />} />
        <Route path="*" element={<ClientDashboard />} />

      </Routes>
    </Router>
  );
}

export default App;
