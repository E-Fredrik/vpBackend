import { z } from "zod";

export class ActivityLogValidation {
  static readonly CREATE = z.object({
    user_id: z.number().int().positive(),
    activityType: z.string().min(1).max(100),
    startTime: z.bigint(),
    endTime: z.bigint(),
    confidence: z.number().int().min(0).max(100)
  }).refine(data => data.endTime > data.startTime, {
    message: "endTime must be after startTime"
  });

  static readonly UPDATE = z.object({
    activityType: z.string().min(1).max(100).optional(),
    startTime: z.bigint().optional(),
    endTime: z.bigint().optional(),
    confidence: z.number().int().min(0).max(100).optional()
  }).partial();

  static readonly QUERY = z.object({
    user_id: z.string().transform(val => parseInt(val, 10)).optional(),
    activityType: z.string().optional(),
    startTime: z.string().transform(val => BigInt(val)).optional(),
    endTime: z.string().transform(val => BigInt(val)).optional()
  });
}
