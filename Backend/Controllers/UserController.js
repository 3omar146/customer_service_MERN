import bcrypt from "bcryptjs";
import Client from "../Models/Client.js";
import Agent from "../Models/Agent.js";
import Supervisor from "../Models/Supervisor.js";

////get user////
export const getUser = async (req, res) => {
  try {
    const { id, type } = req.user;
    let user;

    if (type === "client") {
      user = await Client.findById(id);
    } else if (type === "agent") {
      user = await Agent.findById(id);
    } else if (type === "supervisor") {
      user = await Supervisor.findById(id);
    }
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json( user );
  }
    catch (err) {
    console.error("GET USER ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};



//update user
export const updateUser = async (req, res) => {
  try {
    const { id, type } = req.user;
    let user;

    // Fetch user based on type
    if (type === "client") {
      user = await Client.findById(id);
    } else if (type === "agent") {
      user = await Agent.findById(id);
    } else if (type === "supervisor") {
      user = await Supervisor.findById(id);
    }

    if (!user) return res.status(404).json({ message: "User not found" });

    const updates = req.body;

    // -----------------------------
    // SIMPLE EMAIL UNIQUENESS CHECK
    // -----------------------------
    if (updates.email) {
      const email = updates.email;

      const existingClient = await Client.findOne({ email });
      const existingAgent = await Agent.findOne({ email });
      const existingSupervisor = await Supervisor.findOne({ email });

      const found =
        existingClient || existingAgent || existingSupervisor;

      if (found && found._id.toString() !== id) {
        return res.status(400).json({ message: "Email already in use" });
      }
    }

    // Hash password if included
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    // Apply updates
    for (const key in updates) {
      user[key] = updates[key];
    }

    user.updatedAt = new Date();
    await user.save();

    user.password = undefined;
    res.status(200).json({ message: "User updated", user });

  } catch (err) {
    console.error("UPDATE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};


export const updatePassword = async (req, res) => {
  try {
    const { id, type } = req.user;
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        message: "oldPassword and newPassword are required"
      });
    }

    let user;

    // Find the correct user based on JWT type
    if (type === "client") {
      user = await Client.findById(id);
    } else if (type === "agent") {
      user = await Agent.findById(id);
    } else if (type === "supervisor") {
      user = await Supervisor.findById(id);
    }

    if (!user) return res.status(404).json({ message: "User not found" });

    // Compare old password
    const match = await bcrypt.compare(oldPassword, user.password);
    if (!match) {
      return res.status(400).json({ message: "Incorrect old password" });
    }

    // Hash and update new password
    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    user.updatedAt = new Date();

    await user.save();

    res.status(200).json({ message: "Password updated successfully" });

  } catch (err) {
    console.error("UPDATE PASSWORD ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};
