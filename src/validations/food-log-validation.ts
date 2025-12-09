import { z } from "zod";

export class FoodLogValidation {
  static readonly CREATE = z.object({
    user_id: z.number().int().positive(),
    foodName: z.string().min(1).max(255),
    calories: z.number().int().nonnegative(),
    timestamp: z.bigint(),
    latitude: z.number().min(-90).max(90).optional(),
    longitude: z.number().min(-180).max(180).optional()
  });

  static readonly UPDATE = z.object({
    foodName: z.string().min(1).max(255).optional(),
    calories: z.number().int().nonnegative().optional(),
    timestamp: z.bigint().optional(),
    latitude: z.number().min(-90).max(90).optional(),
    longitude: z.number().min(-180).max(180).optional()
  }).partial();

  static readonly QUERY = z.object({
    user_id: z.string().transform(val => parseInt(val, 10)).optional(),
    startTime: z.string().transform(val => BigInt(val)).optional(),
    endTime: z.string().transform(val => BigInt(val)).optional(),
    minCalories: z.string().transform(val => parseInt(val, 10)).optional(),
    maxCalories: z.string().transform(val => parseInt(val, 10)).optional()
  });
}
