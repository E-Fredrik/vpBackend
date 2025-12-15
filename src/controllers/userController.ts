import { Request, Response, NextFunction } from 'express';
import {
    LoginUserRequest,
    RegisterUserRequest,
    UserDataDump,
    UserResponse
} from '../models/userModel'
import { UserService } from '../services/userService';
import { UserRequest } from '../models/userRequestModel';
import { ResponseError } from '../error/responseError';

console.log("🧭 UserController module loaded");

export class UserController {
    static async register(req: Request, res: Response, next: NextFunction) {
        try {
            const request: RegisterUserRequest = req.body as RegisterUserRequest;
            const response: UserResponse = await UserService.register(request);

            res.status(200).json({
                data: response,
            })
        } catch (error) {
            next(error)
        }
    }

    static async login(req: Request, res: Response, next: NextFunction) {
        try {
            const request: LoginUserRequest = req.body as LoginUserRequest;
            const response: UserResponse = await UserService.login(request);
            res.status(200).json({
                data: response,
            })
        } catch (error) {
            next(error)
        }
    }

    static async dumpUserData(req: Request, res: Response, next: NextFunction) {
        try {
            console.log("dumpUserData called, body:", req.body);
            const request: LoginUserRequest = req.body as LoginUserRequest;
            
            // Default to last 3 days instead of all data
            const days = req.query.days ? parseInt(req.query.days as string) : 3;
            
            const response: UserDataDump = await UserService.dumpUserData(request, { days });
            res.status(200).json({
                data: response,
            })
        }
        catch (error) {
            next(error)
        }
    }

    static async getProfile(req: UserRequest, res: Response, next: NextFunction) {
        try {
            if (!req.user) {
                throw new ResponseError(401, "Unauthorized!")
            }

            const response = await UserService.getProfile(req.user.id)
            
            res.status(200).json({
                data: response,
            })
        } catch (error) {
            next(error)
        }
    }

    static async getNotificationSettings(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.id
            if (!userId) {
                throw new ResponseError(401, "Unauthorized")
            }
            
            const user = await UserService.getNotificationSettings(userId)
            
            res.status(200).json({
                success: true,
                data: user
            })
        } catch (error) {
            next(error)
        }
    }
    
    static async updateNotificationSettings(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.id
            if (!userId) {
                throw new ResponseError(401, "Unauthorized")
            }
            
            const { 
                notificationEnabled, 
                breakfastTime, 
                lunchTime, 
                dinnerTime,
                snackTime 
            } = req.body
            
            const updated = await UserService.updateNotificationSettings(userId, {
                notificationEnabled,
                breakfastTime,
                lunchTime,
                dinnerTime,
                snackTime
            })
            
            res.status(200).json({
                success: true,
                data: updated
            })
        } catch (error) {
            next(error)
        }
    }
}