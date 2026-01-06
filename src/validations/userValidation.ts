import { z, ZodType } from "zod"

export class UserValidation {
    static readonly REGISTER: ZodType = z.object({
        username: z.string().min(3).max(30),
        email: z.string().email(),
        password: z.string().min(6).max(100),
        bmiGoal: z.number().min(10).max(50),
        weight: z.number().positive(),
        height: z.number().positive(),
    })

    static readonly LOGIN: ZodType = z.object({
        email: z.string().email("Email format is invalid!").min(1, "Email can not be empty!"),
        password: z.string().min(8, "Password must contain more than or equal to 8 characters!"),
    })
}