import { ResponseError } from "../error/responseError";
import { prismaClient } from "../utils/databaseUtil";
import { DailySummaryValidation } from "../validations/dailySummaryValidation";
import { Validation } from "../validations/validation";


export interface CreateDailySummaryRequest {
    user_id: number;
    date: Date;
    totalCaloriesIn: number;
}

export interface UpdateDailySummaryRequest {
    date?: Date;
    totalCaloriesIn?: number;
}

export class DailySummaryService {
    static async create(request: CreateDailySummaryRequest) {
        const validatedData = Validation.validate(DailySummaryValidation.CREATE, request);

        const user = await prismaClient.user.findUnique({
            where: { user_id: validatedData.user_id },
        });

        if (!user) {
            throw new ResponseError(404, "User not found");
        }

        return prismaClient.daily_Summary.create({
            data: validatedData,
        });
    }

    static async getById(summaryId: number) {
        const summary = await prismaClient.daily_Summary.findUnique({
            where: { summary_id: summaryId },
        });

        if (!summary) {
            throw new ResponseError(404, "Daily summary not found");
        }

        return summary;
    }

    static async getByUserId(userId: number) {
        return prismaClient.daily_Summary.findMany({
            where: { user_id: userId },
            orderBy: { date: "desc" },
        });
    }

    static async getByUserIdAndDate(userId: number, date: Date) {
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        return prismaClient.daily_Summary.findFirst({
            where: {
                user_id: userId,
                date: {
                    gte: startOfDay,
                    lte: endOfDay,
                },
            },
        });
    }

    static async update(summaryId: number, request: UpdateDailySummaryRequest) {
        const validatedData = Validation.validate(DailySummaryValidation.UPDATE, request);

        const existing = await prismaClient.daily_Summary.findUnique({
            where: { summary_id: summaryId },
        });

        if (!existing) {
            throw new ResponseError(404, "Daily summary not found");
        }

        return prismaClient.daily_Summary.update({
            where: { summary_id: summaryId },
            data: validatedData,
        });
    }

    static async delete(summaryId: number) {
        const existing = await prismaClient.daily_Summary.findUnique({
            where: { summary_id: summaryId },
        });

        if (!existing) {
            throw new ResponseError(404, "Daily summary not found");
        }

        return prismaClient.daily_Summary.delete({
            where: { summary_id: summaryId },
        });
    }
}
