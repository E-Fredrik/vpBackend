import { Request, Response, NextFunction } from "express";
import { VisitLogService } from "../services/visitLogService";

export class VisitLogController {
    static async create(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await VisitLogService.create(req.body);
            res.status(201).json({ success: true, data: result });
        } catch (error) {
            next(error);
        }
    }

    static async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const visitId = parseInt(req.params.id);
            const result = await VisitLogService.getById(visitId);
            res.status(200).json({ success: true, data: result });
        } catch (error) {
            next(error);
        }
    }

    static async getByUserId(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = parseInt(req.params.userId);
            const result = await VisitLogService.getByUserId(userId);
            res.status(200).json({ success: true, data: result });
        } catch (error) {
            next(error);
        }
    }

    static async getByPlaceId(req: Request, res: Response, next: NextFunction) {
        try {
            const placeId = parseInt(req.params.placeId);
            const result = await VisitLogService.getByPlaceId(placeId);
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
            const result = await VisitLogService.getByUserIdAndDateRange(
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
            const visitId = parseInt(req.params.id);
            const result = await VisitLogService.update(visitId, req.body);
            res.status(200).json({ success: true, data: result });
        } catch (error) {
            next(error);
        }
    }

    static async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const visitId = parseInt(req.params.id);
            await VisitLogService.delete(visitId);
            res.status(200).json({ success: true, message: "Visit log deleted" });
        } catch (error) {
            next(error);
        }
    }
}
