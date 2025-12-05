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
  recommendedActionProtocol:mongoose.Schema.Types.ObjectId,
  createdAt: Date,
  updatedAt: Date,
});
export default mongoose.model("Case", caseSchema);
