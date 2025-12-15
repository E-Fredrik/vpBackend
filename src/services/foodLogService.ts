import { ResponseError } from "../error/responseError";
import { prismaClient } from "../utils/databaseUtil";
import { Validation } from "../validations/validation";
import { FoodLogValidation } from "../validations/foodLogValidation";

export interface CreateFoodLogRequest {
    user_id: number;
    timestamp: number; // Unix timestamp in milliseconds
    latitude?: number;
    longitude?: number;
    foods?: Array<{
        food_id: number;
        quantity?: number;
        calories?: number;
    }>;
}

export interface UpdateFoodLogRequest {
    timestamp?: number;
    latitude?: number;
    longitude?: number;
}

export class FoodLogService {
    static async getFoodLogsByUserAndDateRange(userId: number, startDate: string, endDate: string) {
        const startTimestamp = Date.parse(startDate);
        const endTimestamp = Date.parse(endDate);

        if (isNaN(startTimestamp) || isNaN(endTimestamp)) {
            throw new ResponseError(400, "Invalid date format");
        }

        return this.getByUserIdAndDateRange(userId, startTimestamp, endTimestamp);
    }
    static async create(request: CreateFoodLogRequest) {
        const validatedData = Validation.validate(FoodLogValidation.CREATE, request);

        const user = await prismaClient.user.findUnique({
            where: { user_id: validatedData.user_id },
        });

        if (!user) {
            throw new ResponseError(404, "User not found");
        }

        // Create food log with associated food items
        const createdLog = await prismaClient.food_Log.create({
            data: {
                user_id: validatedData.user_id,
                timestamp: BigInt(validatedData.timestamp),
                latitude: validatedData.latitude,
                longitude: validatedData.longitude,
                foodInLogs: validatedData.foods
                    ? {
                          create: validatedData.foods.map((f) => ({
                              food_id: f.food_id,
                              quantity: f.quantity,
                              calories: f.calories,
                          })),
                      }
                    : undefined,
            },
            include: {
                foodInLogs: {
                    include: {
                        food: true,
                    },
                },
            },
        });

        return this.serializeFoodLog(createdLog);
    }

    static async getById(logId: number) {
        const log = await prismaClient.food_Log.findUnique({
            where: { log_id: logId },
            include: {
                foodInLogs: {
                    include: {
                        food: true,
                    },
                },
            },
        });

        if (!log) {
            throw new ResponseError(404, "Food log not found");
        }

        return this.serializeFoodLog(log);
    }

    static async getByUserId(userId: number) {
        const logs = await prismaClient.food_Log.findMany({
            where: { user_id: userId },
            include: {
                foodInLogs: {
                    include: {
                        food: true,
                    },
                },
            },
            orderBy: { timestamp: "desc" },
        });

        return logs.map(this.serializeFoodLog);
    }

    static async getByUserIdAndDateRange(
        userId: number,
        startTimestamp: number,
        endTimestamp: number
    ) {
        const logs = await prismaClient.food_Log.findMany({
            where: {
                user_id: userId,
                timestamp: {
                    gte: BigInt(startTimestamp),
                    lte: BigInt(endTimestamp),
                },
            },
            include: {
                foodInLogs: {
                    include: {
                        food: true,
                    },
                },
            },
            orderBy: { timestamp: "desc" },
        });

        return logs.map(this.serializeFoodLog);
    }

    static async update(logId: number, request: UpdateFoodLogRequest) {
        const validatedData = Validation.validate(FoodLogValidation.UPDATE, request);

        const existing = await prismaClient.food_Log.findUnique({
            where: { log_id: logId },
        });

        if (!existing) {
            throw new ResponseError(404, "Food log not found");
        }

        const updated = await prismaClient.food_Log.update({
            where: { log_id: logId },
            data: {
                timestamp: validatedData.timestamp
                    ? BigInt(validatedData.timestamp)
                    : undefined,
                latitude: validatedData.latitude,
                longitude: validatedData.longitude,
            },
            include: {
                foodInLogs: {
                    include: {
                        food: true,
                    },
                },
            },
        });

        return this.serializeFoodLog(updated);
    }

    static async delete(logId: number) {
        const existing = await prismaClient.food_Log.findUnique({
            where: { log_id: logId },
        });

        if (!existing) {
            throw new ResponseError(404, "Food log not found");
        }

        return prismaClient.food_Log.delete({
            where: { log_id: logId },
        });
    }

    // Helper to convert BigInt to number for JSON serialization
    private static serializeFoodLog(log: any) {
        return {
            ...log,
            timestamp: Number(log.timestamp),
        };
    }
}
