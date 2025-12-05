import express from 'express';
import auth from "../Middleware/AuthMiddleware.js";
const router = express.Router();

import {createAgent, deleteAgent, getActiveAgents, getAgentByEmail, getAgentById, getAgentReportById, getAgentsByRole, getAgentsBySupervisor, getAgentsReport, getAllAgents,updateAgent} from '../Controllers/AgentConroller.js';
;

//get all supervisors
router.get('/', getAllAgents);
//get active agents
router.get('/active', getActiveAgents);
//get agent by email
router.get('/email/:email', getAgentByEmail);
//get agents by role
router.get('/role/:AgentRole', getAgentsByRole)
//get agent by supervisor id
router.get('/supervisor',auth, getAgentsBySupervisor);
//get agent report
router.get('/report', getAgentsReport);
//get agent report by id
router.get('/report/:id', getAgentReportById);
//get agent by id
router.get('/:id', getAgentById);
//upate agent
router.patch('/:id', updateAgent);
//delete agent from system
router.delete('/:id', deleteAgent);
//post new agent
router.post('/',auth, createAgent);

export default router;