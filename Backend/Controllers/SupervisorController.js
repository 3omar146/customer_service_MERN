import Supervisor from "../Models/Supervisor.js";
import bcrypt from "bcrypt";

export const getAllSupervisors = async (req, res) => {
  try {
    const supervisors = await Supervisor.find().select("-password");    
    res.status(200).json(supervisors);
    } catch (error) {
    res.status(500).json({ message: error.message });
    }
};

export const getSupervisorById = async (req, res) => {
  try {
    const supervisor = await Supervisor.findById(req.params.id).select("-password");
    if (!supervisor) {
      return res.status(404).json({ message: "Supervisor not found" });
    }
    res.status(200).json(supervisor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }};

export const updateSupervisor = async (req, res) => {
  try {
    if (req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 10);
    }

    const updated = await Supervisor.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true, select: "-password" }
    );

    if (!updated) 
      return res.status(404).json({ message: "Supervisor not found" });

    res.status(200).json(updated);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addSupervisor = async (req, res) => {
  try {
    if (req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 10);
    }

    const supervisor = await Supervisor.create(req.body);

    const { password, ...safeSupervisor } = supervisor.toObject();
    res.status(201).json(safeSupervisor);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const deleteSupervisor = async (req, res) => {
  try {
    const result = await Supervisor.deleteOne({ _id: req.params.id });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Supervisor not found" });
    }

    res.status(200).json({ message: "Supervisor deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getSupervisorByEmail = async (req, res) => {
  try {
    const supervisor = await Supervisor.findOne({ email: req.query.email }).select("-password");

    if (!supervisor) {
      return res.status(404).json({ message: "Supervisor not found" });
    }

    res.status(200).json(supervisor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


