import { Request, Response, NextFunction } from "express";
import { FriendService } from "../services/friendService";
import { UserRequest } from "../models/userRequestModel";
import { toFriendResponse } from "../models/friendModel";

export class FriendController {
    static async create(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await FriendService.create(req.body);
            res.status(201).json({ success: true, data: result });
        } catch (error) {
            next(error);
        }
    }

    static async dumpFriendData(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const user = req.user;
            if (!user) {
                return res.status(401).json({ success: false, message: "Unauthorized" });
            }

            const friendships = await FriendService.getByUserId(user.id);
            const friends = friendships.map((f: any) => toFriendResponse(f));

            const result = {
                userId: user.id,
                username: user.username,
                email: user.email,
                friends,
                metadata: {
                    totalFriends: friends.length,
                    exportedAt: new Date().toISOString(),
                },
            };

            res.status(200).json({ success: true, data: result });
        } catch (error) {
            next(error);
        }
    }

    static async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const friendId = parseInt(req.params.id);
            const result = await FriendService.getById(friendId);
            res.status(200).json({ success: true, data: result });
        } catch (error) {
            next(error);
        }
    }

    static async getByUserId(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = parseInt(req.params.userId);
            const result = await FriendService.getByUserId(userId);
            res.status(200).json({ success: true, data: result });
        } catch (error) {
            next(error);
        }
    }

    static async updateStatus(req: Request, res: Response, next: NextFunction) {
        try {
            const friendId = parseInt(req.params.id);
            const result = await FriendService.updateStatus(friendId, req.body);
            res.status(200).json({ success: true, data: result });
        } catch (error) {
            next(error);
        }
    }

    static async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const friendId = parseInt(req.params.id);
            await FriendService.delete(friendId);
            res.status(200).json({ success: true, message: "Friendship deleted" });
        } catch (error) {
            next(error);
        }
    }
}
