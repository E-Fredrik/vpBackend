import { ResponseError } from "../error/responseError";
import { prismaClient } from "../utils/databaseUtil";
import { Validation } from "../validations/validation";
import { ActivityLogValidation } from "../validations/activityLogValidation";

export interface CreateActivityLogRequest {
    user_id: number;
    activityType: string;
    startTime: number; // Unix timestamp in milliseconds
    endTime: number;
    confidence: number;
}

export interface UpdateActivityLogRequest {
    activityType?: string;
    startTime?: number;
    endTime?: number;
    confidence?: number;
}

export class ActivityLogService {
    static async create(request: CreateActivityLogRequest) {
        const validatedData = Validation.validate(ActivityLogValidation.CREATE, request);

        const user = await prismaClient.user.findUnique({
            where: { user_id: validatedData.user_id },
        });

        if (!user) {
            throw new ResponseError(404, "User not found");
        }

        const created = await prismaClient.activity_Log.create({
            data: {
                user_id: validatedData.user_id,
                activityType: validatedData.activityType,
                startTime: BigInt(validatedData.startTime),
                endTime: BigInt(validatedData.endTime),
                confidence: validatedData.confidence,
            },
        });

        return this.serialize(created);
    }

    static async getById(activityId: number) {
        const activity = await prismaClient.activity_Log.findUnique({
            where: { activity_id: activityId },
        });

        if (!activity) {
            throw new ResponseError(404, "Activity log not found");
        }

        return this.serialize(activity);
    }

    static async getByUserId(userId: number) {
        const activities = await prismaClient.activity_Log.findMany({
            where: { user_id: userId },
            orderBy: { startTime: "desc" },
        });

        return activities.map(this.serialize);
    }

    static async getByUserIdAndDateRange(
        userId: number,
        startTimestamp: number,
        endTimestamp: number
    ) {
        const activities = await prismaClient.activity_Log.findMany({
            where: {
                user_id: userId,
                startTime: {
                    gte: BigInt(startTimestamp),
                    lte: BigInt(endTimestamp),
                },
            },
            orderBy: { startTime: "desc" },
        });

        return activities.map(this.serialize);
    }

    static async getByUserIdAndActivityType(userId: number, activityType: string) {
        const activities = await prismaClient.activity_Log.findMany({
            where: {
                user_id: userId,
                activityType: activityType,
            },
            orderBy: { startTime: "desc" },
        });

        return activities.map(this.serialize);
    }

    static async update(activityId: number, request: UpdateActivityLogRequest) {
        const validatedData = Validation.validate(ActivityLogValidation.UPDATE, request);

        const existing = await prismaClient.activity_Log.findUnique({
            where: { activity_id: activityId },
        });

        if (!existing) {
            throw new ResponseError(404, "Activity log not found");
        }

        const updated = await prismaClient.activity_Log.update({
            where: { activity_id: activityId },
            data: {
                activityType: validatedData.activityType,
                startTime: validatedData.startTime
                    ? BigInt(validatedData.startTime)
                    : undefined,
                endTime: validatedData.endTime
                    ? BigInt(validatedData.endTime)
                    : undefined,
                confidence: validatedData.confidence,
            },
        });

        return this.serialize(updated);
    }

    static async delete(activityId: number) {
        const existing = await prismaClient.activity_Log.findUnique({
            where: { activity_id: activityId },
        });

        if (!existing) {
            throw new ResponseError(404, "Activity log not found");
        }

        await prismaClient.activity_Log.delete({
            where: { activity_id: activityId },
        });

        return { message: "Activity log deleted successfully" };
    }

    /**
     * Bulk create activity logs (for batch uploads from Android)
     */
    static async bulkCreate(activities: CreateActivityLogRequest[]) {
        const results = [];
        for (const activity of activities) {
            const validatedData = Validation.validate(ActivityLogValidation.CREATE, activity);
            const created = await prismaClient.activity_Log.create({
                data: {
                    user_id: validatedData.user_id,
                    activityType: validatedData.activityType,
                    startTime: BigInt(validatedData.startTime),
                    endTime: BigInt(validatedData.endTime),
                    confidence: validatedData.confidence,
                },
            });
            results.push(this.serialize(created));
        }
        return results;
    }

    /**
     * Get ongoing activity for user (if any)
     */
    static async getCurrentActivity(userId: number) {
        const now = Date.now();
        const recentThreshold = now - (10 * 60 * 1000); // 10 minutes ago

        const activity = await prismaClient.activity_Log.findFirst({
            where: {
                user_id: userId,
                startTime: {
                    gte: BigInt(recentThreshold)
                }
            },
            orderBy: { startTime: 'desc' }
        });

        return activity ? this.serialize(activity) : null;
    }

    // Helper to convert BigInt to number for JSON serialization
    private static serialize(activity: any) {
        return {
            ...activity,
            startTime: Number(activity.startTime),
            endTime: Number(activity.endTime),
        };
    }
}
