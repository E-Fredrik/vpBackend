import { NextFunction, Response } from "express"
import { UserRequest } from "../models/userRequestModel"
import { ResponseError } from "../error/responseError"
import { verifyToken } from "../utils/jwtUtils"

export const authMiddleware = (
    req: UserRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const authHeader = req.headers["authorization"]
        const token = authHeader && authHeader.split(" ")[1]
        
        if (!token) {
            next(new ResponseError(401, "Unauthorized user!"))
        }

        const payload = verifyToken(token!)

        if (payload) {
            req.user = payload
        } else {
            next(new ResponseError(401, "Unauthorized user!"))
        }

        next()
    } catch (error) {
        next(error)
    }
}