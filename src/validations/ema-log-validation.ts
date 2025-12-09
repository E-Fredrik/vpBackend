import { z } from "zod";

export class EMALogValidation {
  static readonly CREATE = z.object({
    user_id: z.number().int().positive(),
    timestamp: z.bigint(),
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
    geofenceRadius: z.number().int().positive()
  });

  static readonly UPDATE = z.object({
    timestamp: z.bigint().optional(),
    latitude: z.number().min(-90).max(90).optional(),
    longitude: z.number().min(-180).max(180).optional(),
    geofenceRadius: z.number().int().positive().optional()
  }).partial();

  static readonly QUERY = z.object({
    user_id: z.string().transform(val => parseInt(val, 10)).optional(),
    startTime: z.string().transform(val => BigInt(val)).optional(),
    endTime: z.string().transform(val => BigInt(val)).optional()
  });
}
