import { z } from "zod";
import { Gender, HealthCondition } from "../models/userModel";

export class UserValidation {
  static readonly CREATE = z.object({
    name: z.string().min(1).max(255).optional(),
    bmiGoal: z.number().positive().optional(),
    height: z.number().int().positive().optional(),
    healthCondition: z.nativeEnum(HealthCondition).optional(),
    weight: z.number().positive().optional(),
    email: z.string().email().optional(),
    birthDate: z.coerce.date().optional(),
    gender: z.nativeEnum(Gender).optional()
  });

  static readonly UPDATE = z.object({
    name: z.string().min(1).max(255).optional(),
    bmiGoal: z.number().positive().optional(),
    height: z.number().int().positive().optional(),
    healthCondition: z.nativeEnum(HealthCondition).optional(),
    weight: z.number().positive().optional(),
    email: z.string().email().optional(),
    birthDate: z.coerce.date().optional(),
    gender: z.nativeEnum(Gender).optional()
  }).partial();

  static readonly GET_BY_ID = z.object({
    id: z.string().transform(val => parseInt(val, 10))
  });
}
