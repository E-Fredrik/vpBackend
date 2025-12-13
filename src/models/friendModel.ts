export type FriendStatus = "PENDING" | "ACCEPTED" | "DECLINED" | "BLOCKED";

export interface FriendCreateRequest {
  requesterId: number;
  addresseeId: number;
}

export interface FriendUpdateRequest {
  status: FriendStatus;
}

export interface FriendResponse {
  friendId: number;
  requester: { userId: number; username: string };
  addressee: { userId: number; username: string };
  status: FriendStatus;
  createdAt: string;
}

export function toFriendResponse(raw: any): FriendResponse {
  return {
    friendId: raw.friend_id,
    requester: raw.requester
      ? { userId: raw.requester.user_id, username: raw.requester.username }
      : { userId: raw.requester_id, username: "" },
    addressee: raw.addressee
      ? { userId: raw.addressee.user_id, username: raw.addressee.username }
      : { userId: raw.addressee_id, username: "" },
    status: raw.status as FriendStatus,
    createdAt: raw.createdAt ? new Date(raw.createdAt).toISOString() : new Date().toISOString(),
  };
}

export interface FriendDataDump {
  userId: number;
  username: string;
  email: string;
  friends: FriendResponse[];
}
