import express from "express";
import auth from "../Middleware/AuthMiddleware.js";
import {
    getAllCases,
    getCaseById,
    createCase,
    updateCaseById,
    getSolvedCasesByAgent,
    getAllUnassignedCases,
    getCasesAssignedToAgent,
    solveCase,
    assignCaseToAgent,
    unassignCaseFromAgent,
    getCasesForSupervisor
} from "../Controllers/CaseController.js";

const router = express.Router();

// AGENT RELATED
router.get("/assigned/:agentId",getCasesAssignedToAgent);
router.get("/solved/:agentId", getSolvedCasesByAgent);
router.patch("/assign/:caseId/agent/:agentId", assignCaseToAgent);
router.patch("/unassign/:caseId/agent/:agentId", unassignCaseFromAgent);

// CASE STATUS
router.get("/unassigned", getAllUnassignedCases);
router.patch("/solve/:id", solveCase);

// SUPERVISOR DASHBOARD
router.get("/supervisor",auth, getCasesForSupervisor);

// CLIENT + ADMIN USAGE
router.get("/", getAllCases);
router.get("/:id", getCaseById);
router.post("/", createCase);
router.put("/:id", updateCaseById);

export default router;
