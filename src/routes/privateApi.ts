import express from "express"
import { authMiddleware } from "../middlewares/authMiddleware"
import { FoodInLogController } from "../controllers/foodInLogController"
import { FoodLogController } from "../controllers/foodLogController";

export const privateRouter = express.Router();

privateRouter.use(authMiddleware)

privateRouter.post('/foodinlogs', FoodInLogController.createFoodInLog)
privateRouter.get('/foodinlogs/:food_in_log_id', FoodInLogController.getFoodInLog)
privateRouter.put('/foodinlogs/:food_in_log_id', FoodInLogController.updateFoodInLog)
privateRouter.delete('/foodinlogs/:food_in_log_id', FoodInLogController.deleteFoodInLog)

privateRouter.post('/foodlogs', FoodLogController.createFoodLog)
privateRouter.get('/foodlogs/:log_id', FoodLogController.getFoodLog)
privateRouter.put('/foodlogs/:log_id', FoodLogController.updateFoodLog)
privateRouter.delete('/foodlogs/:log_id', FoodLogController.deleteFoodLog)
