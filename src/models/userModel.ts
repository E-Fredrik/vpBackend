import { string } from 'zod'
import { generateToken } from '../utils/jwtUtils'

export interface UserJWTPayload {
    id: number
    username: string
    email: string
}

export interface RegisterUserRequest {
    username: string
    email: string
    password: string
    bmiGoal: number
    weight: number
    height: number
}

export interface LoginUserRequest {
    email: string
    password: string
}

export interface UserResponse {
    token?: string
}

export interface UserDataDump {
    userId: number;
    username: string;
    email: string;
    bmiGoal: number;
    weight: number;
    height: number;
    dailySummaries: any[];
    foodLogs: any[];
    activityLogs: any[];
    visitLogs: any[];
    emaLogs: any[];
}

export function toUserResponse(
    id: number,
    username: string,
    email: string,
) : UserResponse {
    return {
        token: generateToken(
            {
                id: id,
                username: username,
                email: email,
            },
            "1h"
        )
    }
}