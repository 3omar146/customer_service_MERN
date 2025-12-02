import express from "express";
import { getAllCases, getCaseById, createCase, updateCaseById } from "../Controllers/CaseController.js";

const router = express.Router();

router.get("/", getAllCases);
router.get("/:id", getCaseById);
router.post("/", createCase);
router.put("/:id", updateCaseById);

export default router;
