import { Request, Response, NextFunction } from "express";
import { NotificationService } from "../services/notificationService";
import { ResponseError } from "../error/responseError";

export class NotificationController {
    static async checkLocationTriggers(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = parseInt(req.params.userId);
            const latitude = parseFloat(req.query.latitude as string);
            const longitude = parseFloat(req.query.longitude as string);
            
            if (isNaN(userId) || userId <= 0) {
                throw new ResponseError(400, "Invalid user ID");
            }
            
            if (isNaN(latitude) || latitude < -90 || latitude > 90) {
                throw new ResponseError(400, "Invalid latitude (must be between -90 and 90)");
            }
            
            if (isNaN(longitude) || longitude < -180 || longitude > 180) {
                throw new ResponseError(400, "Invalid longitude (must be between -180 and 180)");
            }
            
            const triggers = await NotificationService.checkLocationTriggers({
                userId,
                latitude,
                longitude
            });
            
            res.status(200).json({ 
                success: true, 
                data: {
                    triggers,
                    metadata: {
                        count: triggers.length,
                        shouldNotify: triggers.length > 0,
                        userLocation: { latitude, longitude },
                        timestamp: Date.now()
                    }
                }
            });
        } catch (error) {
            next(error);
        }
    }

    static async getHistory(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = parseInt(req.params.userId);
            const limit = parseInt(req.query.limit as string) || 10;
            
            if (isNaN(userId) || userId <= 0) {
                throw new ResponseError(400, "Invalid user ID");
            }
            
            if (limit < 1 || limit > 100) {
                throw new ResponseError(400, "Limit must be between 1 and 100");
            }
            
            const history = await NotificationService.getNotificationHistory(userId, limit);
            
            res.status(200).json({
                success: true,
                data: history
            });
        } catch (error) {
            next(error);
        }
    }
}
