// Friend-related enums and interfaces
import { FriendStatus as PrismaFriendStatus } from "../../generated/prisma";

export type FriendStatus = PrismaFriendStatus;
export const FriendStatus = PrismaFriendStatus;

// Main Friend interface matching Prisma schema
export interface Friend {
  friend_id: number;
  requester_id: number;
  addressee_id: number;
  status: FriendStatus;
  createdAt: Date;
}

// Interface for creating a friend request
export interface CreateFriendInput {
  requester_id: number;
  addressee_id: number;
  status?: FriendStatus;
}

// Interface for updating a friend request status
export interface UpdateFriendInput {
  friend_id: number;
  status: FriendStatus;
}

// Interface for friend query parameters
export interface FriendQueryParams {
  friend_id?: number;
  requester_id?: number;
  addressee_id?: number;
  status?: FriendStatus;
  user_id?: number; // For getting all friends of a user (requester or addressee)
}

// Interface for friend response with populated user data
export interface FriendWithUsers extends Friend {
  requester?: {
    user_id: number;
    name: string | null;
    email: string | null;
  };
  addressee?: {
    user_id: number;
    name: string | null;
    email: string | null;
  };
}
