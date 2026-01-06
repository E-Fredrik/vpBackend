import { Response, NextFunction } from 'express'
import { UserRequest } from '../models/userRequestModel'
import { DashboardService } from '../services/dashboardService'
import { ResponseError } from '../error/responseError'

export class DashboardController {
    static async getDashboard(req: UserRequest, res: Response, next: NextFunction) {
        try {
            if (!req.user) {
                throw new ResponseError(401, "Unauthorized!")
            }

            const response = await DashboardService.getDashboardData(req.user.id)
            
            res.status(200).json({
                data: response,
            })
        } catch (error) {
            next(error)
        }
    }
}
