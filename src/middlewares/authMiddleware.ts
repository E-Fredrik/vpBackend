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
        const raw = req.headers["authorization"]
        const authHeader = Array.isArray(raw) ? raw[0] : raw
        const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : authHeader?.split(" ")[1]

        if (!token) {
            return next(new ResponseError(401, "Unauthorized user!"))
        }

        let payload
        try {
            payload = verifyToken(token)
        } catch (err) {
            return next(new ResponseError(401, "Unauthorized user!"))
        }

        req.user = payload
        return next()
    } catch (error) {
        return next(error)
    }
}