import { Request, Response, NextFunction } from "express";
import { EMALogService } from "../services/ema-log-service";

export class EMALogController {
  static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const log = await EMALogService.create(req.body);
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
      const logs = await EMALogService.getAll();
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
      const log = await EMALogService.getById(id);
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
      const logs = await EMALogService.getByUser(userId, req.query);
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
      const log = await EMALogService.update(id, req.body);
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
      await EMALogService.delete(id);
      res.status(200).json({
        success: true,
        message: "EMA log deleted successfully"
      });
    } catch (error) {
      next(error);
    }
  }
}
