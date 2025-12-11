import { z, ZodType } from "zod";

export class PlaceValidation {
    static readonly CREATE: ZodType = z.object({
        name: z.string().min(1).max(255),
        category: z.enum(["RESTAURANT", "PARK", "GYM", "STORE", "OTHER"]),
        latitude: z.number().min(-90).max(90),
        longitude: z.number().min(-180).max(180),
        geofenceRadius: z.number().int().positive(),
    });

    static readonly UPDATE: ZodType = z.object({
        name: z.string().min(1).max(255).optional(),
        category: z.enum(["RESTAURANT", "PARK", "GYM", "STORE", "OTHER"]).optional(),
        latitude: z.number().min(-90).max(90).optional(),
        longitude: z.number().min(-180).max(180).optional(),
        geofenceRadius: z.number().int().positive().optional(),
    });
}
