import { z } from "zod";
import { FriendStatus } from "../models/friendModel";

export class FriendValidation {
  static readonly CREATE = z.object({
    requester_id: z.number().int().positive(),
    addressee_id: z.number().int().positive(),
    status: z.nativeEnum(FriendStatus).optional()
  }).refine(data => data.requester_id !== data.addressee_id, {
    message: "Cannot send friend request to yourself"
  });

  static readonly UPDATE_STATUS = z.object({
    status: z.nativeEnum(FriendStatus)
  });
}
