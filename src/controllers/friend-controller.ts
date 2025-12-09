import { Request, Response, NextFunction } from "express";
import { FriendService } from "../services/friend-service";

export class FriendController {
  static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const friend = await FriendService.create(req.body);
      res.status(201).json({
        success: true,
        data: friend
      });
    } catch (error) {
      next(error);
    }
  }

  static async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const friends = await FriendService.getAll();
      res.status(200).json({
        success: true,
        data: friends
      });
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      const friend = await FriendService.getById(id);
      res.status(200).json({
        success: true,
        data: friend
      });
    } catch (error) {
      next(error);
    }
  }

  static async getByUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = parseInt(req.params.userId, 10);
      const friends = await FriendService.getByUser(userId);
      res.status(200).json({
        success: true,
        data: friends
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      const friend = await FriendService.updateStatus(id, req.body);
      res.status(200).json({
        success: true,
        data: friend
      });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      await FriendService.delete(id);
      res.status(200).json({
        success: true,
        message: "Friend deleted successfully"
      });
    } catch (error) {
      next(error);
    }
  }
}
