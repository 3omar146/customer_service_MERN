import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import supervisorRouter from './Routers/SupervisorRouter.js';
import agentRouter from './Routers/AgentRouter.js';
import caseRouter from './Routers/CaseRouter.js';
import protocolRouter from './Routers/ActionProtocolRouter.js'
import clientRouter from './Routers/ClientRouter.js';
import authRouter from './Routers/AuthRouter.js';
import cookieParser from "cookie-parser";
import userRouter from './Routers/UserRouter.js';
import logRouter from './Routers/LogRouter.js';


dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",   // your frontend URL
    credentials: true                  // allow cookies
  })
);
//mongo db connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("MongoDB connection error:", err));



//auth routes
app.use('/authentication', authRouter);
//user
app.use('/user', userRouter);
//supervisor routes
app.use('/supervisors', supervisorRouter);
//agent routes
app.use('/agents', agentRouter);
//case routes
app.use('/cases', caseRouter);
// protocol routes
app.use('/protocols', protocolRouter);
// client routes
app.use('/clients', clientRouter);
// log routes
app.use('/logs', logRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
export default app;