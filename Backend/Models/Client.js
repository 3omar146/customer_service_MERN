import mongoose from "mongoose";

const clientSchema = new mongoose.Schema({
  email: String,
  firstName: String,
  lastName: String,
  phone: String,
  password: String,
  updatedAt: Date
});

module.exports = mongoose.model("Client", clientSchema);