import { Food } from "../../generated/prisma";

export interface FoodResponse extends FoodCreateUpdateRequest {
    id: number
}

export interface FoodCreateUpdateRequest {
    name: string
    calories: number
}

export function toFoodResponse(
    food: Food
): FoodResponse {
    return {
        id: food.food_id,
        name: food.name,
        calories: food.calories
    }
}