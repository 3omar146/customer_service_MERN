import express from "express";
import {
    getAllCases,
    getCaseById,
    createCase,
    updateCaseById,
    getSolvedCasesByAgent,
    getAllUnassignedCases,
    getCasesAssignedToAgent
} from "../Controllers/CaseController.js";

const router = express.Router();

// -----------------------------
// Specific routes first
// -----------------------------
router.get("/assigned/:agentId", getCasesAssignedToAgent);
router.get("/solved/:agentId", getSolvedCasesByAgent);
router.get("/unassigned", getAllUnassignedCases);

// -----------------------------
// General routes
// -----------------------------
router.get("/", getAllCases);
router.get("/:id", getCaseById);
router.post("/", createCase);
router.put("/:id", updateCaseById);

export default router;