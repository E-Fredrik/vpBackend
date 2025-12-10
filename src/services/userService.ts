import { ResponseError } from "../error/responseError"
import {
    LoginUserRequest,
    RegisterUserRequest,
    toUserResponse,
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
}