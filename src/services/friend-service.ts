import { prismaClient } from "../utils/database-util";
import { CreateFriendInput, UpdateFriendInput, Friend, FriendQueryParams } from "../models/friendModel";
import { NotFoundError, ConflictError } from "../error/response-error";
import { FriendValidation } from "../validations/friend-validation";

export class FriendService {
  static async create(data: CreateFriendInput): Promise<Friend> {
    const validatedData = FriendValidation.CREATE.parse(data);
    
    // Check if friendship already exists
    const existing = await prismaClient.friend.findFirst({
      where: {
        OR: [
          { requester_id: validatedData.requester_id, addressee_id: validatedData.addressee_id },
          { requester_id: validatedData.addressee_id, addressee_id: validatedData.requester_id }
        ]
      }
    });

    if (existing) {
      throw new ConflictError("Friend request already exists");
    }

    return await prismaClient.friend.create({
      data: validatedData
    });
  }

  static async getAll(): Promise<Friend[]> {
    return await prismaClient.friend.findMany({
      include: {
        requester: { select: { user_id: true, name: true, email: true } },
        addressee: { select: { user_id: true, name: true, email: true } }
      }
    });
  }

  static async getById(id: number): Promise<Friend> {
    const friend = await prismaClient.friend.findUnique({
      where: { friend_id: id },
      include: {
        requester: { select: { user_id: true, name: true, email: true } },
        addressee: { select: { user_id: true, name: true, email: true } }
      }
    });

    if (!friend) {
      throw new NotFoundError("Friend");
    }

    return friend;
  }

  static async getByUser(userId: number): Promise<Friend[]> {
    return await prismaClient.friend.findMany({
      where: {
        OR: [
          { requester_id: userId },
          { addressee_id: userId }
        ]
      },
      include: {
        requester: { select: { user_id: true, name: true, email: true } },
        addressee: { select: { user_id: true, name: true, email: true } }
      }
    });
  }

  static async updateStatus(id: number, data: { status: any }): Promise<Friend> {
    const validatedData = FriendValidation.UPDATE_STATUS.parse(data);
    
    await this.getById(id);

    return await prismaClient.friend.update({
      where: { friend_id: id },
      data: validatedData
    });
  }

  static async delete(id: number): Promise<void> {
    await this.getById(id);
    
    await prismaClient.friend.delete({
      where: { friend_id: id }
    });
  }
}
