import { Request } from "express";
import { UserJWTPayload } from "./userModel"

export interface UserRequest extends Request {
    user?: UserJWTPayload //Untuk memanggil data-data user
}
