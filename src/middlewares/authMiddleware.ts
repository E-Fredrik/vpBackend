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
        
        // Log for debugging
        console.log("Auth Header Received:", authHeader)

        if (!authHeader) {
            console.error("No authorization header provided")
            return next(new ResponseError(401, "No authorization header provided!"))
        }

        const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : authHeader?.split(" ")[1]

        if (!token) {
            console.error("Invalid authorization format. Expected: Bearer <token>")
            return next(new ResponseError(401, "Invalid authorization format! Use: Bearer <token>"))
        }

        let payload
        try {
            payload = verifyToken(token)
            console.log("Token verified successfully for user:", payload.id)
        } catch (err) {
            console.error("Token verification failed:", err)
            return next(new ResponseError(401, "Invalid or expired token!"))
        }

        req.user = payload
        return next()
    } catch (error) {
        console.error("Auth middleware error:", error)
        return next(error)
    }
}