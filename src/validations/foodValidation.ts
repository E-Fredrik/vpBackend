import { z, ZodType } from 'zod'

export class FoodValidation {
    static readonly CREATE: ZodType = z.object({
        name: z.string().min(1, { message: "Name is required" }),
        calories: z.number().min(0, { message: "Calories must be a non-negative number" }),
    })

    static readonly UPDATE: ZodType = z.object({
        name: z.string().min(1, { message: "Name is required" }).optional(),
        calories: z.number().min(0, { message: "Calories must be a non-negative number" }).optional(),
    })
}