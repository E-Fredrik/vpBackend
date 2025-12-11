export type FriendStatus = "PENDING" | "ACCEPTED" | "DECLINED" | "BLOCKED";

export interface FriendCreateRequest {
  requester_id: number;
  addressee_id: number;
}

export interface FriendUpdateRequest {
  status: FriendStatus;
}

export interface FriendResponse {
  friend_id: number;
  requester: { user_id: number; username: string };
  addressee: { user_id: number; username: string };
  status: FriendStatus;
  createdAt: string;
}


export function toFriendResponse(raw: any): FriendResponse {
  return {
    friend_id: raw.friend_id,
    requester: raw.requester ? { user_id: raw.requester.user_id, username: raw.requester.username } : { user_id: raw.requester_id, username: "" },
    addressee: raw.addressee ? { user_id: raw.addressee.user_id, username: raw.addressee.username } : { user_id: raw.addressee_id, username: "" },
    status: raw.status as FriendStatus,
    createdAt: raw.createdAt ? new Date(raw.createdAt).toISOString() : new Date().toISOString(),
  };
}
