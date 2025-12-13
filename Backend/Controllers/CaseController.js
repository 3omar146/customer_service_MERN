import mongoose from "mongoose";
import Case from "../Models/Case.js";
import Agent from "../Models/Agent.js";
import Supervisor from "../Models/Supervisor.js";

// Get cases assigned to an agent (not solved), supervisor uses this API 
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

// agent wants to get his assigned cases (Agent view)
export const getCasesAssignedToSpecificAgent = async (req, res) => {
  const agentId = req.user.id;

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



// Get solved cases by agent (supervisor view)
export const getSolvedCasesByAgent = async (req, res) => {
  const { agentId } = req.params;

  try {
    const cases = await Case.aggregate([
      {
        $match: {
          assignedAgentID: new mongoose.Types.ObjectId(agentId),
          case_status: "solved",
        },
      },
      {
        // Join with Agent collection to get agent info
        $lookup: {
          from: "agents", // MongoDB collection name (usually lowercase plural)
          localField: "assignedAgentID",
          foreignField: "_id",
          as: "agentInfo",
        },
      },
      {
        // Unwind array from $lookup
        $unwind: "$agentInfo",
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        // Optional: project only needed fields
        $project: {
          case_description: 1,
          case_status: 1,
          createdAt: 1,
          updatedAt: 1,
          assignedAgentID: 1,
          agentName: "$agentInfo.name", // add agent name here
          agentEmail: "$agentInfo.email", // optional if you want email too
        },
      },
    ]);

    res.status(200).json(cases);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Get Pending cases by agent (supervisor view)
export const getPendingCasesByAgent = async (req, res) => {
  const { agentId } = req.params;

  try {
    const cases = await Case.aggregate([
      {
        $match: {
          assignedAgentID: new mongoose.Types.ObjectId(agentId),
          case_status: "pending",
        },
      },
      {
        // Join with Agent collection to get agent info
        $lookup: {
          from: "agents",
          localField: "assignedAgentID",
          foreignField: "_id",
          as: "agentInfo",
        },
      },
      {
        // Unwind array from $lookup
        $unwind: "$agentInfo",
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        // Optional: project only needed fields
        $project: {
          case_description: 1,
          case_status: 1,
          createdAt: 1,
          updatedAt: 1,
          assignedAgentID: 1,
          agentName: "$agentInfo.name", // add agent name here
          agentEmail: "$agentInfo.email", // optional if you want email too
        },
      },
    ]);

    res.status(200).json(cases);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};






// export const getSolvedCasesByAgent = async (req, res) => {
//     const { agentId } = req.params;
//     try {
//         const cases = await Case.aggregate([
//             {
//                 $match: {
//                     assignedAgentID: new mongoose.Types.ObjectId(agentId),
//                     case_status: "solved"
//                 }
//             },
//             { $sort: { createdAt: -1 } }
//         ]);

//         res.status(200).json(cases);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

// Get solved cases by agent (agent view)
export const getSolvedCasesBySpecificAgent = async (req, res) => {
  const agentId = req.user.id;
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
          case_status: "unsolved"
        }
      },
      { $sort: { createdAt: -1 } },
      { $project: { assignedAgentID: 0 } }
    ]);

    res.status(200).json(cases);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Get all cases
export const getAllCases = async (req, res) => {
  try {
    let query = {};

    // CLIENT: only their own cases
    if (req.user.type === "client") {
      query.clientID = req.user.id;
    }

    // Agent & Supervisor: sees all cases (no filter)
    const cases = await Case.find(query).sort({ createdAt: -1 });
    res.status(200).json(cases);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get case by ID
export const getCaseById = async (req, res) => {
  try {
    const caseInfo = await Case.findById(req.params.id)
      .populate("assignedAgentID", "name email")
      .populate("recommendedActionProtocol", "steps type timestamp");

    if (!caseInfo) {
      return res.status(404).json({ message: "Case not found" });
    }

    const response = {
      ...caseInfo.toObject(),

      agentName: caseInfo.assignedAgentID?.name || "Not assigned",
      agentEmail: caseInfo.assignedAgentID?.email || "No email",

      recommendedActionProtocolType:
        caseInfo.recommendedActionProtocol?.type || null
    };

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




// Create a new case
export const createCase = async (req, res) => {
  try {
    const newCase = new Case({
      case_description: req.body.case_description,
      case_status: "unsolved",
      clientID: req.user.id,
      createdAt: new Date(),
      updatedAt: new Date()
    });

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
  try {
    const caseID = req.params.id;

    console.log("Solving case:", caseID);

    if (!caseID) {
      return res.status(400).json({ message: "caseID is required" });
    }

    const caseItem = await Case.findById(caseID);
    if (!caseItem) {
      return res.status(404).json({ message: "Case not found" });
    }

    // Validation: case_status must not be null
    if (!caseItem.recommendedActionProtocol) {
      return res.status(400).json({
        message: "To solve case must select an action protocol"
      });
    }

    // Must be pending and assigned before solving
    if (!caseItem.assignedAgentID || caseItem.case_status !== "pending") {
      return res.status(400).json({
        message: "Only pending cases with assigned agent can be solved"
      });
    }

    // Update case
    caseItem.case_status = "solved";
    caseItem.updatedAt = new Date();


    const updated = await caseItem.save();

    //create log entry (if needed, implement logging here)

    res.status(200).json(updated);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



export const assignCaseToAgent = async (req, res) => {
  try {
    const agentId = req.user.id;        // logged-in agent
    const caseId = req.params.caseId;   // correct parameter

    // Optional: verify agent exists
    const agent = await Agent.exists({ _id: agentId });
    if (!agent) {
      return res.status(404).json({ message: "Agent not found" });
    }

    // Assign case only if not pending or solved
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

    // SUCCESS RESPONSE (ONLY ONE)
    return res.status(200).json({
      message: "Case assigned successfully",
      case: assignedCase
    });

  } catch (error) {
    console.error("Error assigning case:", error);
    return res.status(500).json({ message: error.message });
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
          recommendedActionProtocol:null,
          case_status: "unsolved"
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


export const getCasesForSupervisor = async (req, res) => {
  try {
    const supervisorId = req.user.id;

    // 1. Fetch all agent IDs under this supervisor
    const agentIds = await Agent.find(
      { supervisorID: supervisorId },
      { _id: 1 }
    ).then(agents => agents.map(a => a._id));

    // 2. Fetch cases (optimized match)
    const cases = await Case.aggregate([
      {
        $match: {
          $or: [
            { case_status: "unsolved" },               // Unassigned
            { assignedAgentID: { $in: agentIds } }     // Cases handled by supervisor's agents
          ]
        }
      },

      // Join agent info
      {
        $lookup: {
          from: "agents",
          localField: "assignedAgentID",
          foreignField: "_id",
          as: "agent"
        }
      },
      {
        $unwind: {
          path: "$agent",
          preserveNullAndEmptyArrays: true
        }
      },

      // Final shape
      {
        $project: {
          _id: 1,
          case_description: 1,
          case_status: 1,
          createdAt: 1,
          updatedAt: 1,

          assignedAgentID: 1,
          agentName: "$agent.name",
          agentEmail: "$agent.email",
        }
      },

      { $sort: { case_status: -1, createdAt: -1 } }
    ]);

    res.status(200).json(cases);

  } catch (error) {
    console.error("Error in getCasesForSupervisor:", error);
    res.status(500).json({ message: error.message });
  }
};

////report for supervisor

export const getCasesReport = async (req, res) => {
  try {
    const supervisorID = req.user.id;

    const supervisor = await Supervisor.findById(supervisorID);
    if (!supervisor) {
      return res.status(403).json({ error: "Access denied" });
    }

    // Get supervisor's agents
    const agents = await Agent.find({ supervisorID }, { _id: 1 });
    const agentIDs = agents.map(a => a._id);

    // CASE COUNTS (supervisor-owned + unassigned)
    const counts = await Case.aggregate([
      {
        $match: {
          $or: [
            { assignedAgentID: null },         // unassigned unsolved
            { assignedAgentID: { $in: agentIDs } } // supervisor agent cases
          ]
        }
      },
      {
        $group: {
          _id: "$case_status",
          count: { $sum: 1 }
        }
      }
    ]);

    const totals = {
      totalUnsolved: counts.find(c => c._id === "unsolved")?.count || 0,
      totalPending: counts.find(c => c._id === "pending")?.count || 0,
      totalSolved: counts.find(c => c._id === "solved")?.count || 0
    };

    // AVERAGE SOLVE TIME (only supervisor's agents)
    const avgSolve = await Case.aggregate([
      {
        $match: {
          case_status: "solved",
          assignedAgentID: { $in: agentIDs }
        }
      },
      {
        $project: {
          diffHours: {
            $divide: [
              { $subtract: ["$updatedAt", "$createdAt"] },
              1000 * 60 * 60
            ]
          }
        }
      },
      { $group: { _id: null, avgHours: { $avg: "$diffHours" } } }
    ]);

    const averageSolvingTime = avgSolve[0]?.avgHours || 0;

    // OLDEST UNSOLVED (only unassigned)
    const oldestUnsolved = await Case.aggregate([
      {
        $match: {
          case_status: "unsolved",
          assignedAgentID: null
        }
      },
      { $sort: { createdAt: 1 } },
      { $limit: 5 },
      {
        $addFields: {
          hoursSinceCreated: {
            $divide: [
              { $subtract: [new Date(), "$createdAt"] },
              1000 * 60 * 60
            ]
          }
        }
      },
      {
        $project: {
          _id: 1,
          case_description: 1,
          hoursSinceCreated: 1
        }
      }
    ]);

    res.json({
      ...totals,
      averageSolvingTime,
      oldestUnsolved
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate cases report" });
  }
};



