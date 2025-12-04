import express from 'express';
import{
    getClientById
} from '../Controllers/ClientController.js';

const router = express.Router();
router.get('/:id', getClientById);

export default router;