// Visit Log interfaces

// Main Visit_Log interface matching Prisma schema
export interface VisitLog {
  visit_id: number;
  user_id: number;
  place_id: number;
  entryTime: bigint;
  exitTime: bigint;
  durationMins: number;
}

// Interface for creating a visit log entry
export interface CreateVisitLogInput {
  user_id: number;
  place_id: number;
  entryTime: bigint;
  exitTime: bigint;
  durationMins: number;
}

// Interface for updating a visit log entry
export interface UpdateVisitLogInput {
  visit_id: number;
  entryTime?: bigint;
  exitTime?: bigint;
  durationMins?: number;
}

// Interface for visit log query parameters
export interface VisitLogQueryParams {
  visit_id?: number;
  user_id?: number;
  place_id?: number;
  startTime?: bigint;
  endTime?: bigint;
  minDuration?: number;
  maxDuration?: number;
}

// Interface for visit log with user and place data
export interface VisitLogWithDetails extends VisitLog {
  user?: {
    user_id: number;
    name: string | null;
    email: string | null;
  };
  place?: {
    place_id: number;
    name: string;
    category: string;
    latitude: number;
    longitude: number;
  };
}

// Interface for visit log statistics by user
export interface VisitLogStatsByUser {
  user_id: number;
  totalVisits: number;
  totalDurationMinutes: number;
  avgDurationMinutes: number;
  mostVisitedPlaces: {
    place_id: number;
    place_name: string;
    visitCount: number;
  }[];
  firstVisit: bigint;
  lastVisit: bigint;
}

// Interface for visit log statistics by place
export interface VisitLogStatsByPlace {
  place_id: number;
  place_name: string;
  totalVisits: number;
  uniqueVisitors: number;
  avgDurationMinutes: number;
  totalDurationMinutes: number;
  firstVisit: bigint;
  lastVisit: bigint;
}

// Interface for active visit (user currently at a place)
export interface ActiveVisit {
  visit_id: number;
  user_id: number;
  place_id: number;
  place_name: string;
  entryTime: bigint;
  currentDurationMins: number;
}
