// Activity Log interfaces

// Main Activity_Log interface matching Prisma schema
export interface ActivityLog {
  activity_id: number;
  user_id: number;
  activityType: string;
  startTime: bigint;
  endTime: bigint;
  confidence: number;
}

// Interface for creating an activity log entry
export interface CreateActivityLogInput {
  user_id: number;
  activityType: string;
  startTime: bigint;
  endTime: bigint;
  confidence: number;
}

// Interface for updating an activity log entry
export interface UpdateActivityLogInput {
  activity_id: number;
  activityType?: string;
  startTime?: bigint;
  endTime?: bigint;
  confidence?: number;
}

// Interface for activity log query parameters
export interface ActivityLogQueryParams {
  activity_id?: number;
  user_id?: number;
  activityType?: string;
  startTime?: bigint;
  endTime?: bigint;
  minConfidence?: number;
  maxConfidence?: number;
}

// Interface for activity log with user data
export interface ActivityLogWithUser extends ActivityLog {
  user?: {
    user_id: number;
    name: string | null;
    email: string | null;
  };
}

// Interface for activity log with duration
export interface ActivityLogWithDuration extends ActivityLog {
  durationMinutes: number;
  durationHours: number;
}

// Interface for activity log statistics
export interface ActivityLogStats {
  user_id: number;
  activityType: string;
  totalSessions: number;
  totalDurationMinutes: number;
  avgDurationMinutes: number;
  avgConfidence: number;
  firstActivity: bigint;
  lastActivity: bigint;
}

// Interface for activity type summary
export interface ActivityTypeSummary {
  activityType: string;
  count: number;
  totalDurationMinutes: number;
  avgConfidence: number;
}

// Common activity types enum (can be extended)
export enum CommonActivityType {
  WALKING = 'WALKING',
  RUNNING = 'RUNNING',
  CYCLING = 'CYCLING',
  SITTING = 'SITTING',
  STANDING = 'STANDING',
  DRIVING = 'DRIVING',
  EXERCISE = 'EXERCISE',
  SLEEPING = 'SLEEPING',
  UNKNOWN = 'UNKNOWN'
}
