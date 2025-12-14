import { Request, Response, NextFunction } from "express";
import { ZodError, ZodIssue } from "zod";
import { ResponseError } from "../error/responseError";

export const errorMiddleware = (
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.error(error);
    if (error instanceof ZodError) {
        res.status(400).json({
            success: false,
            errors: error.issues.map((e: ZodIssue) => ({
                field: e.path.join("."),
                message: e.message,
            })),
        });
    } else if (error instanceof ResponseError) {
        res.status(error.status).json({
            success: false,
            errors: error.message,
        });
    } else {
        res.status(500).json({
            success: false,
            errors: error.message || "Internal Server Error",
        });
    }
};
