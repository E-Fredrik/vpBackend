import { z, ZodType } from "zod";

export class ActivityLogValidation {
    static readonly CREATE: ZodType = z.object({
        user_id: z.number().int().positive(),
        activityType: z.string().min(1).max(100),
        startTime: z.number().int().positive(), // Unix timestamp in milliseconds
        endTime: z.number().int().positive(),
        confidence: z.number().int().min(0).max(100),
    });

    static readonly UPDATE: ZodType = z.object({
        activityType: z.string().min(1).max(100).optional(),
        startTime: z.number().int().positive().optional(),
        endTime: z.number().int().positive().optional(),
        confidence: z.number().int().min(0).max(100).optional(),
    });
}
