import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import supervisorRouter from './Routers/SupervisorRouter.js';
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
app.use(express.json());
app.use(cors());
//mongo db connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("MongoDB connection error:", err));


app.get('/', (req, res) => {
  res.send('Hello World!');
});
//supervisor routes
app.use('/supervisors', supervisorRouter);





app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
export default app;