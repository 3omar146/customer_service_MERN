import express from 'express';
import auth from "../Middleware/AuthMiddleware.js";
const router = express.Router();

import {assignAgentToCase, createAgent, deleteAgent, getActiveAgents, getAgentByEmail, getAgentById, getAgentReportById, getAgentsByRole, getAgentsBySupervisor, getAgentsReport, getAllAgents,updateAgent,getAllAgentsReport} from '../Controllers/AgentConroller.js';
;

//get all supervisors
router.get('/',auth, getAllAgents);
//get active agents
router.get('/active',auth, getActiveAgents);
//get agent by email
router.get('/email/:email',auth, getAgentByEmail);
//get agents by role
router.get('/role/:AgentRole',auth, getAgentsByRole)
//get agent by supervisor id
router.get('/supervisor',auth, getAgentsBySupervisor);
//get agent report
router.get('/report',auth,getAgentsReport);
//all agents report
router.get('/supervisor/report',auth, getAllAgentsReport);
//get agent report by id
router.get('/Agentreport/:id',auth,getAgentReportById);
//get agent by id
router.get('/SpecificAgent/:id',auth,getAgentById);
//upate agent
router.patch('/:id',auth, updateAgent);
//delete agent from system
router.delete('/:id',auth, deleteAgent);
//post new agent
router.post('/',auth, createAgent);
//assign agent to case
router.patch("/assign/:caseId/agent/:agentId",auth, assignAgentToCase);
export default router;