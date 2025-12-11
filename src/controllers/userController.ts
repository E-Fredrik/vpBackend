import { Request, Response, NextFunction } from 'express';
import {
    LoginUserRequest,
    RegisterUserRequest,
    UserDataDump,
    UserResponse
} from '../models/userModel'
import { UserService } from '../services/userService';

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
}