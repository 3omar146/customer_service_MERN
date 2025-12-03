import mongoose from "mongoose";
import Case from "../Models/Case.js";
import Agent from "../Models/Agent.js";


// Get cases assigned to an agent (not solved)
export const getCasesAssignedToAgent = async (req, res) => {
    const { agentId } = req.params;

    try {
        const cases = await Case.find({
            assignedAgentID: agentId, 
            case_status: { $ne: "solved" }
        }).sort({ createdAt: -1 });


        res.status(200).json(cases);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Get solved cases by agent
export const getSolvedCasesByAgent = async (req, res) => {
    const { agentId } = req.params;
    try {
        const cases = await Case.aggregate([
            {
                $match: {
                    assignedAgentID: new mongoose.Types.ObjectId(agentId),
                    case_status: "solved"
                }
            },
            { $sort: { createdAt: -1 } }
        ]);

        res.status(200).json(cases);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all unassigned cases
export const getAllUnassignedCases = async (req, res) => {
    try {
        const cases = await Case.aggregate([
            {
                $match: {
                    $or: [
                        { assignedAgentID: { $exists: false } },
                        { assignedAgentID: null }
                    ],
                    case_status: "unassigned"
                }
            },
            { $sort: { createdAt: -1 } }
        ]);

        res.status(200).json(cases);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Get all cases
export const getAllCases = async (req, res) => {
    try {
        const cases = await Case.find().sort({ createdAt: -1 });
        res.status(200).json(cases);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Get case by ID
export const getCaseById = async (req, res) => {
    const { id } = req.params;

    try {
        const caseItem = await Case.findById(id);

        if (!caseItem) {
            return res.status(404).json({ message: "Case not found" });
        }

        res.status(200).json(caseItem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Create a new case
export const createCase = async (req, res) => {
    try {
        const newCase = new Case(req.body);
        const savedCase = await newCase.save();
        res.status(201).json(savedCase);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Update case by ID
export const updateCaseById = async (req, res) => {
    const { id } = req.params;

    try {
        const updatedCase = await Case.findByIdAndUpdate(id, req.body, { new: true });

        if (!updatedCase) {
            return res.status(404).json({ message: "Case not found" });
        }
        res.status(200).json(updatedCase);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// SOLVE a case and set logs
export const solveCase = async (req, res) => {

    //still need to handle new action protocols
  try {
    let caseID = req.params.id;
    
    const logs  = req.body.logs;

    console.log("Solving case:", caseID, "with logs:", logs);

    if (!caseID || !logs) {
      return res.status(400).json({ message: "caseID and logs are required" });
    }

    // Required log fields
    const requiredFields = ["performedBy", "protocolID"];
    const missing = requiredFields.filter((f) => !logs[f]);

    if (missing.length > 0) {
      return res.status(400).json({
        message: `Missing log fields: ${missing.join(", ")}`
      });
    }

    const caseItem = await Case.findById(caseID);
    if (!caseItem) {
      return res.status(404).json({ message: "Case not found" });
    }

    // Solved cases MUST have an assigned agent
    if (!caseItem.assignedAgentID || caseItem.case_status !== "pending") {
      return res.status(400).json({
        message: "Cannot solve a case with no assigned agent"
      });
    }

    // Apply the update
    logs.timestamp = new Date();
    caseItem.case_status = "solved";
    caseItem.logs = logs;
    caseItem.updatedAt = new Date();
    

    const updated = await caseItem.save();
    res.status(200).json(updated);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const assignCaseToAgent = async (req, res) => {
    try {
        const { agentId, caseId } = req.params;

        const agent = await Agent.exists({ _id: agentId });
        if (!agent) {
            return res.status(404).json({ message: "Agent not found" });
        }

        const assignedCase = await Case.findOneAndUpdate(
            {
                _id: caseId,
                case_status: { $nin: ["pending", "solved"] }
            },
            {
                $set: {
                    assignedAgentID: agentId,
                    case_status: "pending"
                }
            },
            { new: true }
        );

        if (!assignedCase) {
            return res.status(400).json({
                message: "Case not found OR already assigned/solved"
            });
        }

        res.status(200).json({
            message: "Case assigned successfully",
            case: assignedCase
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const unassignCaseFromAgent = async (req, res) => {
    try {
        const { agentId, caseId } = req.params;
        const agent = await Agent.exists({ _id: agentId });
        if (!agent) {
            return res.status(404).json({ message: "Agent not found" });
        }
        const unassignedCase = await Case.findOneAndUpdate(
            {
                _id: caseId,
                assignedAgentID: agentId,
                case_status: "pending"
            },
            {
                $set: {
                    assignedAgentID: null,
                    case_status: "unassigned"
                }
            },
            { new: true }
        );
        if (!unassignedCase) {
            return res.status(400).json({
                message: "Case not found OR not assigned to this agent OR already solved"
            });
        }
        res.status(200).json({
            message: "Case unassigned successfully",
            case: unassignedCase
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }   
};

