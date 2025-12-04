import Client from '../Models/Client.js';
import Case from '../Models/Case.js';
import mongoose from 'mongoose';

// Get client details by ID
export const getClientById = async (req, res) => {
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

// Get Cases for a specific Client via ID

export const getCasesByClient = async (req, res) => {
  try {
    const cases = await Case.find({ clientID: req.params.id })
      .sort({ createdAt: -1 });

    res.status(200).json(cases);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Client profile details
export const updateClientProfile = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ID format
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid client ID format" });
        }

        // Allow only safe profile fields
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