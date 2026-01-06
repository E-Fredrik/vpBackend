import { FoodLogService } from './../services/foodLogService'
import { Response, NextFunction } from "express"
import { UserRequest } from '../models/userRequestModel'
import { FoodLogCreateUpdateRequest } from '../models/foodLogModel'
import { prismaClient } from '../utils/databaseUtil'
import { ResponseError } from '../error/responseError'

export class FoodLogController {
    static async getFoodLogsByUserAndDateRange(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const user = req.user
            if (!user) return next(new ResponseError(401, "Unauthorized"))

            const userId = Number(req.params.userId);
            if (user.id !== userId) return next(new ResponseError(403, "Forbidden"))

            const startDate = req.query.startDate as string;
            const endDate = req.query.endDate as string;

            const response = await FoodLogService.getFoodLogsByUserAndDateRange(userId, startDate, endDate);
            res.status(200).json({
                data: response,
            });
        } catch (error) {
            next(error);
        }
    }   
    static async createFoodLog(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const user = req.user
            if (!user) return next(new ResponseError(401, "Unauthorized"))

            const body = req.body as FoodLogCreateUpdateRequest
            body.user_id = user.id

            const response = await FoodLogService.create(body);
            res.status(200).json({
                data: response,
            })
        } catch (error) {
            next(error);
        }
    }

    static async getFoodLog(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const user = req.user
            if (!user) return next(new ResponseError(401, "Unauthorized"))
            const logId = Number(req.params.log_id)
            const existing = await prismaClient.food_Log.findUnique({ where: { log_id: logId } })
            if (!existing) return next(new ResponseError(404, "Food log not found"))
            if (existing.user_id !== user.id) return next(new ResponseError(403, "Forbidden"))
            const response = await FoodLogService.getById(logId);
            res.status(200).json({
                data: response,
            });
        } catch (error) {
            next(error);
        }
    }

    static async updateFoodLog(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const user = req.user
            if (!user) return next(new ResponseError(401, "Unauthorized"))

            const logId = Number(req.params.log_id)
            const existing = await prismaClient.food_Log.findUnique({ where: { log_id: logId } })
            if (!existing) return next(new ResponseError(404, "Food log not found"))
            if (existing.user_id !== user.id) return next(new ResponseError(403, "Forbidden"))

            const payload = req.body as Partial<Pick<FoodLogCreateUpdateRequest, "timestamp" | "latitude" | "longitude">>
            const response = await FoodLogService.update(logId, payload);
            res.status(200).json({
                data: response,
            })
        } catch (error) {
            next(error);
        }
    }

    static async deleteFoodLog(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const user = req.user
            if (!user) return next(new ResponseError(401, "Unauthorized"))
            const logId = Number(req.params.log_id)
            const existing = await prismaClient.food_Log.findUnique({ where: { log_id: logId } })
            if (!existing) return next(new ResponseError(404, "Food log not found"))
            if (existing.user_id !== user.id) return next(new ResponseError(403, "Forbidden"))
            await prismaClient.food_Log.delete({ where: { log_id: logId } })
            res.status(200).json({
                message: "Food log deleted successfully",
            })
        } catch (error) {
            next(error);
        }
    }

    static async getFoodLogsByUser(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const user = req.user
            if (!user) return next(new ResponseError(401, "Unauthorized"))
            
            // Use the authenticated user's ID from the token
            const userId = user.id;
            const requestedUserId = Number(req.params.user_id);
            
            // Optional: Still allow checking if they match (for security)
            if (requestedUserId && userId !== requestedUserId) {
                return next(new ResponseError(403, "Forbidden"))
            }
            
            const response = await FoodLogService.getByUserId(userId);
            res.status(200).json({
                data: response,
            });
        }
        catch (error) {
            next(error);
        }
    }
}