import express from 'express';
import {
  getClientById,
  getCasesByClient,
  updateClientProfile
} from '../Controllers/ClientController.js';

import Client from "../Models/Client.js";

const router = express.Router();

router.get("/default", async (req, res) => {
  try {
    const client = await Client.findOne();
    if (!client) return res.status(404).json({ message: "No clients found" });
    res.json(client);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/cases/:id", getCasesByClient);
router.put("/update/:id", updateClientProfile);
router.get("/:id", getClientById);

export default router;
