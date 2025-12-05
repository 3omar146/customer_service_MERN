import Log from '../Models/Log.js'


// get all Logs
export const getAllLogs = async (req,res)=>{
    try{
        const logs = await Log.find().sort({timestamp: -1});
        res.json(logs);
    }
    catch(err){
       res.status(500).json({ error: err.message });
    }
}

// get log by id
export const getLogById = async (req,res)=>{
    try{
        const logId = req.params.id;
        const log = Log.findById(logId);
        if(!log)
            return res.status(404).json({ message: "Log not found" });
        res.json(log);
    }
    catch(err){
        res.status(500).json({ error: err.message });
    }
}


// get all logs performed by specific agent
export const getLogsMadeByagent = async (req, res) => {
  try {
  const agentId = req.user.id;

    const logs = await Log.find({
      performedBy: new mongoose.Types.ObjectId(agentId)
    }).sort({ timestamp: -1 });

    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// create a new Log
export const createLog = async (req, res) => {
  try {
    const { caseID, performedBy, protocolID, timestamp } = req.body;

    const newLog = await Log.create({
      caseID,
      performedBy,
      protocolID,
      timestamp: timestamp || Date.now()
    });

    res.status(201).json(newLog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//update a Log 
export const updateLog = async (req, res) => {
  try {
    const logId = req.params.logId;

    const updatedLog = await Log.findByIdAndUpdate(
      logId,
      req.body,
      { new: true }   
    );
    if (!updatedLog) {
      return res.status(404).json({ message: "Log not found" });
    }
    res.json(updatedLog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// delete a Log
export const deleteLog = async (req, res) => {
  try {
    const logId = req.params.logId;
    const deleted = await Log.findByIdAndDelete(logId);

    if (!deleted) {
      return res.status(404).json({ message: "Log not found" });
    }

    res.json({ message: "Log deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
