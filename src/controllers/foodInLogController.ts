import { Response, NextFunction } from "express"
import { FoodInLogService } from "../services/foodInLogService"
import { FoodInLogCreateUpdateRequest } from "../models/foodInLogModel"
import { UserRequest } from "../models/userRequestModel"
import { prismaClient } from "../utils/databaseUtil"
import { ResponseError } from "../error/responseError"

export class FoodInLogController {
    static async createFoodInLog(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const user = req.user
            if (!user) return next(new ResponseError(401, "Unauthorized"))

            const request: FoodInLogCreateUpdateRequest = req.body as FoodInLogCreateUpdateRequest;

            const log = await prismaClient.food_Log.findUnique({ where: { log_id: request.log_id } })
            if (!log) return next(new ResponseError(404, "Log not found"))
            if (log.user_id !== user.id) return next(new ResponseError(403, "Forbidden"))

            const response = await FoodInLogService.createFoodInLog(request);
            res.status(200).json({
                data: response,
            })
        } catch (error) {
            next(error);
        }
    }

    static async getFoodInLog(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const user = req.user
            if (!user) return next(new ResponseError(401, "Unauthorized"))

            const foodInLogId = Number(req.params.food_in_log_id);
            const existing = await prismaClient.foodInLog.findUnique({
                where: { id: foodInLogId },
                include: { log: true }
            })
            if (!existing) return next(new ResponseError(404, "Food in log not found"))
            if (existing.log.user_id !== user.id) return next(new ResponseError(403, "Forbidden"))

            const response = await FoodInLogService.getFoodInLog(foodInLogId);
            res.status(200).json({
                data: response,
            });
        } catch (error) {
            next(error);
        }
    }

    static async updateFoodInLog(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const user = req.user
            if (!user) return next(new ResponseError(401, "Unauthorized"))

            const foodInLogId = Number(req.params.food_in_log_id);
            const existing = await prismaClient.foodInLog.findUnique({
                where: { id: foodInLogId },
                include: { log: true }
            })
            if (!existing) return next(new ResponseError(404, "Food in log not found"))
            if (existing.log.user_id !== user.id) return next(new ResponseError(403, "Forbidden"))

            const request: FoodInLogCreateUpdateRequest = req.body as FoodInLogCreateUpdateRequest;
            const response = await FoodInLogService.updateFoodInLog(foodInLogId, request);
            res.status(200).json({
                data: response,
            });
        } catch (error) {
            next(error);
        }
    }

    static async deleteFoodInLog(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const user = req.user
            if (!user) return next(new ResponseError(401, "Unauthorized"))

            const foodInLogId = Number(req.params.food_in_log_id);
            const existing = await prismaClient.foodInLog.findUnique({
                where: { id: foodInLogId },
                include: { log: true }
            })
            if (!existing) return next(new ResponseError(404, "Food in log not found"))
            if (existing.log.user_id !== user.id) return next(new ResponseError(403, "Forbidden"))

            const message = await FoodInLogService.deleteFoodInLog(foodInLogId);
            res.status(200).json({
                message: message,
            });
        } catch (error) {
            next(error);
        }
    }
}