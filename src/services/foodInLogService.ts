import {
	FoodInLogCreateUpdateRequest,
	FoodInLogResponse,
} from "../models/foodInLogModel";
import { prismaClient } from "../utils/databaseUtil";
import { Validation } from "../validations/validation";
import { FoodInLogValidation } from "../validations/foodInLogValidation";
import { ResponseError } from "../error/responseError";


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
	static async createFoodInLog(
		request: FoodInLogCreateUpdateRequest
	): Promise<FoodInLogResponse> {
		const validated = Validation.validate(FoodInLogValidation.CREATE, request);

		const log = await prismaClient.food_Log.findUnique({
			where: { log_id: validated.log_id },
		});
		if (!log) {
			throw new ResponseError(404, "Log not found!");
		}

		const food = await prismaClient.food.findUnique({
			where: { food_id: validated.food_id },
		});
		if (!food) {
			throw new ResponseError(404, "Food not found!");
		}

		const created = await prismaClient.foodInLog.create({
			data: {
				log_id: validated.log_id,
				food_id: validated.food_id,
				quantity: validated.quantity ?? undefined,
				calories: validated.calories ?? undefined,
			},
			include: {
				food: true,
				log: true,
			},
		});

		return {
			id: created.id,
			log_id: created.log_id,
			food_id: created.food_id,
			quantity: created.quantity ?? null,
			calories: created.calories ?? null,
			food: created.food
				? {
						food_id: created.food.food_id,
						name: created.food.name,
						calories: created.food.calories,
				  }
				: undefined,
			log: created.log
				? {
						log_id: created.log.log_id,
						user_id: created.log.user_id,
						timestamp: Number(created.log.timestamp),
						latitude: created.log.latitude ?? undefined,
						longitude: created.log.longitude ?? undefined,
				}
				: undefined,
		};
	}

    static async getFoodInLog(id: number): Promise<FoodInLogResponse> {
        const found = await prismaClient.foodInLog.findUnique({
            where: { id },
            include: { food: true, log: true },
        })
        if (!found) {
            throw new ResponseError(404, "Food in log not found!")
        }
        
        return {
            id: found.id,
            log_id: found.log_id,
            food_id: found.food_id,
            quantity: found.quantity ?? null,
            calories: found.calories ?? null,
            food: found.food ? {
                    food_id: found.food.food_id,
                    name: found.food.name,
                    calories: found.food.calories,
                } : undefined,
            log: found.log ? {
                    log_id: found.log.log_id,
                    user_id: found.log.user_id,
                    timestamp: Number(found.log.timestamp),
                    latitude: found.log.latitude ?? undefined,
                    longitude: found.log.longitude ?? undefined,
                }: undefined,
        }
    }

    static async updateFoodInLog(id: number, payload: Partial<FoodInLogCreateUpdateRequest>): Promise<FoodInLogResponse> {
        const validated = Validation.validate(FoodInLogValidation.UPDATE, payload)

        const existing = await prismaClient.foodInLog.findUnique({
            where: { id },
        })
        if (!existing) {
            throw new ResponseError(404, "Food in log not found!")
        }

        const updated = await prismaClient.foodInLog.update({
            where: { id },
            data: {
                quantity: validated.quantity ?? existing.quantity,
                calories: validated.calories ?? existing.calories,
            },
            include: { food: true, log: true },
        })

        return {
            id: updated.id,
            log_id: updated.log_id,
            food_id: updated.food_id,
            quantity: updated.quantity ?? undefined,
            calories: updated.calories ?? undefined,
            food: updated.food ? {
                food_id: updated.food.food_id,
                name: updated.food.name,
                calories: updated.food.calories,
            } : undefined,
            log: updated.log ? {
                log_id: updated.log.log_id,
                user_id: updated.log.user_id,
                timestamp: Number(updated.log.timestamp),
            } : undefined,
        }
    }

    static async deleteFoodInLog(id: number): Promise<string> {
        const existing = await prismaClient.foodInLog.findUnique({
            where: { id },
        })
        if (!existing) {
            throw new ResponseError(404, "Food in log not found!")
        }
        await prismaClient.foodInLog.delete({
            where: { id },
        })
        return "Food in log deleted successfully!"
    }
}
