import mongoose from "mongoose";

const logsSchema = new mongoose.Schema(
  {
    caseID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Case",       // reference to Case model
      required: true
    },
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Agent",      // reference to Agent model
      required: true
    },
    protocolID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ActionProtocol",   // reference to Protocol model
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true } 
);

export default mongoose.model("Log", logsSchema);
