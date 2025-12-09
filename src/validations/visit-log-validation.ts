import { z } from "zod";

export class VisitLogValidation {
  static readonly CREATE = z.object({
    user_id: z.number().int().positive(),
    place_id: z.number().int().positive(),
    entryTime: z.bigint(),
    exitTime: z.bigint(),
    durationMins: z.number().int().nonnegative()
  }).refine(data => data.exitTime > data.entryTime, {
    message: "exitTime must be after entryTime"
  });

  static readonly UPDATE = z.object({
    entryTime: z.bigint().optional(),
    exitTime: z.bigint().optional(),
    durationMins: z.number().int().nonnegative().optional()
  }).partial();

  static readonly QUERY = z.object({
    user_id: z.string().transform(val => parseInt(val, 10)).optional(),
    place_id: z.string().transform(val => parseInt(val, 10)).optional(),
    startTime: z.string().transform(val => BigInt(val)).optional(),
    endTime: z.string().transform(val => BigInt(val)).optional()
  });
}
