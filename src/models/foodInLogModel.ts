import { FoodInLog } from "../../generated/prisma"

export interface FoodInLogCreateUpdateRequest {
    log_id: number
    food_id: number
    quantity?: number
    calories?: number
}

export interface FoodInLogResponse {
    id: number
    log_id: number
    food_id: number
    quantity?: number | null
    calories?: number | null
    food?: {
        food_id: number
        name: string
        calories: number
    }
    log?: {
        log_id: number
        user_id: number
        timestamp: number
        latitude?: number
        longitude?: number
    }
}

export function toFoodInLogResponse(
    foodInLog: FoodInLog
): FoodInLogResponse {
    return {
        id: foodInLog.id,
        log_id: foodInLog.log_id,
        food_id: foodInLog.food_id,
        quantity: foodInLog.quantity ?? null,
        calories: foodInLog.calories ?? null,
    }
}
