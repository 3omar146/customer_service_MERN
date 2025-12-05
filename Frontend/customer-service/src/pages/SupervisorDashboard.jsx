import react from 'react';
import SupervisorTable from '../Components/SupervisorTable.jsx';
import Navbar from '../Components/Navbar.jsx';

const SupervisorDashboard = () => {
    return (<div><Navbar type = {"supervisor"}></Navbar>
        <SupervisorTable></SupervisorTable>
        </div>
    );
}

export default SupervisorDashboard;