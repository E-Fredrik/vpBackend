import { PlaceService } from "./placeService";
import { prismaClient } from "../utils/databaseUtil";
import { isInSurabaya, calculateDistance } from "../utils/locationUtil";
import { ResponseError } from "../error/responseError";

export interface LocationCheckRequest {
    userId: number;
    latitude: number;
    longitude: number;
}

export interface NotificationTrigger {
    placeId: number;
    placeName: string;
    category: string;
    notificationType: string;
    message: string;
    priority: "HIGH" | "MEDIUM" | "LOW";
    distance: number;
    shouldVibrate: boolean;
    icon: string;
}

export class NotificationService {
    /**
     * Check if user is near any places and return notification triggers
     */
    static async checkLocationTriggers(request: LocationCheckRequest): Promise<NotificationTrigger[]> {
        // 1. Validate Surabaya boundaries
        if (!isInSurabaya(request.latitude, request.longitude)) {
            throw new ResponseError(400, "Location is outside Surabaya city boundaries");
        }

        // 2. Verify user exists
        const user = await prismaClient.user.findUnique({
            where: { user_id: request.userId }
        });

        if (!user) {
            throw new ResponseError(404, "User not found");
        }

        // 3. Get nearby places (within 1km)
        const nearbyPlaces = await PlaceService.getNearby(
            request.latitude,
            request.longitude,
            1 // 1km radius
        );

        if (nearbyPlaces.length === 0) {
            return [];
        }

        // 4. Check recent logs (last 30 minutes)
        const now = Date.now();
        const recentThreshold = now - (30 * 60 * 1000);

        const triggers: NotificationTrigger[] = [];
        
        for (const place of nearbyPlaces) {
            // Calculate exact distance
            const distanceKm = calculateDistance(
                request.latitude,
                request.longitude,
                place.latitude,
                place.longitude
            );
            const distanceMeters = Math.round(distanceKm * 1000);

            // Skip if outside geofence
            if (distanceMeters > place.geofenceRadius) {
                continue;
            }

            // Check if already visited recently
            const recentVisit = await prismaClient.visit_Log.findFirst({
                where: {
                    user_id: request.userId,
                    place_id: place.place_id,
                    entryTime: { gte: BigInt(recentThreshold) }
                },
                orderBy: { entryTime: 'desc' }
            });

            if (recentVisit) continue;

            // Check category-specific recent logs
            const hasRecentLog = await this.checkRecentLogByCategory(
                request.userId,
                place.category,
                place.latitude,
                place.longitude,
                recentThreshold
            );

            if (!hasRecentLog) {
                triggers.push({
                    placeId: place.place_id,
                    placeName: place.name,
                    category: place.category,
                    notificationType: this.getNotificationType(place.category),
                    message: this.getNotificationMessage(place),
                    priority: this.getPriority(place.category, distanceMeters),
                    distance: distanceMeters,
                    shouldVibrate: distanceMeters < 50,
                    icon: this.getIcon(place.category)
                });
            }
        }

        // Sort by priority then distance
        return triggers.sort((a, b) => {
            const priorityOrder = { HIGH: 0, MEDIUM: 1, LOW: 2 };
            if (a.priority !== b.priority) {
                return priorityOrder[a.priority] - priorityOrder[b.priority];
            }
            return a.distance - b.distance;
        });
    }

    /**
     * Check if user has recent log for specific category
     */
    private static async checkRecentLogByCategory(
        userId: number,
        category: string,
        lat: number,
        lng: number,
        threshold: number
    ): Promise<boolean> {
        const locationRange = 0.002; // ~200m

        switch (category) {
            case 'RESTAURANT': {
                const foodLog = await prismaClient.food_Log.findFirst({
                    where: {
                        user_id: userId,
                        timestamp: { gte: BigInt(threshold) },
                        latitude: { gte: lat - locationRange, lte: lat + locationRange },
                        longitude: { gte: lng - locationRange, lte: lng + locationRange }
                    }
                });
                return !!foodLog;
            }

            case 'GYM': {
                const activityLog = await prismaClient.activity_Log.findFirst({
                    where: {
                        user_id: userId,
                        startTime: { gte: BigInt(threshold) },
                        activityType: { in: ['WEIGHTLIFTING', 'RUNNING', 'CYCLING', 'YOGA'] }
                    }
                });
                return !!activityLog;
            }

            case 'PARK': {
                const emaLog = await prismaClient.eMA_Log.findFirst({
                    where: {
                        user_id: userId,
                        timestamp: { gte: BigInt(threshold) },
                        latitude: { gte: lat - locationRange, lte: lat + locationRange },
                        longitude: { gte: lng - locationRange, lte: lng + locationRange }
                    }
                });
                return !!emaLog;
            }

            default:
                return false;
        }
    }

    private static getNotificationType(category: string): string {
        const types: Record<string, string> = {
            'RESTAURANT': 'FOOD_LOG',
            'GYM': 'ACTIVITY_LOG',
            'PARK': 'EMA_LOG',
            'STORE': 'VISIT_LOG',
            'OTHER': 'VISIT_LOG'
        };
        return types[category] || 'VISIT_LOG';
    }

    private static getNotificationMessage(place: any): string {
        const messages: Record<string, string> = {
            'RESTAURANT': `🍽️ You're at ${place.name}. Log your meal?`,
            'GYM': `💪 You're at ${place.name}. Track your workout?`,
            'PARK': `🌳 You're at ${place.name}. How are you feeling?`,
            'STORE': `🛒 You're at ${place.name}. Log your visit?`,
            'OTHER': `📍 You're at ${place.name}. Log your visit?`
        };
        return messages[place.category] || `You're at ${place.name}`;
    }

    private static getPriority(category: string, distanceMeters: number): "HIGH" | "MEDIUM" | "LOW" {
        // Very close = HIGH
        if (distanceMeters < 50) return 'HIGH';
        
        // Important categories at medium distance = MEDIUM
        if (distanceMeters < 200) {
            return ['RESTAURANT', 'GYM', 'PARK'].includes(category) ? 'MEDIUM' : 'LOW';
        }
        
        return 'LOW';
    }

    private static getIcon(category: string): string {
        const icons: Record<string, string> = {
            'RESTAURANT': 'restaurant',
            'GYM': 'fitness_center',
            'PARK': 'park',
            'STORE': 'shopping_cart',
            'OTHER': 'place'
        };
        return icons[category] || 'notifications';
    }

    /**
     * Get notification history
     */
    static async getNotificationHistory(userId: number, limit: number = 10) {
        const recentVisits = await prismaClient.visit_Log.findMany({
            where: { user_id: userId },
            include: { place: true },
            orderBy: { entryTime: 'desc' },
            take: limit
        });

        return recentVisits.map(visit => ({
            placeId: visit.place_id,
            placeName: visit.place.name,
            category: visit.place.category,
            timestamp: Number(visit.entryTime),
            wasLogged: true
        }));
    }
}
