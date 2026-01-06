import { z, ZodType } from "zod";

export class FriendValidation {
    static readonly CREATE: ZodType = z.object({
        requester_id: z.number().int().positive(),
        addressee_id: z.number().int().positive(),
    });

    static readonly UPDATE: ZodType = z.object({
        status: z.enum(["PENDING", "ACCEPTED", "DECLINED", "BLOCKED"]),
    });
}
