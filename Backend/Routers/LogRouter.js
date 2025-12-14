import express from "express";
import auth from "../Middleware/AuthMiddleware.js";
import {
  getAllLogs,
  getLogById,
  getLogsMadeByagent,
  createLog,
  updateLog,
  deleteLog,
  getLogByCase
} from "../Controllers/LogController.js";

const router = express.Router();

// GET all logs
router.get("/", getAllLogs);
//get log by case
router.get("/case/:caseID",getLogByCase)
// GET log by ID
router.get("/:id", getLogById);

// GET logs by agent ID
router.get("/agent",auth, getLogsMadeByagent);

// CREATE a log
router.post("/", createLog);

// UPDATE a log
router.put("/:logId", updateLog);

// DELETE a log
router.delete("/:logId", deleteLog);

export default router;
