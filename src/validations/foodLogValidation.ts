import { z, ZodType } from "zod"

export class FoodLogValidation {
    static readonly FOOD_ITEM = z.object({
        food_id: z.number().int().positive(),
        quantity: z.number().int().positive(),
        calories: z.number().min(0),
    })

    static readonly CREATE: ZodType = z.object({
        user_id: z.number().int().positive(),
        timestamp: z.number().int().positive(),
        latitude: z.number().optional(),
        longitude: z.number().optional(),
        foods: z.array(FoodLogValidation.FOOD_ITEM).min(1, { message: "At least one food is required" }),
    })

    static readonly UPDATE: ZodType = z.object({
        timestamp: z.number().int().positive().optional(),
        latitude: z.number().optional(),
        longitude: z.number().optional(),
    })  
}