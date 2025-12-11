import express from "express"
import { authMiddleware } from "../middlewares/authMiddleware"
import { FoodController } from "../controllers/foodController"

export const privateRouter = express.Router();
