import { Food_Log, FoodInLog } from "../../generated/prisma"
import { FoodInLogResponse } from "./foodInLogModel"

export interface FoodLogCreateUpdateRequest {
    user_id: number
    timestamp: number
    latitude?: number
    longitude?: number
    foods: {
        food_id: number
        quantity?: number
            calories?: number
        }[]
}

export interface FoodLogResponse extends Partial<FoodLogCreateUpdateRequest> {
    log_id: number
    foodInLogs?: FoodInLogResponse[]
}

export function toFoodLogResponse(log: Food_Log & { foodInLogs?: (FoodInLog & { food?: any })[] }): FoodLogResponse {
    return {
        log_id: log.log_id,
        user_id: log.user_id,
        timestamp: Number(log.timestamp),
        latitude: log.latitude ?? undefined,
        longitude: log.longitude ?? undefined,
        foodInLogs: log.foodInLogs?.map(fi => ({
            id: fi.id,
            log_id: fi.log_id,
            food_id: fi.food_id,
            quantity: fi.quantity ?? null,
            calories: fi.calories ?? null,
            food: fi.food ? {
                food_id: fi.food.food_id,
                name: fi.food.name,
                calories: fi.food.calories
            } : undefined
        })) ?? undefined,
    }
}