import express from 'express';
const router = express.Router();

import {createAgent, deleteAgent, getActiveAgents, getAgentByEmail, getAgentById, getAgentsByRole, getAgentsBySupervisor, getAllAgents,updateAgent} from '../Controllers/AgentConroller.js';
;

//get all supervisors
router.get('/', getAllAgents);
//get active agents
router.get('/active', getActiveAgents);
//get agent by email
router.get('/email/:email', getAgentByEmail);
//get agent by id
router.get('/:id', getAgentById);
//get agents by role
router.get('/role/:AgentRole', getAgentsByRole)
//get agent by supervisor id
router.get('/supervisor/:supervisorId', getAgentsBySupervisor);
//upate agent
router.patch('/:id', updateAgent);
//delete agent from system
router.delete('/:id', deleteAgent);
//post new agent
router.post('/', createAgent);

export default router;