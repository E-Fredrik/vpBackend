import { Request, Response, NextFunction } from "express";
import { FoodLogService } from "../services/foodLogService";

export class FoodLogController {
    static async create(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await FoodLogService.create(req.body);
            res.status(201).json({ success: true, data: result });
        } catch (error) {
            next(error);
        }
    }

    static async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const logId = parseInt(req.params.id);
            const result = await FoodLogService.getById(logId);
            res.status(200).json({ success: true, data: result });
        } catch (error) {
            next(error);
        }
    }

    static async getByUserId(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = parseInt(req.params.userId);
            const result = await FoodLogService.getByUserId(userId);
            res.status(200).json({ success: true, data: result });
        } catch (error) {
            next(error);
        }
    }

    static async getByUserIdAndDateRange(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = parseInt(req.params.userId);
            const startTimestamp = parseInt(req.query.start as string);
            const endTimestamp = parseInt(req.query.end as string);
            const result = await FoodLogService.getByUserIdAndDateRange(
                userId,
                startTimestamp,
                endTimestamp
            );
            res.status(200).json({ success: true, data: result });
        } catch (error) {
            next(error);
        }
    }

    static async update(req: Request, res: Response, next: NextFunction) {
        try {
            const logId = parseInt(req.params.id);
            const result = await FoodLogService.update(logId, req.body);
            res.status(200).json({ success: true, data: result });
        } catch (error) {
            next(error);
        }
    }

    static async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const logId = parseInt(req.params.id);
            await FoodLogService.delete(logId);
            res.status(200).json({ success: true, message: "Food log deleted" });
        } catch (error) {
            next(error);
        }
    }
}
