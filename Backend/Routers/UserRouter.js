import express from 'express';
import auth from "../Middleware/AuthMiddleware.js";
import { getUser, updateUser,updatePassword } from '../Controllers/UserController.js';

const router = express.Router();

router.get('/',auth , getUser);
router.patch('/',auth , updateUser);
router.patch("/password", auth, updatePassword);

export default router;