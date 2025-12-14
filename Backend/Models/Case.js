import mongoose from "mongoose";

const caseSchema = new mongoose.Schema(
  {
    assignedAgentID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Agent",
    },

    clientID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
    },

    case_description: {
      type: String,
      required: true,
    },

    case_status: {
      type: String,
      required: true,
    },

   
    recommendedActionProtocol: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ActionProtocol",
      default: null,
    },
  },
  {
    timestamps: true, //  let mongoose handle createdAt & updatedAt
  }
);

export default mongoose.model("Case", caseSchema);
