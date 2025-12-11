import { ResponseError } from "../error/responseError";
import { prismaClient } from "../utils/databaseUtil";
import { Validation } from "../validations/validation";
import { VisitLogValidation } from "../validations/visitLogValidation";

export interface CreateVisitLogRequest {
    user_id: number;
    place_id: number;
    entryTime: number; // Unix timestamp in milliseconds
    exitTime: number;
    durationMins: number;
}

export interface UpdateVisitLogRequest {
    entryTime?: number;
    exitTime?: number;
    durationMins?: number;
}

export class VisitLogService {
    static async create(request: CreateVisitLogRequest) {
        const validatedData = Validation.validate(VisitLogValidation.CREATE, request);

        // Verify user exists
        const user = await prismaClient.user.findUnique({
            where: { user_id: validatedData.user_id },
        });

        if (!user) {
            throw new ResponseError(404, "User not found");
        }

        // Verify place exists
        const place = await prismaClient.place_of_Interest.findUnique({
            where: { place_id: validatedData.place_id },
        });

        if (!place) {
            throw new ResponseError(404, "Place not found");
        }

        const created = await prismaClient.visit_Log.create({
            data: {
                user_id: validatedData.user_id,
                place_id: validatedData.place_id,
                entryTime: BigInt(validatedData.entryTime),
                exitTime: BigInt(validatedData.exitTime),
                durationMins: validatedData.durationMins,
            },
            include: {
                place: true,
            },
        });

        return this.serialize(created);
    }

    static async getById(visitId: number) {
        const visit = await prismaClient.visit_Log.findUnique({
            where: { visit_id: visitId },
            include: {
                place: true,
            },
        });

        if (!visit) {
            throw new ResponseError(404, "Visit log not found");
        }

        return this.serialize(visit);
    }

    static async getByUserId(userId: number) {
        const visits = await prismaClient.visit_Log.findMany({
            where: { user_id: userId },
            include: {
                place: true,
            },
            orderBy: { entryTime: "desc" },
        });

        return visits.map(this.serialize);
    }

    static async getByPlaceId(placeId: number) {
        const visits = await prismaClient.visit_Log.findMany({
            where: { place_id: placeId },
            include: {
                user: {
                    select: { user_id: true, username: true },
                },
            },
            orderBy: { entryTime: "desc" },
        });

        return visits.map(this.serialize);
    }

    static async getByUserIdAndDateRange(
        userId: number,
        startTimestamp: number,
        endTimestamp: number
    ) {
        const visits = await prismaClient.visit_Log.findMany({
            where: {
                user_id: userId,
                entryTime: {
                    gte: BigInt(startTimestamp),
                    lte: BigInt(endTimestamp),
                },
            },
            include: {
                place: true,
            },
            orderBy: { entryTime: "desc" },
        });

        return visits.map(this.serialize);
    }

    static async update(visitId: number, request: UpdateVisitLogRequest) {
        const validatedData = Validation.validate(VisitLogValidation.UPDATE, request);

        const existing = await prismaClient.visit_Log.findUnique({
            where: { visit_id: visitId },
        });

        if (!existing) {
            throw new ResponseError(404, "Visit log not found");
        }

        const updated = await prismaClient.visit_Log.update({
            where: { visit_id: visitId },
            data: {
                entryTime: validatedData.entryTime
                    ? BigInt(validatedData.entryTime)
                    : undefined,
                exitTime: validatedData.exitTime
                    ? BigInt(validatedData.exitTime)
                    : undefined,
                durationMins: validatedData.durationMins,
            },
            include: {
                place: true,
            },
        });

        return this.serialize(updated);
    }

    static async delete(visitId: number) {
        const existing = await prismaClient.visit_Log.findUnique({
            where: { visit_id: visitId },
        });

        if (!existing) {
            throw new ResponseError(404, "Visit log not found");
        }

        await prismaClient.visit_Log.delete({
            where: { visit_id: visitId },
        });

        return { message: "Visit log deleted successfully" };
    }

    // Helper to convert BigInt to number for JSON serialization
    private static serialize(visit: any) {
        return {
            ...visit,
            entryTime: Number(visit.entryTime),
            exitTime: Number(visit.exitTime),
        };
    }
}
