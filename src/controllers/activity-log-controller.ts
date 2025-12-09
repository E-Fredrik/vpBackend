import { Request, Response, NextFunction } from "express";
import { ActivityLogService } from "../services/activity-log-service";

export class ActivityLogController {
  static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const log = await ActivityLogService.create(req.body);
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
      const logs = await ActivityLogService.getAll();
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
      const log = await ActivityLogService.getById(id);
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
      const logs = await ActivityLogService.getByUser(userId, req.query);
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
      const log = await ActivityLogService.update(id, req.body);
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
      await ActivityLogService.delete(id);
      res.status(200).json({
        success: true,
        message: "Activity log deleted successfully"
      });
    } catch (error) {
      next(error);
    }
  }
}
