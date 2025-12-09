import { Request, Response, NextFunction } from "express";
import { VisitLogService } from "../services/visit-log-service";

export class VisitLogController {
  static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const log = await VisitLogService.create(req.body);
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
      const logs = await VisitLogService.getAll();
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
      const log = await VisitLogService.getById(id);
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
      const logs = await VisitLogService.getByUser(userId, req.query);
      res.status(200).json({
        success: true,
        data: logs
      });
    } catch (error) {
      next(error);
    }
  }

  static async getByPlace(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const placeId = parseInt(req.params.placeId, 10);
      const logs = await VisitLogService.getByPlace(placeId);
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
      const log = await VisitLogService.update(id, req.body);
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
      await VisitLogService.delete(id);
      res.status(200).json({
        success: true,
        message: "Visit log deleted successfully"
      });
    } catch (error) {
      next(error);
    }
  }
}
