import { Request, Response, NextFunction } from "express";
import { PlaceService } from "../services/placeService";

export class PlaceController {
    static async create(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await PlaceService.create(req.body);
            res.status(201).json({ success: true, data: result });
        } catch (error) {
            next(error);
        }
    }

    static async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const placeId = parseInt(req.params.id);
            const result = await PlaceService.getById(placeId);
            res.status(200).json({ success: true, data: result });
        } catch (error) {
            next(error);
        }
    }

    static async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await PlaceService.getAll();
            res.status(200).json({ success: true, data: result });
        } catch (error) {
            next(error);
        }
    }

    static async getByCategory(req: Request, res: Response, next: NextFunction) {
        try {
            const category = req.params.category;
            const result = await PlaceService.getByCategory(category);
            res.status(200).json({ success: true, data: result });
        } catch (error) {
            next(error);
        }
    }

    static async getNearby(req: Request, res: Response, next: NextFunction) {
        try {
            const latitude = parseFloat(req.query.latitude as string);
            const longitude = parseFloat(req.query.longitude as string);
            const radiusKm = parseFloat(req.query.radius as string) || 5;
            const result = await PlaceService.getNearby(latitude, longitude, radiusKm);
            res.status(200).json({ success: true, data: result });
        } catch (error) {
            next(error);
        }
    }

    static async update(req: Request, res: Response, next: NextFunction) {
        try {
            const placeId = parseInt(req.params.id);
            const result = await PlaceService.update(placeId, req.body);
            res.status(200).json({ success: true, data: result });
        } catch (error) {
            next(error);
        }
    }

    static async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const placeId = parseInt(req.params.id);
            await PlaceService.delete(placeId);
            res.status(200).json({ success: true, message: "Place deleted" });
        } catch (error) {
            next(error);
        }
    }
}
