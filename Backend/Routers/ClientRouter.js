import express from 'express';
import {
  getClientById,
  getCasesByClient,
  updateClientProfile
} from '../Controllers/ClientController.js';

const router = express.Router();

router.put('/:id', updateClientProfile);
router.get('/:id/cases', getCasesByClient);
router.get('/:id', getClientById);

export default router;
