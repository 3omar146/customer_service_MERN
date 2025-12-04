
import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AgentDashboard from './pages/AgentDashboard.jsx';
import SupervisorTable from './Components/SupervisorTable.jsx';
import AgentDetails from './pages/AgentDetails.jsx';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/agentDetail" element={<AgentDetails AgentID={"692f59c9a33b1df1ddaff013"} />} />
        <Route path="/SupervisorTable" element={<SupervisorTable supervisorID={"6931a93378ece62bd5dbbc95"} />} />
      </Routes>
    </Router>
  );
}
export default App
