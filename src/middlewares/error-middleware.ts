import { Request, Response, NextFunction } from "express";
import { ResponseError } from "../error/response-error";
import { ZodError } from "zod";
import { Prisma } from "../../generated/prisma";

export const errorMiddleware = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Zod validation errors
  if (error instanceof ZodError) {
    res.status(400).json({
      success: false,
      errors: error.issues.map((err: any) => ({
        path: err.path.join('.'),
        message: err.message
      }))
    });
    return;
  }

  // Custom ResponseError
  if (error instanceof ResponseError) {
    res.status(error.status).json({
      success: false,
      errors: error.message
    });
    return;
  }

  // Prisma errors
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        res.status(409).json({
          success: false,
          errors: `Unique constraint failed on field: ${error.meta?.target}`
        });
        return;
      case 'P2025':
        res.status(404).json({
          success: false,
          errors: 'Record not found'
        });
        return;
      case 'P2003':
        res.status(400).json({
          success: false,
          errors: 'Foreign key constraint failed'
        });
        return;
      default:
        res.status(400).json({
          success: false,
          errors: 'Database operation failed'
        });
        return;
    }
  }

  // Default server error
  console.error('Unhandled error:', error);
  res.status(500).json({
    success: false,
    errors: 'Internal server error'
  });
};
