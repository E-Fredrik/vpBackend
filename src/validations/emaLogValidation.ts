import { z, ZodType } from "zod";

export class EmaLogValidation {
    static readonly CREATE: ZodType = z.object({
        user_id: z.number().int().positive(),
        moodScore: z.number().int().min(1).max(10),
        context: z.string().max(500).optional(),
        timestamp: z.number().int().positive(), // Unix timestamp in milliseconds
        latitude: z.number().min(-90).max(90).optional(),
        longitude: z.number().min(-180).max(180).optional(),
        geofenceRadius: z.number().int().positive().optional(),
    });

    static readonly UPDATE: ZodType = z.object({
        moodScore: z.number().int().min(1).max(10).optional(),
        context: z.string().max(500).optional(),
        timestamp: z.number().int().positive().optional(),
        latitude: z.number().min(-90).max(90).optional(),
        longitude: z.number().min(-180).max(180).optional(),
        geofenceRadius: z.number().int().positive().optional(),
    });
}
