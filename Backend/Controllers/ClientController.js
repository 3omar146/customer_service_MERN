import Client from '../Models/Client.js';
import Case from '../Models/Case.js';

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

// Get Cases for a specific Client
export const getCasesByClientId = async (req, res) => {
    try {
        const cases = await Case.find({ clientId: req.params.id }).sort({ createdAt: -1 });

        res.status(200).json(cases);

    } 
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
