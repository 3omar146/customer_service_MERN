import mongoose from "mongoose";
import Case from "../Models/Case.js";

// -----------------------------
// Get cases assigned to an agent (not solved)
// -----------------------------
export const getCasesAssignedToAgent = async (req, res) => {
    const { agentId } = req.params;

    try {
        const cases = await Case.find({
            assignedAgentID: agentId, // Mongoose converts string to ObjectId automatically
            case_status: { $ne: "solved" }
        }).sort({ createdAt: -1 });


        res.status(200).json(cases);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// -----------------------------
// Get solved cases by agent
// -----------------------------
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

// -----------------------------
// Get all unassigned cases
// -----------------------------
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

// -----------------------------
// Get all cases
// -----------------------------
export const getAllCases = async (req, res) => {
    try {
        const cases = await Case.find().sort({ createdAt: -1 });
        res.status(200).json(cases);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// -----------------------------
// Get case by ID
// -----------------------------
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

// -----------------------------
// Create a new case
// -----------------------------
export const createCase = async (req, res) => {
    try {
        const newCase = new Case(req.body);
        const savedCase = await newCase.save();
        res.status(201).json(savedCase);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// -----------------------------
// Update case by ID
// -----------------------------
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