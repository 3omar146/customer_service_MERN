import mongoose from "mongoose";

const agentSchema = new mongoose.Schema({
  department: String,
  email: String,
  isActive: Boolean,
  name: String,
  role: String,
  password: String,

  supervisor_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Supervisor"
  },

  updatedAt: Date
});

module.exports = mongoose.model("Agent", agentSchema);