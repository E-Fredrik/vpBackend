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

export function toFoodResponseList(food: Food[]): FoodResponse[] {
    const result= food.map((f) => {
        return {
            id: f.food_id,
            name: f.name,
            calories: f.calories
        }
    })
    return result
}