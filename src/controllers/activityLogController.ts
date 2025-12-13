import { Request, Response, NextFunction } from "express";
import { ActivityLogService } from "../services/activityLogService";
import { ResponseError } from "../error/responseError";

export class ActivityLogController {
    static async create(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await ActivityLogService.create(req.body);
            res.status(201).json({ success: true, data: result });
        } catch (error) {
            next(error);
        }
    }

    static async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const activityId = parseInt(req.params.id);
            const result = await ActivityLogService.getById(activityId);
            res.status(200).json({ success: true, data: result });
        } catch (error) {
            next(error);
        }
    }

    static async getByUserId(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = parseInt(req.params.userId);
            const result = await ActivityLogService.getByUserId(userId);
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
            const result = await ActivityLogService.getByUserIdAndDateRange(
                userId,
                startTimestamp,
                endTimestamp
            );
            res.status(200).json({ success: true, data: result });
        } catch (error) {
            next(error);
        }
    }

    static async getByUserIdAndActivityType(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = parseInt(req.params.userId);
            const activityType = req.params.activityType;
            const result = await ActivityLogService.getByUserIdAndActivityType(userId, activityType);
            res.status(200).json({ success: true, data: result });
        } catch (error) {
            next(error);
        }
    }

    static async update(req: Request, res: Response, next: NextFunction) {
        try {
            const activityId = parseInt(req.params.id);
            const result = await ActivityLogService.update(activityId, req.body);
            res.status(200).json({ success: true, data: result });
        } catch (error) {
            next(error);
        }
    }

    static async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const activityId = parseInt(req.params.id);
            await ActivityLogService.delete(activityId);
            res.status(200).json({ success: true, message: "Activity log deleted" });
        } catch (error) {
            next(error);
        }
    }

    static async bulkCreate(req: Request, res: Response, next: NextFunction) {
        try {
            const activities = req.body.activities as any[];
            if (!Array.isArray(activities)) {
                throw new ResponseError(400, "Request body must contain 'activities' array");
            }
            const result = await ActivityLogService.bulkCreate(activities);
            res.status(201).json({ success: true, data: result });
        } catch (error) {
            next(error);
        }
    }

    static async getCurrentActivity(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = parseInt(req.params.userId);
            const result = await ActivityLogService.getCurrentActivity(userId);
            res.status(200).json({ success: true, data: result });
        } catch (error) {
            next(error);
        }
    }
}
