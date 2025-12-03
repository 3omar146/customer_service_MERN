import mongoose from "mongoose";

const caseSchema = new mongoose.Schema({
  assignedAgentID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Agent"
  },

  clientID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Client"
  },

  case_description: String,
  case_status: String,

  createdAt: Date,
  updatedAt: Date,

  logs: {
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Agent"
    },
    protocol_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ActionProtocol"
    },
    timestamp: Date
  }
});
export default mongoose.model("Case", caseSchema);
