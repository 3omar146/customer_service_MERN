import mongoose from "mongoose";

const protocolSchema = new mongoose.Schema({
  agentID: {
    type: String,
    required: true,
  },
  steps: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});


export default mongoose.model("ActionProtocol", protocolSchema,"action_protocols");