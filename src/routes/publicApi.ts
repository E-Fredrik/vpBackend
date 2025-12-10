import express from 'express';
import { UserController } from '../controllers/userController';

export const publicRouter = express.Router();

publicRouter.post('/register', UserController.register);
publicRouter.post('/login', UserController.login);