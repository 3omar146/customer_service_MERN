import express from "express";
import {
  getAllProtocols,
  getProtocolById,
  createProtocol,
  updateProtocol,
  deleteProtocol
} from "../Controllers/ActionProtocolController.js";
import auth from "../Middleware/AuthMiddleware.js";
const router = express.Router();

// Get all protocols
router.get("/", getAllProtocols);

// Get protocol by ID
router.get("/:id", getProtocolById);

// Create a new protocol
router.post("/", auth, createProtocol);

// Update a protocol by ID
router.put("/:id", updateProtocol);

// Delete a protocol by ID
router.delete("/:id", deleteProtocol);

export default router;