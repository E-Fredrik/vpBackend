import express from 'express';
import { UserController } from '../controllers/userController';
import { FoodController } from '../controllers/foodController';

export const publicRouter = express.Router();

publicRouter.post('/register', UserController.register);
publicRouter.post('/login', UserController.login);

publicRouter.post('/createfood', FoodController.createFood);
publicRouter.get('/getfood/:food_id', FoodController.getFood);