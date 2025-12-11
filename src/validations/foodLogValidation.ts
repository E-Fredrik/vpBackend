import { z, ZodType } from "zod";

export class FoodLogValidation {
    static readonly CREATE: ZodType = z.object({
        user_id: z.number().int().positive(),
        timestamp: z.number().int().positive(), // Unix timestamp in milliseconds
        latitude: z.number().min(-90).max(90).optional(),
        longitude: z.number().min(-180).max(180).optional(),
        foods: z
            .array(
                z.object({
                    food_id: z.number().int().positive(),
                    quantity: z.number().int().positive().optional(),
                    calories: z.number().int().nonnegative().optional(),
                })
            )
            .optional(),
    });

    static readonly UPDATE: ZodType = z.object({
        timestamp: z.number().int().positive().optional(),
        latitude: z.number().min(-90).max(90).optional(),
        longitude: z.number().min(-180).max(180).optional(),
    });
}
