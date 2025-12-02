import express from "express";
import { getAllCases, getCaseById, createCase, updateCaseById, solveCase, assignCaseToAgent } from "../Controllers/CaseController.js";

const router = express.Router();

router.get("/", getAllCases);
router.get("/:id", getCaseById);
router.post("/", createCase);
router.put("/:id", updateCaseById);
router.put("/solveCase/:id", solveCase);
router.put("assignCase/:id", assignCaseToAgent);


export default router;
