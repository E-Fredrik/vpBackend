import { Request, Response, NextFunction } from "express";
import { DailySummaryService } from "../services/daily-summary-service";

export class DailySummaryController {
  static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const summary = await DailySummaryService.create(req.body);
      res.status(201).json({
        success: true,
        data: summary
      });
    } catch (error) {
      next(error);
    }
  }

  static async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const summaries = await DailySummaryService.getAll();
      res.status(200).json({
        success: true,
        data: summaries
      });
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      const summary = await DailySummaryService.getById(id);
      res.status(200).json({
        success: true,
        data: summary
      });
    } catch (error) {
      next(error);
    }
  }

  static async getByUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = parseInt(req.params.userId, 10);
      const summaries = await DailySummaryService.getByUser(userId, req.query);
      res.status(200).json({
        success: true,
        data: summaries
      });
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      const summary = await DailySummaryService.update(id, req.body);
      res.status(200).json({
        success: true,
        data: summary
      });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      await DailySummaryService.delete(id);
      res.status(200).json({
        success: true,
        message: "Daily summary deleted successfully"
      });
    } catch (error) {
      next(error);
    }
  }
}
