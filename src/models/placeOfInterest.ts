// Place of Interest enums and interfaces
import { PlaceCategory as PrismaPlaceCategory } from "../../generated/prisma";

export type PlaceCategory = PrismaPlaceCategory;
export const PlaceCategory = PrismaPlaceCategory;

// Main Place_of_Interest interface matching Prisma schema
export interface PlaceOfInterest {
  place_id: number;
  name: string;
  category: PlaceCategory;
  latitude: number;
  longitude: number;
  geofenceRadius: number;
}

// Interface for creating a place of interest
export interface CreatePlaceOfInterestInput {
  name: string;
  category: PlaceCategory;
  latitude: number;
  longitude: number;
  geofenceRadius: number;
}

// Interface for updating a place of interest
export interface UpdatePlaceOfInterestInput extends Partial<CreatePlaceOfInterestInput> {
  place_id: number;
}

// Interface for place query parameters
export interface PlaceOfInterestQueryParams {
  place_id?: number;
  category?: PlaceCategory;
  name?: string;
  latitude?: number;
  longitude?: number;
  radius?: number; // Search radius for nearby places
}

// Interface for place with distance calculation
export interface PlaceOfInterestWithDistance extends PlaceOfInterest {
  distance?: number; // Distance from a reference point in meters/km
}

// Interface for geofence check
export interface GeofenceCheck {
  place_id: number;
  name: string;
  isInside: boolean;
  distance: number;
}
