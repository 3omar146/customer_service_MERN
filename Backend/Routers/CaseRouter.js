import express from "express";
import {
    getAllCases,
    getCaseById,
    createCase,
    updateCaseById,
    getSolvedCasesByAgent,
    getAllUnassignedCases,
    getCasesAssignedToAgent,
    assignCaseToAgent,
    unassignCaseFromAgent
} from "../Controllers/CaseController.js";

const router = express.Router();

router.get("/assigned/:agentId", getCasesAssignedToAgent);
router.get("/solved/:agentId", getSolvedCasesByAgent);
router.get("/unassigned", getAllUnassignedCases);
//assign case to agent
router.patch("/assign/:caseId/agent/:agentId",assignCaseToAgent);
//unassign case from agent
router.patch("/unassign/:caseId/agent/agentId",unassignCaseFromAgent);

router.get("/", getAllCases);
router.get("/:id", getCaseById);
router.post("/", createCase);
router.put("/:id", updateCaseById);

export default router;