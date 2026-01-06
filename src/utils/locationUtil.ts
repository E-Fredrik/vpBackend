/**
 * Location utility functions for Surabaya city boundaries and distance calculations
 */

// Surabaya city approximate boundaries
const SURABAYA_BOUNDS = {
    north: -7.18,
    south: -7.35,
    west: 112.65,
    east: 112.85,
    centerLat: -7.2575,
    centerLng: 112.7521
};

/**
 * Check if coordinates are within Surabaya city boundaries
 */
export function isInSurabaya(latitude: number, longitude: number): boolean {
    return (
        latitude >= SURABAYA_BOUNDS.south &&
        latitude <= SURABAYA_BOUNDS.north &&
        longitude >= SURABAYA_BOUNDS.west &&
        longitude <= SURABAYA_BOUNDS.east
    );
}

/**
 * Calculate distance between two coordinates using Haversine formula
 * @returns distance in kilometers
 */
export function calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

/**
 * Check if coordinate is within radius of a point
 */
export function isWithinRadius(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
    radiusKm: number
): boolean {
    const distance = calculateDistance(lat1, lon1, lat2, lon2);
    return distance <= radiusKm;
}

function toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
}

export const SURABAYA_CENTER = {
    latitude: SURABAYA_BOUNDS.centerLat,
    longitude: SURABAYA_BOUNDS.centerLng
};
