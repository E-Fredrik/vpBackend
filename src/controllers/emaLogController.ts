import { Request, Response, NextFunction } from "express";
import { EmaLogService } from "../services/emaLogService";

export class EmaLogController {
    static async create(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await EmaLogService.create(req.body);
            res.status(201).json({ success: true, data: result });
        } catch (error) {
            next(error);
        }
    }

    static async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const emaId = parseInt(req.params.id);
            const result = await EmaLogService.getById(emaId);
            res.status(200).json({ success: true, data: result });
        } catch (error) {
            next(error);
        }
    }

    static async getByUserId(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = parseInt(req.params.userId);
            const result = await EmaLogService.getByUserId(userId);
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
            const result = await EmaLogService.getByUserIdAndDateRange(
                userId,
                startTimestamp,
                endTimestamp
            );
            res.status(200).json({ success: true, data: result });
        } catch (error) {
            next(error);
        }
    }

    static async getByUserIdAndLocation(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = parseInt(req.params.userId);
            const latitude = parseFloat(req.query.latitude as string);
            const longitude = parseFloat(req.query.longitude as string);
            const radiusKm = parseFloat(req.query.radius as string) || 5;
            const result = await EmaLogService.getByUserIdAndLocation(
                userId,
                latitude,
                longitude,
                radiusKm
            );
            res.status(200).json({ success: true, data: result });
        } catch (error) {
            next(error);
        }
    }

    static async update(req: Request, res: Response, next: NextFunction) {
        try {
            const emaId = parseInt(req.params.id);
            const result = await EmaLogService.update(emaId, req.body);
            res.status(200).json({ success: true, data: result });
        } catch (error) {
            next(error);
        }
    }

    static async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const emaId = parseInt(req.params.id);
            await EmaLogService.delete(emaId);
            res.status(200).json({ success: true, message: "EMA log deleted" });
        } catch (error) {
            next(error);
        }
    }
}
