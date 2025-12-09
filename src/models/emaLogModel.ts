// EMA (Ecological Momentary Assessment) Log interfaces

// Main EMA_Log interface matching Prisma schema
export interface EMALog {
  ema_id: number;
  user_id: number;
  timestamp: bigint;
  latitude: number;
  longitude: number;
  geofenceRadius: number;
}

// Interface for creating an EMA log entry
export interface CreateEMALogInput {
  user_id: number;
  timestamp: bigint;
  latitude: number;
  longitude: number;
  geofenceRadius: number;
}

// Interface for updating an EMA log entry
export interface UpdateEMALogInput {
  ema_id: number;
  timestamp?: bigint;
  latitude?: number;
  longitude?: number;
  geofenceRadius?: number;
}

// Interface for EMA log query parameters
export interface EMALogQueryParams {
  ema_id?: number;
  user_id?: number;
  startTime?: bigint;
  endTime?: bigint;
  latitude?: number;
  longitude?: number;
  radius?: number; // Search radius for location-based queries
}

// Interface for EMA log with user data
export interface EMALogWithUser extends EMALog {
  user?: {
    user_id: number;
    name: string | null;
    email: string | null;
  };
}

// Interface for EMA log with location details
export interface EMALogWithLocation extends EMALog {
  nearbyPlaces?: {
    place_id: number;
    place_name: string;
    category: string;
    distance: number;
  }[];
  isInGeofence?: boolean;
}

// Interface for EMA log statistics
export interface EMALogStats {
  user_id: number;
  totalLogs: number;
  avgGeofenceRadius: number;
  firstLog: bigint;
  lastLog: bigint;
  mostCommonLocations: {
    latitude: number;
    longitude: number;
    count: number;
  }[];
}

// Interface for EMA log with time-based analysis
export interface EMALogWithTimeAnalysis extends EMALog {
  dayOfWeek: string;
  hourOfDay: number;
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
}

// Interface for geofence trigger
export interface GeofenceTrigger {
  ema_id: number;
  user_id: number;
  timestamp: bigint;
  triggeredPlace?: {
    place_id: number;
    place_name: string;
    category: string;
  };
  isEntry: boolean;
  isExit: boolean;
}
