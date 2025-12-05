import express from 'express';
import {
  getDefaultClient,
  getClientById,
  getCasesByClient,
  updateClientProfile
} from '../Controllers/ClientController.js';

const router = express.Router();

// Moved before /:id to prevent conflict
router.get("/default", getDefaultClient);

router.get("/:id/cases", getCasesByClient);
router.patch("/:id", updateClientProfile);
router.get("/:id", getClientById);

export default router;
