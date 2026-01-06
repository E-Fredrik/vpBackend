import { z, ZodType } from "zod";

export class DailySummaryValidation {
    static readonly CREATE: ZodType = z.object({
        user_id: z.number().int().positive(),
        date: z.coerce.date(),
        totalCaloriesIn: z.number().int().nonnegative(),
    });

    static readonly UPDATE: ZodType = z.object({
        date: z.coerce.date().optional(),
        totalCaloriesIn: z.number().int().nonnegative().optional(),
    });
}
