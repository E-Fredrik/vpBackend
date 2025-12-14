import { FoodLogCreateUpdateRequest, FoodLogResponse, toFoodLogResponse } from "../models/foodLogModel"
import { prismaClient } from "../utils/databaseUtil"
import { Validation } from "../validations/validation"
import { FoodLogValidation } from "../validations/foodLogValidation"
import { ResponseError } from "../error/responseError"

export class FoodLogService {
    static async createFoodLog(request: FoodLogCreateUpdateRequest): Promise<FoodLogResponse> {
        const validated = Validation.validate(FoodLogValidation.CREATE, request)

        const user = await prismaClient.user.findUnique({ where: { user_id: validated.user_id } })
        if (!user) {
            throw new ResponseError(404, "User not found!")
        }

        const created = await prismaClient.food_Log.create({
            data: {
                user_id: validated.user_id,
                timestamp: BigInt(validated.timestamp),
                latitude: validated.latitude ?? undefined,
                longitude: validated.longitude ?? undefined,
                foodInLogs: {
                    create: validated.foods.map(f => ({
                        food: { connect: { food_id: f.food_id } },
                        quantity: f.quantity ?? undefined,
                        calories: f.calories ?? undefined,
                    })),
                },
            },
            include: { foodInLogs: { include: { food: true } } },
        })
        return toFoodLogResponse(created)
    }

    static async getFoodLog(logId: number): Promise<FoodLogResponse> {
        const existing = await prismaClient.food_Log.findUnique({
            where: { log_id: logId },
            include: { foodInLogs: { include: { food: true } } },
        })
        if (!existing) {
            throw new ResponseError(404, "Food log not found!")
        }
        return toFoodLogResponse(existing)
    }

    static async updateFoodLog(logId: number, payload: Partial<Pick<FoodLogCreateUpdateRequest, "timestamp" | "latitude" | "longitude">>): Promise<FoodLogResponse> {
        const validated = Validation.validate(FoodLogValidation.UPDATE, payload)

        const existing = await prismaClient.food_Log.findUnique({
            where: { log_id: logId },
            include: { foodInLogs: { include: { food: true } } },
        })
        if (!existing) {
            throw new ResponseError(404, "Food log not found!")
        }
        const updated = await prismaClient.food_Log.update({
            where: { log_id: logId },
            data: {
                timestamp: validated.timestamp ? BigInt(validated.timestamp) : undefined,
                latitude: validated.latitude ?? undefined,
                longitude: validated.longitude ?? undefined,
            },
            include: { foodInLogs: { include: { food: true } } },
        })
        return toFoodLogResponse(updated)
    }

    static async deleteFoodLog(logId: number): Promise<string> {
        const existing = await prismaClient.food_Log.findUnique({
            where: { log_id: logId },
        })
        if (!existing) {
            throw new ResponseError(404, "Food log not found!")
        }
        await prismaClient.food_Log.delete({
            where: { log_id: logId },
        })
        return "Food log deleted successfully."
    }

    static async getFoodLogsByUser(userId: number): Promise<FoodLogResponse[]> {
        const existingLogs = await prismaClient.food_Log.findMany({
            where: { user_id: userId },
            include: { foodInLogs: { include: { food: true } } },
        })
        return existingLogs.map(log => toFoodLogResponse(log))
    }
}
