import { z } from "zod";

export class DailySummaryValidation {
  static readonly CREATE = z.object({
    user_id: z.number().int().positive(),
    date: z.coerce.date(),
    totalCaloriesIn: z.number().int().nonnegative()
  });

  static readonly UPDATE = z.object({
    date: z.coerce.date().optional(),
    totalCaloriesIn: z.number().int().nonnegative().optional()
  }).partial();

  static readonly QUERY = z.object({
    user_id: z.string().transform(val => parseInt(val, 10)).optional(),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional()
  });
}
