import ActionProtocol from "../Models/ActionProtocol.js"

// get all Protocols
export const getAllProtocols = async (req, res) => {
  try {
    const protocols = await ActionProtocol.find().sort({ timestamp: -1 });
    console.log("bayzaaaa");
    res.json(protocols);
    console.log("ay hagaaa");
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// get Protocol By Id
export const getProtocolById = async (req, res) => {
try{
    const protocolID= req.params.id;
    const protocol = await ActionProtocol.findById(protocolID);

    if (!protocol)
      return res.status(404).json({ message: "Protocol not found" });

    res.json(protocol);
}
catch(err){
    res.status(500).json({ error: err.message });
}
}

// Add a new Action Prototcol
export const createProtocol = async (req, res) => {
  try {
       const addedProtocol = await ActionProtocol.create(req.body);
    res.status(201).json(addedProtocol);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


// Update a Protocol by ID
export const updateProtocol = async (req, res) => {
  try {
    const protocolID = req.params.id;
    const updatedProtocol = await ActionProtocol.findByIdAndUpdate(
      protocolID,
      req.body,
      { new: true }
    );
    if (!updatedProtocol)
      return res.status(404).json({ message: "Protocol not found" });

    res.json(updatedProtocol);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete a Protocol by ID
export const deleteProtocol = async (req, res) => {
  try {
    const protocolId = req.params.id;
    const deletedProtocol = await ActionProtocol.findByIdAndDelete(protocolId);

    if (!deletedProtocol)
      return res.status(404).json({ message: "Protocol not found" });

    res.status(200).json({ message: "Action Protocol deleted successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

