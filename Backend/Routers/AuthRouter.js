import express from 'express';
import { login, logout, signupClient } from '../Controllers/AuthController.js';
import auth from "../Middleware/AuthMiddleware.js";

const router = express.Router();

router.post('/login', login);
router.post('/logout',auth, logout);
router.post('/signup' , signupClient);


export default router;