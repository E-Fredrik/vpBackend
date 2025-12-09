import { Request, Response, NextFunction } from "express";
import { FoodLogService } from "../services/food-log-service";

export class FoodLogController {
  static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const log = await FoodLogService.create(req.body);
      res.status(201).json({
        success: true,
        data: log
      });
    } catch (error) {
      next(error);
    }
  }

  static async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const logs = await FoodLogService.getAll();
      res.status(200).json({
        success: true,
        data: logs
      });
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      const log = await FoodLogService.getById(id);
      res.status(200).json({
        success: true,
        data: log
      });
    } catch (error) {
      next(error);
    }
  }

  static async getByUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = parseInt(req.params.userId, 10);
      const logs = await FoodLogService.getByUser(userId, req.query);
      res.status(200).json({
        success: true,
        data: logs
      });
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      const log = await FoodLogService.update(id, req.body);
      res.status(200).json({
        success: true,
        data: log
      });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      await FoodLogService.delete(id);
      res.status(200).json({
        success: true,
        message: "Food log deleted successfully"
      });
    } catch (error) {
      next(error);
    }
  }
}
