import express from 'express';
import { login, logout, signupClient } from '../Controllers/AuthController.js';
const router = express.Router();

router.post('/login', login);
router.post('/logout', logout);
router.post('/signup', signupClient);

export default router;