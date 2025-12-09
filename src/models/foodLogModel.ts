// Food Log interfaces

// Main Food_Log interface matching Prisma schema
export interface FoodLog {
  log_id: number;
  user_id: number;
  foodName: string;
  calories: number;
  timestamp: bigint;
  latitude: number | null;
  longitude: number | null;
}

// Interface for creating a food log entry
export interface CreateFoodLogInput {
  user_id: number;
  foodName: string;
  calories: number;
  timestamp: bigint;
  latitude?: number;
  longitude?: number;
}

// Interface for updating a food log entry
export interface UpdateFoodLogInput {
  log_id: number;
  foodName?: string;
  calories?: number;
  timestamp?: bigint;
  latitude?: number;
  longitude?: number;
}

// Interface for food log query parameters
export interface FoodLogQueryParams {
  log_id?: number;
  user_id?: number;
  foodName?: string;
  startTime?: bigint;
  endTime?: bigint;
  minCalories?: number;
  maxCalories?: number;
}

// Interface for food log with user data
export interface FoodLogWithUser extends FoodLog {
  user?: {
    user_id: number;
    name: string | null;
    email: string | null;
  };
}

// Interface for food log statistics
export interface FoodLogStats {
  user_id: number;
  totalLogs: number;
  totalCalories: number;
  avgCalories: number;
  maxCalories: number;
  minCalories: number;
  startTime: bigint;
  endTime: bigint;
}

// Interface for location-based food log
export interface FoodLogWithLocation extends FoodLog {
  hasLocation: boolean;
  distance?: number; // Distance from a reference point
}
