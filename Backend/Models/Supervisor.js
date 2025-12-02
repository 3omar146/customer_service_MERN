import mongoose from "mongoose";

const supervisorSchema = new mongoose.Schema({
  department: String,
  email: String,
  name: String,
  role: String,
  password: String,
  updatedAt: Date
});
export default mongoose.model("Supervisor", supervisorSchema);