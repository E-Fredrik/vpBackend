import { z, ZodType } from "zod";

export class FoodInLogValidation {
    static readonly CREATE: ZodType = z.object({
        log_id: z.number().int().positive(),
        food_id: z.number().int().positive(),
        quantity: z.number().int().positive().optional(),
        calories: z.number().int().nonnegative().optional(),
    });

    static readonly UPDATE: ZodType = z.object({
        quantity: z.number().int().positive().optional(),
        calories: z.number().int().nonnegative().optional(),
    });
}
