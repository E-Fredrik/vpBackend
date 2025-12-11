import { ResponseError } from "../error/responseError";
import { prismaClient } from "../utils/databaseUtil";
import { Validation } from "../validations/validation";
import { FriendValidation } from "../validations/friendValidation";
import { LoginUserRequest } from "../models/userModel";
import { UserValidation } from "../validations/userValidation";
import bcrypt from "bcrypt";
import { toFriendResponse } from "../models/friendModel";

export interface CreateFriendRequest {
    requester_id: number;
    addressee_id: number;
}

export interface UpdateFriendRequest {
    status: "PENDING" | "ACCEPTED" | "DECLINED" | "BLOCKED";
}

export class FriendService {
    static async create(request: CreateFriendRequest) {
        const validatedData = Validation.validate(FriendValidation.CREATE, request);

        // Check if both users exist
        const [requester, addressee] = await Promise.all([
            prismaClient.user.findUnique({ where: { user_id: validatedData.requester_id } }),
            prismaClient.user.findUnique({ where: { user_id: validatedData.addressee_id } }),
        ]);

        if (!requester || !addressee) {
            throw new ResponseError(404, "User not found");
        }

        if (validatedData.requester_id === validatedData.addressee_id) {
            throw new ResponseError(400, "Cannot send friend request to yourself");
        }

        // Check if friendship already exists
        const existingFriendship = await prismaClient.friend.findFirst({
            where: {
                OR: [
                    { requester_id: validatedData.requester_id, addressee_id: validatedData.addressee_id },
                    { requester_id: validatedData.addressee_id, addressee_id: validatedData.requester_id },
                ],
            },
        });

        if (existingFriendship) {
            throw new ResponseError(400, "Friendship already exists");
        }

        return prismaClient.friend.create({
            data: validatedData,
            include: {
                requester: { select: { user_id: true, username: true } },
                addressee: { select: { user_id: true, username: true } },
            },
        });
    }

    static async getById(friendId: number) {
        const friend = await prismaClient.friend.findUnique({
            where: { friend_id: friendId },
            include: {
                requester: { select: { user_id: true, username: true } },
                addressee: { select: { user_id: true, username: true } },
            },
        });

        if (!friend) {
            throw new ResponseError(404, "Friendship not found");
        }

        return friend;
    }

    static async getByUserId(userId: number) {
        return prismaClient.friend.findMany({
            where: {
                OR: [{ requester_id: userId }, { addressee_id: userId }],
            },
            include: {
                requester: { select: { user_id: true, username: true } },
                addressee: { select: { user_id: true, username: true } },
            },
        });
    }

    static async updateStatus(friendId: number, request: UpdateFriendRequest) {
        const validatedData = Validation.validate(FriendValidation.UPDATE, request);

        const existing = await prismaClient.friend.findUnique({
            where: { friend_id: friendId },
        });

        if (!existing) {
            throw new ResponseError(404, "Friendship not found");
        }

        return prismaClient.friend.update({
            where: { friend_id: friendId },
            data: { status: validatedData.status },
            include: {
                requester: { select: { user_id: true, username: true } },
                addressee: { select: { user_id: true, username: true } },
            },
        });
    }

    static async delete(friendId: number) {
        const existing = await prismaClient.friend.findUnique({
            where: { friend_id: friendId },
        });

        if (!existing) {
            throw new ResponseError(404, "Friendship not found");
        }

        return prismaClient.friend.delete({
            where: { friend_id: friendId },
        });
    }

    // Dump friend data for an authenticated user (by email/password)
    static async dumpFriendData(request: LoginUserRequest) {
        const validatedData = Validation.validate(UserValidation.LOGIN, request);

        const user = await prismaClient.user.findFirst({
            where: { email: validatedData.email },
        });

        if (!user) {
            throw new ResponseError(400, "Invalid email or password!");
        }

        const isPasswordValid = await bcrypt.compare(validatedData.password, user.password);
        if (!isPasswordValid) {
            throw new ResponseError(400, "Invalid email or password!");
        }

        const friendships = await prismaClient.friend.findMany({
            where: {
                OR: [{ requester_id: user.user_id }, { addressee_id: user.user_id }],
            },
            include: {
                requester: { select: { user_id: true, username: true, email: true } },
                addressee: { select: { user_id: true, username: true, email: true } },
            },
            orderBy: { createdAt: "desc" },
        });

        const friends = friendships.map((f) => toFriendResponse(f));

        return {
            userId: user.user_id,
            username: user.username,
            email: user.email,
            friends,
            metadata: {
                totalFriends: friends.length,
                exportedAt: new Date().toISOString(),
            },
        };
    }
}
