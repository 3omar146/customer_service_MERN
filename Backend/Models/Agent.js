import mongoose from "mongoose";

const agentSchema = new mongoose.Schema({
  department: String,
  email: String,
  isActive: Boolean,
  name: String,
  role: String,
  password: String,

  supervisorID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Supervisor"
  },

  updatedAt: Date
});

export default mongoose.model("Agent", agentSchema);