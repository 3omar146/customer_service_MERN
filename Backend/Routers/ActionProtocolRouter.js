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
router.get("/",auth, getAllProtocols);

// Get protocol by ID
router.get("/:id",auth, getProtocolById);

// Create a new protocol
router.post("/", auth, createProtocol);

// Update a protocol by ID
router.put("/:id",auth, updateProtocol);

// Delete a protocol by ID
router.delete("/:id",auth, deleteProtocol);

export default router;