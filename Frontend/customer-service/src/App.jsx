import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AgentDashboard from './pages/AgentDashboard.jsx';

function App() {
  return (
    <Router>
      <Routes>
        {/* Dashboard showing all cases */}
        <Route path="/" element={<AgentDashboard />} />

      </Routes>
    </Router>
  );
}
export default App
