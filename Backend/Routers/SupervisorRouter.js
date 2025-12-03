import express from "express";
const router = express.Router();

import {
  getAllSupervisors,
  getSupervisorById,
  updateSupervisor,
  addSupervisor,
  deleteSupervisor,
  getSupervisorByEmail
} from "../Controllers/SupervisorController.js";

// GET all supervisors
router.get("/", getAllSupervisors);

// GET supervisor by email (must be BEFORE :id)
router.get("/by-email", getSupervisorByEmail);

// GET supervisor by ID
router.get("/:id", getSupervisorById);

// UPDATE supervisor
router.patch("/:id", updateSupervisor);

// ADD supervisor
router.post("/", addSupervisor);

// DELETE supervisor
router.delete("/:id", deleteSupervisor);

export default router;
