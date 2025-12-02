import Supervisor from "../Models/Supervisor.js";

export const getAllSupervisors = async (req, res) => {
  try {
    const supervisors = await Supervisor.find();    
    res.status(200).json(supervisors);
    } catch (error) {
    res.status(500).json({ message: error.message });
    }
};
