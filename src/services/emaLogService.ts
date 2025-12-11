import { ResponseError } from "../error/responseError";
import { prismaClient } from "../utils/databaseUtil";
import { Validation } from "../validations/validation";
import { EmaLogValidation } from "../validations/emaLogValidation";

export interface CreateEmaLogRequest {
    user_id: number;
    moodScore: number;
    context?: string;
    timestamp: number; // Unix timestamp in milliseconds
    latitude?: number;
    longitude?: number;
    geofenceRadius?: number;
}

export interface UpdateEmaLogRequest {
    moodScore?: number;
    context?: string;
    timestamp?: number;
    latitude?: number;
    longitude?: number;
    geofenceRadius?: number;
}

export class EmaLogService {
    static async create(request: CreateEmaLogRequest) {
        const validatedData = Validation.validate(EmaLogValidation.CREATE, request);

        const user = await prismaClient.user.findUnique({
            where: { user_id: validatedData.user_id },
        });

        if (!user) {
            throw new ResponseError(404, "User not found");
        }

        const created = await prismaClient.eMA_Log.create({
            data: {
                user_id: validatedData.user_id,
                moodScore: validatedData.moodScore,
                context: validatedData.context,
                timestamp: BigInt(validatedData.timestamp),
                latitude: validatedData.latitude,
                longitude: validatedData.longitude,
                geofenceRadius: validatedData.geofenceRadius,
            },
        });

        return this.serialize(created);
    }

    static async getById(emaId: number) {
        const ema = await prismaClient.eMA_Log.findUnique({
            where: { ema_id: emaId },
        });

        if (!ema) {
            throw new ResponseError(404, "EMA log not found");
        }

        return this.serialize(ema);
    }

    static async getByUserId(userId: number) {
        const emas = await prismaClient.eMA_Log.findMany({
            where: { user_id: userId },
            orderBy: { timestamp: "desc" },
        });

        return emas.map(this.serialize);
    }

    static async getByUserIdAndDateRange(
        userId: number,
        startTimestamp: number,
        endTimestamp: number
    ) {
        const emas = await prismaClient.eMA_Log.findMany({
            where: {
                user_id: userId,
                timestamp: {
                    gte: BigInt(startTimestamp),
                    lte: BigInt(endTimestamp),
                },
            },
            orderBy: { timestamp: "desc" },
        });

        return emas.map(this.serialize);
    }

    static async getByUserIdAndLocation(
        userId: number,
        latitude: number,
        longitude: number,
        radiusKm: number
    ) {
        const allEmas = await prismaClient.eMA_Log.findMany({
            where: {
                user_id: userId,
                latitude: { not: null },
                longitude: { not: null },
            },
            orderBy: { timestamp: "desc" },
        });

        const filtered = allEmas.filter((ema) => {
            if (ema.latitude === null || ema.longitude === null) return false;
            const distance = this.calculateDistance(
                latitude,
                longitude,
                ema.latitude,
                ema.longitude
            );
            return distance <= radiusKm;
        });

        return filtered.map(this.serialize);
    }

    private static calculateDistance(
        lat1: number,
        lon1: number,
        lat2: number,
        lon2: number
    ): number {
        const R = 6371; // Earth's radius in km
        const dLat = this.toRad(lat2 - lat1);
        const dLon = this.toRad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.toRad(lat1)) *
                Math.cos(this.toRad(lat2)) *
                Math.sin(dLon / 2) *
                Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    private static toRad(deg: number): number {
        return deg * (Math.PI / 180);
    }

    static async update(emaId: number, request: UpdateEmaLogRequest) {
        const validatedData = Validation.validate(EmaLogValidation.UPDATE, request);

        const existing = await prismaClient.eMA_Log.findUnique({
            where: { ema_id: emaId },
        });

        if (!existing) {
            throw new ResponseError(404, "EMA log not found");
        }

        const updated = await prismaClient.eMA_Log.update({
            where: { ema_id: emaId },
            data: {
                moodScore: validatedData.moodScore,
                context: validatedData.context,
                timestamp: validatedData.timestamp
                    ? BigInt(validatedData.timestamp)
                    : undefined,
                latitude: validatedData.latitude,
                longitude: validatedData.longitude,
                geofenceRadius: validatedData.geofenceRadius,
            },
        });

        return this.serialize(updated);
    }

    static async delete(emaId: number) {
        const existing = await prismaClient.eMA_Log.findUnique({
            where: { ema_id: emaId },
        });

        if (!existing) {
            throw new ResponseError(404, "EMA log not found");
        }

        await prismaClient.eMA_Log.delete({
            where: { ema_id: emaId },
        });

        return { message: "EMA log deleted successfully" };
    }

    // Helper to convert BigInt to number for JSON serialization
    private static serialize(ema: any) {
        return {
            ...ema,
            timestamp: Number(ema.timestamp),
        };
    }
}
