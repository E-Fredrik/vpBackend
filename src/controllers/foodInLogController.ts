import { Request, Response, NextFunction } from "express";
import { FoodInLogService } from "../services/foodInLogService";

export class FoodInLogController {
    static async create(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await FoodInLogService.create(req.body);
            res.status(201).json({ success: true, data: result });
        } catch (error) {
            next(error);
        }
    }

    static async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id);
            const result = await FoodInLogService.getById(id);
            res.status(200).json({ success: true, data: result });
        } catch (error) {
            next(error);
        }
    }

    static async getByLogId(req: Request, res: Response, next: NextFunction) {
        try {
            const logId = parseInt(req.params.logId);
            const result = await FoodInLogService.getByLogId(logId);
            res.status(200).json({ success: true, data: result });
        } catch (error) {
            next(error);
        }
    }

    static async update(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id);
            const result = await FoodInLogService.update(id, req.body);
            res.status(200).json({ success: true, data: result });
        } catch (error) {
            next(error);
        }
    }

    static async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id);
            await FoodInLogService.delete(id);
            res.status(200).json({ success: true, message: "Food in log entry deleted" });
        } catch (error) {
            next(error);
        }
    }
}
