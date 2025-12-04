import express from 'express';
import {
  getClientById,
  getCasesByClient
} from '../Controllers/ClientController.js';

const router = express.Router();

router.get('/:id/cases', getCasesByClient);
router.get('/:id', getClientById);

export default router;
