import express from "express";
import auth from "../Middleware/AuthMiddleware.js";
import {
    getAllCases,
    getCaseById,
    createCase,
    updateCaseById,
    getSolvedCasesByAgent,
    getSolvedCasesBySpecificAgent,
    getAllUnassignedCases,
    getCasesAssignedToAgent,
    getCasesAssignedToSpecificAgent,
    solveCase,
    assignCaseToAgent,
    unassignCaseFromAgent,
    getCasesForSupervisor
} from "../Controllers/CaseController.js";

const router = express.Router();

// AGENT RELATED
router.get("/assigned/:agentId", getCasesAssignedToAgent);
router.get("/assigned/",auth, getCasesAssignedToSpecificAgent);
router.get("/assigned/:agentId",getCasesAssignedToAgent);
router.get("/solved/:agentId", getSolvedCasesByAgent);
router.get("/solved",auth, getSolvedCasesBySpecificAgent);
router.patch("/assign/:caseId",auth, assignCaseToAgent);
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
