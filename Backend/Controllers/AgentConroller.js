import Agent from "../Models/Agent.js";
import Case from "../Models/Case.js";
import bcrypt from "bcrypt"; 
import mongoose from "mongoose";
import Supervisor from "../Models/Supervisor.js";
import ActionProtoclol from "../Models/ActionProtocol.js";
import Client from "../Models/Client.js";

export const getAllAgents = async (req, res) => {
    try {
        const Agents = await Agent.find({},"-password").sort({ updatedAt: -1 });
        res.status(200).json(Agents);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//get agent by id
export const getAgentById = async (req, res) => {
    try {
        const  id  = req.params.id;
        const agent = await Agent.find({ _id: id });
        if(!agent){
            return res.status(404).json({ message: "Agent not found" });
        }
        res.status(200).json(agent);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getActiveAgents = async (req, res) => {
    try {
        const activeAgents = await Agent.find({ isActive: true });
        res.status(200).json(activeAgents);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//get agent by email
export const getAgentByEmail = async (req, res) => {
    try {
        const { email } = req.params;
        const agent = await Agent.find({ email: email });
        if(!agent){
            return res.status(404).json({ message: "Agent not found" });
        }
        res.status(200).json(agent);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// Get agents by role
export const getAgentsByRole = async (req, res) => {
    try {
        const { AgentRole } = req.params; 
        const agents = await Agent.find({ role: AgentRole });
        
        if (!agents || agents.length === 0) {
            return res.status(404).json({ message: "No agents found with this role" });
        }

        res.status(200).json(agents);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



//get specific agents by supervisor id
export const getAgentsBySupervisor = async (req, res) => {
    try{
        const  supervisorId  = req.user.id;
        const agents = await Agent.find({supervisorID: supervisorId});
        if(!agents || agents.length === 0){
            return res.status(404).json({ message: "No agents found for this supervisor" });
        }
        res.status(200).json(agents);
    }catch(error){
          console.error("getAgentsBySupervisor ERROR:", error);

        res.status(500).json({ message: error.message });

    }
}

//create a new agent
export const createAgent = async (req, res) => {
try{
const {department, email, name, role, password} = req.body;

    //check if email already exists
    const clientExists = await Client.findOne({ email });
    if (clientExists)
      return res.status(400).json({ message: "Email already in use" });
    // Check in agents
    const agentExists = await Agent.findOne({ email });
    if (agentExists)
      return res.status(400).json({ message: "Email is already registered" });

    // Check in supervisors
    const supervisorExists = await Supervisor.findOne({ email });
    if (supervisorExists)
      return res.status(400).json({ message: "Email is already registered" });

const supervisorID = req.user.id;
const hashedPassword = await bcrypt.hash(password, 10);
const newAgent = new Agent({
    department,
    email,
    isActive: false, // New agents are inactive by default
    name,
    role,
    password: hashedPassword, // <-- FIXED
    supervisorID,
    updatedAt: new Date()
});

await newAgent.save();
res.status(201).json(newAgent);
}catch(error){
    res.status(500).json({ message: error.message });
}



}
// Delete agent and update assigned cases
export const deleteAgent = async (req, res) => {
    try {
        const { id } = req.params;
        console.log("Delete agent route hit with ID:", id);
        // Find the agent
        const agent = await Agent.findById(id);
        if (!agent) {
            return res.status(404).json({ message: "Agent not found" });
        }

        console.log("Found agent:", agent);

        // Update cases assigned to this agent
        const updatedCases = await Case.updateMany(
            { assignedAgentID: id },
            { 
                $set: { assignedAgentID: null },
                $currentDate: {}, 
            }
        );

        const UpdatedActionProtocols = await ActionProtoclol.updateMany(
          { agentID: id ,case_status: { $ne: "solved" } },
          { $set: { agentID: null } }
      );
        // Update case_status from "pending" to "unsolved"
        const statusUpdatedCases = await Case.updateMany(
            { assignedAgentID: null, case_status: "pending" },
            { $set: { case_status: "unsolved" } }
        );


        // Delete the agent
        const result = await Agent.deleteOne({ _id: id });

        if (result.deletedCount > 0) {
            console.log("Agent deleted successfully");
            return res.status(200).json({ message: "Agent deleted successfully!" });
        } else {
            console.log("Failed to delete agent");
            return res.status(500).json({ message: "Failed to delete agent" });
        }

    } catch (err) {
        console.error("Error:", err);
        return res.status(500).json({ message: "Server error", error: err.message });
    }
};

//edit agent
export const updateAgent = async (req, res) => {
    try {
        const { id } = req.params;
        const { department, email, isActive, name, role, password, supervisor_id } = req.body;

    
        const agent = await Agent.findOne({ _id: id });
        if (!agent) {
            return res.status(404).json({ message: "Agent not found" });
        }


        if (department !== undefined) agent.department = department;
        if (email !== undefined) agent.email = email;
        if (isActive !== undefined) agent.isActive = isActive;
        if (name !== undefined) agent.name = name;
        if (role !== undefined) agent.role = role;
        if (supervisor_id !== undefined) agent.supervisor_id = supervisor_id;

   
        if (password) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            agent.password = hashedPassword;
        }

        agent.updatedAt = new Date();
        await agent.save();

        res.status(200).json(agent);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};



// Route handler to get report for all agents
export const getAgentsReport = async (req, res) => {
       try {
const report = await Case.aggregate([
  {
    // Join agent info
    $lookup: {
      from: "agents",
      localField: "assignedAgentID",
      foreignField: "_id",
      as: "agent"
    }
  },
  { $unwind: "$agent" }, // flatten agent array
  {
    // Group by agent and case status
    $group: {
      _id: { agentId: "$agent._id", agentName: "$agent.name" },
      solvedCases: {
        $sum: { $cond: [{ $eq: ["$case_status", "solved"] }, 1, 0] }
      },
      pendingCases: {
        $sum: { $cond: [{ $eq: ["$case_status", "pending"] }, 1, 0] }
      },
      totalCases: { $sum: 1 }
    }
  },
  {
    // Flatten _id
    $project: {
      _id: 0,
      agentName: "$_id.agentName",
      solvedCases: 1,
      pendingCases: 1,
      totalCases: 1
    }
  },
  { $sort: { totalCases: -1 } }
]);
    res.status(200).json(report);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error generating report" });
  }
};


// Generate agent report by ID
export const getAgentReportById = async (req, res) => {
  try {
    const id  = req.params.id;
      console.log("Agent report route hit", req.user); // check if auth adds user

    const agentId = id.trim(); // remove hidden spaces/newlines

    if (!mongoose.Types.ObjectId.isValid(agentId)) {
      return res.status(400).json({ message: "Invalid agent ID" });
    }

    const report = await Agent.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(agentId) } }, // filter by agent ID
      {
        $lookup: {
          from: "cases",                  
          localField: "_id",
          foreignField: "assignedAgentID",
          as: "cases"
        }
      },
    
  { 
    $unwind: { 
      path: "$cases", 
      preserveNullAndEmptyArrays: true 
    } 
  },
  {
    $group: {
      _id: {
        agentId: "$_id",
        agentName: "$name"
      },
      solvedCases: {
        $sum: {
          $cond: [{ $eq: ["$cases.case_status", "solved"] }, 1, 0]
        }
      },
      pendingCases: {
        $sum: {
          $cond: [{ $eq: ["$cases.case_status", "pending"] }, 1, 0]
        }
      },
      totalCases: {
        $sum: {
          $cond: [{ $ifNull: ["$cases", false] }, 1, 0]
        }
      }
    }
  },
  {
    $addFields: {
      solvedPercentage: {
        $cond: [
          { $eq: ["$totalCases", 0] },
          0,
          {
            $round:[
              {
            $multiply: [
              { $divide: ["$solvedCases", "$totalCases"] },
              100
            ]
          },2]
          }
        ]
      }
    }
  },
  {
    $addFields: {
      PendingPercentage: {
        $cond: [
          { $eq: ["$totalCases", 0] },
          0,
          {
            $round:[
              {
            $multiply: [
              { $divide: ["$pendingCases", "$totalCases"] },
              100
            ]
          },2]
          }
        ]
      }
    }
  },
  {
    $project: {
      _id: 0,
      agentName: "$_id.agentName",
      solvedCases: 1,
      pendingCases: 1,
      totalCases: 1,
      solvedPercentage: 1,
      PendingPercentage:1
    }
  }
]);

    
      // Handle agent with no cases
    if (report.length === 0) {
      const agent = await Agent.findById(agentId);
      if (!agent) return res.status(404).json({ message: "Agent not found" });

      return res.status(200).json({
        agentId: agent._id,
        agentName: agent.name,
        solvedCases: 0,
        pendingCases: 0,
        totalCases: 0
      });
    }

    res.status(200).json(report[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error generating agent report" });
  }
};

export const assignAgentToCase = async (req, res) => {
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


///report
export const getAllAgentsReport = async (req, res) => {
  try {
    const supervisorID = req.user.id;
     const supervisor = await Supervisor.findById(supervisorID);
if (!supervisor) {
  return res.status(403).json({ error: "Access denied" });
}


    const agents = await Agent.find({ supervisorID });
    const agentIDs = agents.map(a => a._id);

    // Active vs inactive
    const activeAgents = agents.filter(a => a.isActive).length;
    const inactiveAgents = agents.filter(a => !a.isActive).length;

    // 2) Top 3 agents by solved cases 
    const topSolved = await Case.aggregate([
      {
        $match: {
          case_status: "solved",
          assignedAgentID: { $in: agentIDs }
        }
      },
      {
        $group: {
          _id: "$assignedAgentID",
          solvedCount: { $sum: 1 }
        }
      },
      { $sort: { solvedCount: -1 } },
      { $limit: 3 },
      {
        $lookup: {
          from: "agents",
          localField: "_id",
          foreignField: "_id",
          as: "agent"
        }
      },
      { $unwind: "$agent" },
      {
        $project: {
          agentName: "$agent.name",
          email: "$agent.email",
          solvedCount: 1
        }
      }
    ]);

    // Top 3 agents by average solving time
    const topAvgSolve = await Case.aggregate([
      {
        $match: {
          case_status: "solved",
          assignedAgentID: { $in: agentIDs }
        }
      },
      {
        $project: {
          assignedAgentID: 1,
          diffHours: {
            $divide: [
              { $subtract: ["$updatedAt", "$createdAt"] },
              1000 * 60 * 60
            ]
          }
        }
      },
      {
        $group: {
          _id: "$assignedAgentID",
          avgSolveTime: { $avg: "$diffHours" }
        }
      },
      { $sort: { avgSolveTime: 1 } },
      { $limit: 3 },
      {
        $lookup: {
          from: "agents",
          localField: "_id",
          foreignField: "_id",
          as: "agent"
        }
      },
      { $unwind: "$agent" },
      {
        $project: {
          agentName: "$agent.name",
          email: "$agent.email",
          avgSolveTime: 1
        }
      }
    ]);

    res.json({
      activeAgents,
      inactiveAgents,
      topSolved,
      topAvgSolve
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate agents report" });
  }
};
