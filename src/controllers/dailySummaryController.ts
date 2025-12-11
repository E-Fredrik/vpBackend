import { Request, Response, NextFunction } from "express";
import { DailySummaryService } from "../services/dailySummaryService";

export class DailySummaryController {
    static async create(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await DailySummaryService.create(req.body);
            res.status(201).json({ success: true, data: result });
        } catch (error) {
            next(error);
        }
    }

    static async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const summaryId = parseInt(req.params.id);
            const result = await DailySummaryService.getById(summaryId);
            res.status(200).json({ success: true, data: result });
        } catch (error) {
            next(error);
        }
    }

    static async getByUserId(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = parseInt(req.params.userId);
            const result = await DailySummaryService.getByUserId(userId);
            res.status(200).json({ success: true, data: result });
        } catch (error) {
            next(error);
        }
    }

    static async getByUserIdAndDate(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = parseInt(req.params.userId);
            const date = new Date(req.params.date);
            const result = await DailySummaryService.getByUserIdAndDate(userId, date);
            res.status(200).json({ success: true, data: result });
        } catch (error) {
            next(error);
        }
    }

    static async update(req: Request, res: Response, next: NextFunction) {
        try {
            const summaryId = parseInt(req.params.id);
            const result = await DailySummaryService.update(summaryId, req.body);
            res.status(200).json({ success: true, data: result });
        } catch (error) {
            next(error);
        }
    }

    static async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const summaryId = parseInt(req.params.id);
            await DailySummaryService.delete(summaryId);
            res.status(200).json({ success: true, message: "Daily summary deleted" });
        } catch (error) {
            next(error);
        }
    }
}
