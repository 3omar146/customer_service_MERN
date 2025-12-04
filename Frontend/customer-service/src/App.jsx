
import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AgentDashboard from './pages/AgentDashboard.jsx';
import SupervisorAgents from './pages/SupervisorPage.jsx';
import AgentDetails from './pages/AgentDetails.jsx';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/agentDetail" element={<AgentDetails AgentID={"692f59c9a33b1df1ddaff013"} />} />
      </Routes>
    </Router>
  );
}
export default App
