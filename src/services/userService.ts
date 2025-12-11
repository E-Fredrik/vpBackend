import { request } from "https"
import { ResponseError } from "../error/responseError"
import {
    LoginUserRequest,
    RegisterUserRequest,
    toUserResponse,
    UserDataDump,
    UserResponse,
} from "../models/userModel"

import { prismaClient } from "../utils/databaseUtil"
import { UserValidation } from "../validations/userValidation"
import { Validation } from "../validations/validation"
import bcrypt from "bcrypt"

export class UserService {
    static async register(request: RegisterUserRequest): Promise<UserResponse> {
        const validatedData = Validation.validate(
            UserValidation.REGISTER,
            request
        )

        const email = await prismaClient.user.findUnique({
            where: { email: validatedData.email },
        })
        
        if (email) {
            throw new ResponseError(400, "Email already in use!")
        }

        validatedData.password = await bcrypt.hash(
            validatedData.password,
            10
        )

        const user = await prismaClient.user.create({
            data: {
                username: validatedData.username,
                email: validatedData.email,
                password: validatedData.password,
                bmiGoal: validatedData.bmiGoal,
                weight: validatedData.weight,
                height: validatedData.height,
            },
        })

        return toUserResponse(user.user_id, user.username, user.email)
    }

    static async login(request: LoginUserRequest): Promise<UserResponse> {
        const validatedData = Validation.validate(UserValidation.LOGIN, request)

        const user = await prismaClient.user.findFirst({
            where: {
                email: validatedData.email,
            }
        })

        if (!user) {
            throw new ResponseError(400, "Invalid email or password!")
        }

        const isPasswordValid = await bcrypt.compare(
            validatedData.password,
            user.password
        )

        if (!isPasswordValid) {
            throw new ResponseError(400, "Invalid email or password!")
        }
        
        return toUserResponse(user.user_id, user.username, user.email)
    }

    static async dumpUserData(request: LoginUserRequest, { days }: { days: number }): Promise<UserDataDump> {
        console.log("UserService.dumpUserData called");
        const validatedData = Validation.validate(UserValidation.LOGIN, request);
        console.log("UserService.dumpUserData validatedData:", { email: validatedData.email });

        const user = await prismaClient.user.findFirst({
            where: { email: validatedData.email },
            include: {
                dailySummaries: true,
                foodLogs: {
                    include: {
                        foodInLogs: {
                            include: { food: true }
                        }
                    }
                },
                activityRecords: true,
                visitRecords: { include: { place: true } },
                emaLogs: true
            }
        });

        console.log("UserService.dumpUserData found user:", user ? { user_id: user.user_id, email: user.email } : null);

        if (!user) {
            throw new ResponseError(400, "Invalid email or password!");
        }

        const isPasswordValid = await bcrypt.compare(
            validatedData.password,
            user.password
        );

        console.log("UserService.dumpUserData password valid:", isPasswordValid);

        if (!isPasswordValid) {
            throw new ResponseError(400, "Invalid email or password!");
        }

        // Serialize BigInt to Number for JSON
        const serialize = (data: any) =>
            JSON.parse(
                JSON.stringify(data, (key, value) =>
                    typeof value === "bigint" ? Number(value) : value
                )
            );

        const result = serialize({
            userId: user.user_id,
            username: user.username,
            email: user.email,
            bmiGoal: user.bmiGoal || 0,
            weight: user.weight || 0,
            height: user.height || 0,
            dailySummaries: user.dailySummaries || [],
            foodLogs: user.foodLogs || [],
            activityLogs: user.activityRecords || [],
            visitLogs: user.visitRecords || [],
            emaLogs: user.emaLogs || []
        });
        console.log("UserService.dumpUserData returning payload");
        return result;
    }
}