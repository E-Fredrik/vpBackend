import { prismaClient } from "../utils/database-util";
import { CreateFoodLogInput, UpdateFoodLogInput, FoodLog, FoodLogQueryParams } from "../models/foodLogModel";
import { NotFoundError } from "../error/response-error";
import { FoodLogValidation } from "../validations/food-log-validation";

export class FoodLogService {
  static async create(data: CreateFoodLogInput): Promise<FoodLog> {
    const validatedData = FoodLogValidation.CREATE.parse(data);
    
    return await prismaClient.food_Log.create({
      data: validatedData
    });
  }

  static async getAll(): Promise<FoodLog[]> {
    return await prismaClient.food_Log.findMany({
      orderBy: { timestamp: 'desc' }
    });
  }

  static async getById(id: number): Promise<FoodLog> {
    const log = await prismaClient.food_Log.findUnique({
      where: { log_id: id }
    });

    if (!log) {
      throw new NotFoundError("Food log");
    }

    return log;
  }

  static async getByUser(userId: number, query?: FoodLogQueryParams): Promise<FoodLog[]> {
    return await prismaClient.food_Log.findMany({
      where: {
        user_id: userId,
        timestamp: {
          gte: query?.startTime,
          lte: query?.endTime
        },
        calories: {
          gte: query?.minCalories,
          lte: query?.maxCalories
        }
      },
      orderBy: { timestamp: 'desc' }
    });
  }

  static async update(id: number, data: Omit<UpdateFoodLogInput, 'log_id'>): Promise<FoodLog> {
    const validatedData = FoodLogValidation.UPDATE.parse(data);
    
    await this.getById(id); // Check if exists

    return await prismaClient.food_Log.update({
      where: { log_id: id },
      data: validatedData
    });
  }

  static async delete(id: number): Promise<void> {
    await this.getById(id); // Check if exists
    
    await prismaClient.food_Log.delete({
      where: { log_id: id }
    });
  }
}
