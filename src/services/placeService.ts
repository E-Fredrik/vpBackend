import { ResponseError } from "../error/responseError";
import { prismaClient } from "../utils/databaseUtil";
import { Validation } from "../validations/validation";
import { PlaceValidation } from "../validations/placeValidation";

export interface CreatePlaceRequest {
    name: string;
    category: "RESTAURANT" | "PARK" | "GYM" | "STORE" | "OTHER";
    latitude: number;
    longitude: number;
    geofenceRadius: number;
}

export interface UpdatePlaceRequest {
    name?: string;
    category?: "RESTAURANT" | "PARK" | "GYM" | "STORE" | "OTHER";
    latitude?: number;
    longitude?: number;
    geofenceRadius?: number;
}

export class PlaceService {
    static async create(request: CreatePlaceRequest) {
        const validatedData = Validation.validate(PlaceValidation.CREATE, request);

        return prismaClient.place_of_Interest.create({
            data: validatedData,
        });
    }

    static async getById(placeId: number) {
        const place = await prismaClient.place_of_Interest.findUnique({
            where: { place_id: placeId },
        });

        if (!place) {
            throw new ResponseError(404, "Place not found");
        }

        return place;
    }

    static async getAll() {
        return prismaClient.place_of_Interest.findMany();
    }

    static async getByCategory(category: string) {
        return prismaClient.place_of_Interest.findMany({
            where: { category: category as any },
        });
    }

    static async getNearby(latitude: number, longitude: number, radiusKm: number) {
        // Get all places and filter by distance (simple approach)
        // For production, consider using PostGIS extensions
        const allPlaces = await prismaClient.place_of_Interest.findMany();
        
        return allPlaces.filter((place) => {
            const distance = this.calculateDistance(
                latitude,
                longitude,
                place.latitude,
                place.longitude
            );
            return distance <= radiusKm;
        });
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

    static async update(placeId: number, request: UpdatePlaceRequest) {
        const validatedData = Validation.validate(PlaceValidation.UPDATE, request);

        const existing = await prismaClient.place_of_Interest.findUnique({
            where: { place_id: placeId },
        });

        if (!existing) {
            throw new ResponseError(404, "Place not found");
        }

        return prismaClient.place_of_Interest.update({
            where: { place_id: placeId },
            data: validatedData,
        });
    }

    static async delete(placeId: number) {
        const existing = await prismaClient.place_of_Interest.findUnique({
            where: { place_id: placeId },
        });

        if (!existing) {
            throw new ResponseError(404, "Place not found");
        }

        return prismaClient.place_of_Interest.delete({
            where: { place_id: placeId },
        });
    }
}
