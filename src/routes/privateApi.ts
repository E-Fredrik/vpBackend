import express from "express"
import { authMiddleware } from "../middlewares/authMiddleware"
import { FoodController } from "../controllers/foodController"
import { UserController } from "../controllers/userController"
import { FriendController } from "../controllers/friendController"

export const privateRouter = express.Router();

privateRouter.use(authMiddleware);

privateRouter.post("/dumpuserdata", UserController.dumpUserData);
privateRouter.post("/dumpfrienddata", FriendController.dumpFriendData);