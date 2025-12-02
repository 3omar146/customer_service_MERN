import Case from "../Models/Case.js";

// GET all cases
export const getAllCases = async (req, res) => {
    try {
        const cases = await Case.find();
        res.status(200).json(cases);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET case by ID
export const getCaseById = async (req, res) => {
    try {
        const caseItem = await Case.findById(req.params.id);
        if (!caseItem) {
            return res.status(404).json({ message: "Case not found" });
        }
        res.status(200).json(caseItem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// POST create new case
export const createCase = async (req, res) => {
    try {
        const { assignedAgentID, clientID, case_description, case_status } = req.body;

        const newCase = new Case({
            assignedAgentID,
            clientID,
            case_description,
            case_status,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        const savedCase = await newCase.save();
        res.status(201).json(savedCase);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// PUT update case by ID
export const updateCaseById = async (req, res) => {
    try {
        const caseItem = await Case.findById(req.params.id);
        if (!caseItem) {
            return res.status(404).json({ message: "Case not found" });
        }

        const { assignedAgentID, clientID, case_description, case_status, logs } = req.body;

        if (assignedAgentID) caseItem.assignedAgentID = assignedAgentID;
        if (clientID) caseItem.clientID = clientID;
        if (case_description) caseItem.case_description = case_description;
        if (case_status) caseItem.case_status = case_status;
        if (logs) caseItem.logs = logs;

        caseItem.updatedAt = new Date();

        const updatedCase = await caseItem.save();
        res.status(200).json(updatedCase);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
