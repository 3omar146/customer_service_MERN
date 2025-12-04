
import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AgentDashboard from './pages/AgentDashboard.jsx';
import SupervisorAgents from './pages/SupervisorPage.jsx';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SupervisorAgents supervisorId={"692f59c9a33b1df1ddaff001"} />} />
      </Routes>
    </Router>
  );
}
export default App
