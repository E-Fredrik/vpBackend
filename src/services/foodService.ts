import {
    FoodCreateUpdateRequest,
    FoodResponse,
    toFoodResponse,
} from './../models/foodModel'
import { prismaClient } from '../utils/databaseUtil'
import { Food } from '../../generated/prisma'
import { ResponseError } from '../error/responseError'
import { FoodValidation } from '../validations/foodValidation'
import { UserJWTPayload } from '../models/userModel'
import { Validation } from '../validations/validation'

export class FoodService {
    static async getFood(foodId: number): Promise<FoodResponse> {
        const food = await this.checkFoodExist(foodId)
        return toFoodResponse(food)
    }

    static async getFoodByName(name: string): Promise<FoodResponse[]> {
        const foods = await prismaClient.food.findMany({
            where: {
                name: { contains: name,
                    mode: 'insensitive',
                },
            },
        })
        return foods.map(toFoodResponse)
    }

    static async checkFoodExist(
        foodId: number
    ): Promise<Food> {
        const food = await prismaClient.food.findFirst({
            where: {
                food_id: foodId,
            },
        })
        if (!food) {
            throw new ResponseError(404, "Food not found!")
        }
        return food
    }

    static async createFood(
        request: FoodCreateUpdateRequest,
    ): Promise<string> {
        const validatedData = Validation.validate(
            FoodValidation.CREATE, request
        )
        await prismaClient.food.create({
            data: {
                name: validatedData.name,
                calories: validatedData.calories,
            },
        })
        return "Food created successfully!"
    }

    static async updateFood(
        foodId: number,
        request: FoodCreateUpdateRequest,
    ): Promise<string> {
        const validatedData = Validation.validate(
            FoodValidation.UPDATE, request
        )
        await this.checkFoodExist(foodId)
        await prismaClient.food.update({
            where: {
                food_id: foodId,
            },
            data: {
                name: validatedData.name,
                calories: validatedData.calories,
            },
        })
        return "Food updated successfully!"
    }
}