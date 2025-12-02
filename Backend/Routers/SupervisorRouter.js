import express from 'express';
const router = express.Router();

import {getAllSupervisors} from '../Controllers/SupervisorController.js';

//get all supervisors
router.get('/', getAllSupervisors);

export default router;