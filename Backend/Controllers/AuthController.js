import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Client from "../Models/Client.js";
import Agent from "../Models/Agent.js";
import Supervisor from "../Models/Supervisor.js";
import dotenv from "dotenv";
dotenv.config();


// Helper for creating JWT
const createToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// ------------------ SIGNUP (Clients only) ------------------
export const signupClient = async (req, res) => {
  try {
    const { email, firstName, lastName, phone, password } = req.body;

    // Check in clients
    const clientExists = await Client.findOne({ email });
    if (clientExists)
      return res.status(400).json({ message: "Email already in use" });

    // Check in agents
    const agentExists = await Agent.findOne({ email });
    if (agentExists)
      return res.status(400).json({ message: "Email is already registered to an agent" });

    // Check in supervisors
    const supervisorExists = await Supervisor.findOne({ email });
    if (supervisorExists)
      return res.status(400).json({ message: "Email is already registered to a supervisor" });

    // Everything OK → create client
    const hashed = await bcrypt.hash(password, 10);

    const client = await Client.create({
      email,
      firstName,
      lastName,
      phone,
      password: hashed,
      updatedAt: new Date()
    });

    const token = createToken({ id: client._id, type: "client" });

    res.cookie("auth", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

res.status(200).json({ message: "Client created", user: client });


  } catch (err) {
    console.error("SIGNUP ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};


// ------------------ LOGIN (Clients, Agents, Supervisors) ------------------
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    let user = await Client.findOne({ email });
    let type = "client";

    if (!user) {
      user = await Agent.findOne({ email });
      type = "agent";
    }

    if (!user) {
      user = await Supervisor.findOne({ email });
      type = "supervisor";
    }

    if (!user) return res.status(404).json({ message: "User not found" });

    // ------------------ SAFE HASH CHECK ------------------
    let isHashed = false;

    if (typeof user.password === "string") {
      isHashed =
        user.password.startsWith("$2a$") ||
        user.password.startsWith("$2b$") ||
        user.password.startsWith("$2y$");
    }

    if (!isHashed) {
      console.log("⚠️ Plaintext password detected. Auto-hashing it now...");

      if (!user.password) {
        return res.status(500).json({
          message: "User password is missing in the database."
        });
      }
      user.updatedAt = new Date();
      user.password = await bcrypt.hash(user.password, 10);
      await user.save();
    }
    // -----------------------------------------------------

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid password" });

    const token = createToken({ id: user._id, type });

    res.cookie("auth", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

user.password = undefined;
res.status(200).json({ message: "Logged in", type, user });

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};



// ------------------ LOGOUT ------------------
export const logout = (req, res) => {
  res.clearCookie("auth");
  res.json({ message: "Logged out" });
};



