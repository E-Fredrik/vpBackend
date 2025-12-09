import { z } from "zod";
import { PlaceCategory } from "../models/placeOfInterest";

export class PlaceValidation {
  static readonly CREATE = z.object({
    name: z.string().min(1).max(255),
    category: z.nativeEnum(PlaceCategory),
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
    geofenceRadius: z.number().int().positive()
  });

  static readonly UPDATE = z.object({
    name: z.string().min(1).max(255).optional(),
    category: z.nativeEnum(PlaceCategory).optional(),
    latitude: z.number().min(-90).max(90).optional(),
    longitude: z.number().min(-180).max(180).optional(),
    geofenceRadius: z.number().int().positive().optional()
  }).partial();
}
