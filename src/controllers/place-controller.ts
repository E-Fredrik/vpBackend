import { Request, Response, NextFunction } from "express";
import { PlaceService } from "../services/place-service";

export class PlaceController {
  static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const place = await PlaceService.create(req.body);
      res.status(201).json({
        success: true,
        data: place
      });
    } catch (error) {
      next(error);
    }
  }

  static async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const places = await PlaceService.getAll();
      res.status(200).json({
        success: true,
        data: places
      });
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      const place = await PlaceService.getById(id);
      res.status(200).json({
        success: true,
        data: place
      });
    } catch (error) {
      next(error);
    }
  }

  static async getByCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const category = req.params.category;
      const places = await PlaceService.getByCategory(category);
      res.status(200).json({
        success: true,
        data: places
      });
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      const place = await PlaceService.update(id, req.body);
      res.status(200).json({
        success: true,
        data: place
      });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      await PlaceService.delete(id);
      res.status(200).json({
        success: true,
        message: "Place deleted successfully"
      });
    } catch (error) {
      next(error);
    }
  }
}
