import express from 'express';
import auth from '../Middleware/AuthMiddleware.js';
import {
  getDefaultClient,
  getClientById,
  getCasesByClient,
  updateClientProfile
} from '../Controllers/ClientController.js';

const router = express.Router();

// Moved before /:id to prevent conflict
router.get("/default", auth, getDefaultClient);

router.get("/:id/cases", auth, getCasesByClient);
router.patch("/:id", auth, updateClientProfile);
router.get("/:id", auth, getClientById);
export default router;
