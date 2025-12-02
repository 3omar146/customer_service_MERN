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
        const { assignedAgentID, clientID, case_description, status } = req.body;

        const newCase = new Case({
            assignedAgentID,
            clientID,
            case_description,
            status,
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

        const { assignedAgentID, clientID, case_description, status, logs } = req.body;

        if (assignedAgentID) caseItem.assignedAgentID = assignedAgentID;
        if (clientID) caseItem.clientID = clientID;
        if (case_description) caseItem.case_description = case_description;
        if (status) caseItem.status = status;
        if (logs) caseItem.logs = logs;

        caseItem.updatedAt = new Date();

        const updatedCase = await caseItem.save();
        res.status(200).json(updatedCase);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// ASSIGN a case to an agent
export const assignCaseToAgent = async (req, res) => {
  try {
    caseID=req.params.id;
    const { agentID } = req.body;

    if (!caseID || !agentID) {
      return res.status(400).json({ message: "caseID and agentID are required" });
    }

    // Find the case
    const caseItem = await Case.findById(caseID);
    if (!caseItem) {
      return res.status(404).json({ message: "Case not found" });
    }

    // Find the agent (optional: ensure active)
    const agent = await mongoose.model("Agent").findById(agentID);
    if (!agent) {
      return res.status(404).json({ message: "Agent not found" });
    }

    // CASE VALIDATION RULES
    if (caseItem.status === "solved" || caseItem.status === "pending") {
      return res.status(400).json({ 
        message: "Cannot assign a solved case" 
      });
    }

    // If case is unsolved, status must change to pending when assigning
    if (caseItem.status === "unsolved") {
      caseItem.status = "pending"; 
    }

    // Assign agent + reset logs (pending cases MUST have logs=null)
    caseItem.assignedAgentID = agentID;
    caseItem.logs = null;
    caseItem.updatedAt = new Date();

    const updated = await caseItem.save();
    res.status(200).json(updated);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// SOLVE a case and set logs
export const solveCase = async (req, res) => {
  try {
     caseID=req.params.id;
    const { logs } = req.body;

    if (!caseID || !logs) {
      return res.status(400).json({ message: "caseID and logs are required" });
    }

    // Required log fields
    const requiredFields = ["performedByID", "protocolID", "timestamp"];
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
    if (!caseItem.assignedAgentID) {
      return res.status(400).json({
        message: "Cannot solve a case with no assigned agent"
      });
    }

    // Apply the update
    caseItem.status = "solved";
    caseItem.logs = logs;
    caseItem.updatedAt = new Date();

    const updated = await caseItem.save();
    res.status(200).json(updated);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};





