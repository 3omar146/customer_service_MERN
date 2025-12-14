import express from "express";
import auth from "../Middleware/AuthMiddleware.js";

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
router.get("/",auth, getAllSupervisors);

// GET supervisor by email (must be BEFORE :id)
router.get("/by-email",auth, getSupervisorByEmail);

// GET supervisor by ID
router.get("/:id",auth, getSupervisorById);



// UPDATE supervisor
router.patch("/:id",auth, updateSupervisor);

// ADD supervisor
router.post("/",auth, addSupervisor);

// DELETE supervisor
router.delete("/:id",auth, deleteSupervisor);

export default router;
