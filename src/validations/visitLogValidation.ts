import { z, ZodType } from "zod";

export class VisitLogValidation {
    static readonly CREATE: ZodType = z.object({
        user_id: z.number().int().positive(),
        place_id: z.number().int().positive(),
        entryTime: z.number().int().positive(), // Unix timestamp in milliseconds
        exitTime: z.number().int().positive(),
        durationMins: z.number().int().nonnegative(),
    });

    static readonly UPDATE: ZodType = z.object({
        entryTime: z.number().int().positive().optional(),
        exitTime: z.number().int().positive().optional(),
        durationMins: z.number().int().nonnegative().optional(),
    });
}
