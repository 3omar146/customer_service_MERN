import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import ClientDashboard from "./pages/ClientDashboard.jsx";
import ClientProfile from "./pages/ClientProfile.jsx";
import AgentDetails from "./pages/AgentDetails.jsx";
import SupervisorTable from "./Components/SupervisorTable.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/client/dashboard" element={<ClientDashboard />} />
        <Route path="/client/profile" element={<ClientProfile />} />
      </Routes>
    </Router>
  );
}

export default App;
