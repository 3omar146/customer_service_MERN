import Agent from "../Models/Agent.js";
import Case from "../Models/Case.js";
import bcrypt from "bcrypt"; 

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
        const { id } = req.params;
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
        const { supervisorId } = req.params;
        const agents = await Agent.find({supervisorID: supervisorId});
        if(!agents || agents.length === 0){
            return res.status(404).json({ message: "No agents found for this supervisor" });
        }
        res.status(200).json(agents);
    }catch(error){
        res.status(500).json({ message: error.message });

    }
}

//create a new agent
export const createAgent = async (req, res) => {
try{
const {department, email, name, role, password, supervisorID} = req.body;
const hashedPassword = await bcrypt.hash(password, 10);
const newAgent = new Agent({
    department,
    email,
    isActive: true,
    name,
    role,
    hashedPassword,
    supervisorID,
    updatedAt: new Date()
});
await newAgent.save();
res.status(201).json(newAgent);
}catch(error){
    res.status(500).json({ message: error.message });
}



}
//delete agent
export const deleteAgent = async (req, res) => {
    try{
        const {id} = req.params;
        const agent = await Agent.findOne({ _id: id });
        if (!agent) {
            console.log("Agent not found");
            res.status(404).json({ message: "Agent not found" });
            return;
        }

        console.log("Found agent:", agent);

        const result = await Agent.deleteOne({ _id: id });

        if (result.deletedCount > 0) {
            console.log("Agent deleted successfully");
            res.status(200).json({ message: "Agent deleted successfully!" });
        } else {
            console.log("Failed to delete agent");
        }

    } catch (err) {
        console.error("Error:", err);
    }
}
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

