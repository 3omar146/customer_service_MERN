import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema({
  email: String,
  firstName: String,
  lastName: String,
  phone: String,
  password: String,
  updatedAt: Date
});

export default mongoose.model("Client", clientSchema);