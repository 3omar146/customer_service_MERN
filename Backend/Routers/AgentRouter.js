import express from 'express';
import auth from "../Middleware/AuthMiddleware.js";
const router = express.Router();

import {assignAgentToCase, createAgent, deleteAgent, getActiveAgents, getAgentByEmail, getAgentById, getAgentReportById, getAgentsByRole, getAgentsBySupervisor, getAgentsReport, getAllAgents,updateAgent,getAllAgentsReport} from '../Controllers/AgentConroller.js';
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
//all agents report
router.get('/supervisor/report',auth, getAllAgentsReport);
//get agent report by id
router.get('/Agentreport/:id',auth,getAgentReportById);
//get agent by id
router.get('/SpecificAgent/:id',getAgentById);
//upate agent
router.patch('/:id', updateAgent);
//delete agent from system
router.delete('/:id', deleteAgent);
//post new agent
router.post('/',auth, createAgent);
//assign agent to case
router.patch("/assign/:caseId/agent/:agentId", assignAgentToCase);
export default router;