import mongoose from "mongoose";

const actionProtocolSchema = new mongoose.Schema({
  agentID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Agent"
  },
  action: String,
  type: String,
  timestamp: Date
});

module.exports = mongoose.model("ActionProtocol", actionProtocolSchema);