
import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AgentDashboard from './pages/AgentDashboard.jsx';
import SupervisorTable from './Components/SupervisorTable.jsx';
import AgentDetails from './pages/AgentDetails.jsx';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/agentDetail" element={<AgentDetails AgentID={"6931a8802e4cce32f7f3b38f"} />} />
        <Route path="/SupervisorTable" element={<SupervisorTable supervisorID={"6931a8802e4cce32f7f3b385"} />} />
      </Routes>
    </Router>
  );
}
export default App
