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
router.get("/",auth, getAllLogs);
//get log by case
router.get("/case/:caseID",auth,getLogByCase)
// GET log by ID
router.get("/:id",auth, getLogById);

// GET logs by agent ID
router.get("/agent",auth, getLogsMadeByagent);

// CREATE a log
router.post("/",auth, createLog);

// UPDATE a log
router.put("/:logId",auth, updateLog);

// DELETE a log
router.delete("/:logId",auth, deleteLog);

export default router;
