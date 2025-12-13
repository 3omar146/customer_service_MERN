import Client from '../Models/Client.js';
import Case from '../Models/Case.js';
import mongoose from 'mongoose';

// Helper – enforce client self-access only
const ensureClientSelfAccess = (req, res) => {
  if (req.user.role === "client" && req.user._id.toString() !== req.params.id) {
    return res.status(403).json({ message: "Unauthorized: Cannot access another client's data" });
  }
  return null;
};

// Get default client (no change unless you want to enforce roles)
export const getDefaultClient = async (req, res) => {
  try {
    const client = await Client.findOne();
    if (!client) {
      return res.status(404).json({ message: "No client found in DB" });
    }
    res.status(200).json(client);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get client details by ID
export const getClientById = async (req, res) => {
  const accessError = ensureClientSelfAccess(req, res);
  if (accessError) return accessError;

  try {
    const client = await Client.findById(req.params.id);
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    res.status(200).json(client);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Cases for a specific Client
export const getCasesByClient = async (req, res) => {
  const accessError = ensureClientSelfAccess(req, res);
  if (accessError) return accessError;

  try {
    const cases = await Case.find({ clientID: req.params.id }).sort({ createdAt: -1 });
    res.status(200).json(cases);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Client Profile
export const updateClientProfile = async (req, res) => {
  const accessError = ensureClientSelfAccess(req, res);
  if (accessError) return accessError;

  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid client ID format" });
    }

    const allowedUpdates = ["email", "firstName", "lastName", "phone"];
    const updates = {};

    for (const key of allowedUpdates) {
      if (req.body[key] !== undefined) {
        updates[key] = req.body[key];
      }
    }

    updates.updatedAt = new Date();

    const updatedClient = await Client.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true }
    );

    if (!updatedClient) {
      return res.status(404).json({ message: "Client not found" });
    }

    res.status(200).json(updatedClient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
