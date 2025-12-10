// Daily Summary interfaces

// Main Daily_Summary interface matching Prisma schema
export interface DailySummary {
  summary_id: number;
  user_id: number;
  date: Date;
  totalCaloriesIn: number;
}

// Interface for creating a daily summary
export interface CreateDailySummaryInput {
  user_id: number;
  date: Date;
  totalCaloriesIn: number;
}

// Interface for updating a daily summary
export interface UpdateDailySummaryInput {
  summary_id: number;
  totalCaloriesIn?: number;
  date?: Date;
}

// Interface for daily summary query parameters
export interface DailySummaryQueryParams {
  summary_id?: number;
  user_id?: number;
  date?: Date;
  startDate?: Date;
  endDate?: Date;
}

// Interface for daily summary response with user data
export interface DailySummaryWithUser extends DailySummary {
  user?: {
    user_id: number;
    name: string | null;
    email: string | null;
  };
}

// Interface for aggregated summary statistics
export interface DailySummaryStats {
  user_id: number;
  totalDays: number;
  avgCaloriesIn: number;
  maxCaloriesIn: number;
  minCaloriesIn: number;
  startDate: Date;
  endDate: Date;
}
