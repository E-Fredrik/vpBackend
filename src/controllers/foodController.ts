import { Request, NextFunction, Response } from "express"
import { FoodService } from "../services/foodService"
import { FoodCreateUpdateRequest } from "../models/foodModel"

export class FoodController {
    static async getFood(req: Request, res: Response, next: NextFunction) {
        try {
            const food = Number(req.params.food_id)
            const response = await FoodService.getFood(food);
            res.status(200).json({
                data: response,
            })
        } catch (error) {
            next(error)
        }
    }

    static async getFoodByName(req: Request, res: Response, next: NextFunction) {
        try {
            const name = req.params.name
            const response = await FoodService.getFoodByName(name);
            res.status(200).json({
                data: response,
            })
        }
        catch (error) {
            next(error)
        }
    }

    static async createFood(req: Request, res: Response, next: NextFunction) {
        try {
            const request: FoodCreateUpdateRequest = req.body as FoodCreateUpdateRequest;
            const response = await FoodService.createFood(request);
            res.status(200).json({
                data: response,
            })
        } catch (error) {
            next(error)
        }
    }
}
