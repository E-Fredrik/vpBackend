import { ResponseError } from "../error/responseError";
import { prismaClient } from "../utils/databaseUtil";
import { Validation } from "../validations/validation";
import { FoodInLogValidation } from "../validations/foodInLogValidation";

export interface CreateFoodInLogRequest {
    log_id: number;
    food_id: number;
    quantity?: number;
    calories?: number;
}

export interface UpdateFoodInLogRequest {
    quantity?: number;
    calories?: number;
}

export class FoodInLogService {
    static async create(request: CreateFoodInLogRequest) {
        const validatedData = Validation.validate(FoodInLogValidation.CREATE, request);

        // Verify log exists
        const log = await prismaClient.food_Log.findUnique({
            where: { log_id: validatedData.log_id },
        });

        if (!log) {
            throw new ResponseError(404, "Food log not found");
        }

        // Verify food exists
        const food = await prismaClient.food.findUnique({
            where: { food_id: validatedData.food_id },
        });

        if (!food) {
            throw new ResponseError(404, "Food not found");
        }

        return prismaClient.foodInLog.create({
            data: validatedData,
            include: {
                food: true,
            },
        });
    }

    static async getById(id: number) {
        const foodInLog = await prismaClient.foodInLog.findUnique({
            where: { id },
            include: {
                food: true,
                log: true,
            },
        });

        if (!foodInLog) {
            throw new ResponseError(404, "Food in log entry not found");
        }

        return this.serialize(foodInLog);
    }

    static async getByLogId(logId: number) {
        const items = await prismaClient.foodInLog.findMany({
            where: { log_id: logId },
            include: {
                food: true,
            },
        });

        return items;
    }

    static async update(id: number, request: UpdateFoodInLogRequest) {
        const validatedData = Validation.validate(FoodInLogValidation.UPDATE, request);

        const existing = await prismaClient.foodInLog.findUnique({
            where: { id },
        });

        if (!existing) {
            throw new ResponseError(404, "Food in log entry not found");
        }

        return prismaClient.foodInLog.update({
            where: { id },
            data: validatedData,
            include: {
                food: true,
            },
        });
    }

    static async delete(id: number) {
        const existing = await prismaClient.foodInLog.findUnique({
            where: { id },
        });

        if (!existing) {
            throw new ResponseError(404, "Food in log entry not found");
        }

        return prismaClient.foodInLog.delete({
            where: { id },
        });
    }

    // Helper to serialize BigInt fields
    private static serialize(item: any) {
        if (item.log) {
            item.log = {
                ...item.log,
                timestamp: Number(item.log.timestamp),
            };
        }
        return item;
    }
}
