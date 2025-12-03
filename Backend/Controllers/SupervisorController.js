import Supervisor from "../Models/Supervisor.js";
import bcrypt from "bcrypt";

export const getAllSupervisors = async (req, res) => {
  try {
    const supervisors = await Supervisor.find();    
    res.status(200).json(supervisors);
    } catch (error) {
    res.status(500).json({ message: error.message });
    }
};

export const getSupervisorById = async (req, res) => {
  try {
    const supervisor = await Supervisor.findById(req.params.id);
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
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    req.body.password = hashedPassword;
    }
    const result = await Supervisor.updateOne(
      { _id: req.params.id },
      req.body
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Supervisor not found" });
    }

    res.status(200).json(result);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addSupervisor = async (req, res) => {
  try {
    if (req.body.password) {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    req.body.password = hashedPassword;
    }
    const newSupervisor = new Supervisor(req.body);
    const savedSupervisor = await Supervisor.create(newSupervisor);
    res.status(201).json(savedSupervisor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}


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
    const supervisor = await Supervisor.findOne({ email: req.query.email });

    if (!supervisor) {
      return res.status(404).json({ message: "Supervisor not found" });
    }

    res.status(200).json(supervisor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


