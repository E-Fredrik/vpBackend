import express from "express"
import { authMiddleware } from "../middlewares/authMiddleware"
import { FoodController } from "../controllers/foodController"
import { UserController } from "../controllers/userController"
import { FriendController } from "../controllers/friendController"
import { DailySummaryController } from "../controllers/dailySummaryController"
import { PlaceController } from "../controllers/placeController"
import { FoodLogController } from "../controllers/foodLogController"
import { FoodInLogController } from "../controllers/foodInLogController"
import { ActivityLogController } from "../controllers/activityLogController"
import { VisitLogController } from "../controllers/visitLogController"
import { EmaLogController } from "../controllers/emaLogController"
import { NotificationController } from "../controllers/notificationController"
import { DashboardController } from "../controllers/dashboardController"

export const privateRouter = express.Router();

privateRouter.use(authMiddleware);

// User profile & dashboard
privateRouter.get("/profile", UserController.getProfile);
privateRouter.get("/dashboard", DashboardController.getDashboard);

privateRouter.post("/dumpuserdata", UserController.dumpUserData);
privateRouter.post("/dumpfrienddata", FriendController.dumpFriendData);

// notification routes (protected)
privateRouter.get("/notifications/location-check/:userId", NotificationController.checkLocationTriggers);

// friends routes (protected)
privateRouter.post("/friends", FriendController.create);
privateRouter.get("/friends/:id", FriendController.getById);
privateRouter.get("/friends/user/:userId", FriendController.getByUserId);
privateRouter.patch("/friends/:id", FriendController.updateStatus);
privateRouter.delete("/friends/:id", FriendController.delete);

// daily summary routes (protected)
privateRouter.post("/daily-summaries", DailySummaryController.create);
privateRouter.get("/daily-summaries/:id", DailySummaryController.getById);
privateRouter.get("/daily-summaries/user/:userId", DailySummaryController.getByUserId);
privateRouter.get("/daily-summaries/user/:userId/date/:date", DailySummaryController.getByUserIdAndDate);
privateRouter.patch("/daily-summaries/:id", DailySummaryController.update);
privateRouter.delete("/daily-summaries/:id", DailySummaryController.delete);

// places mutations (protected)
privateRouter.post("/places", PlaceController.create);
privateRouter.patch("/places/:id", PlaceController.update);
privateRouter.delete("/places/:id", PlaceController.delete);

// foods (protected - creation only, delete not implemented in controller)
privateRouter.post("/foods", FoodController.createFood);

// food logs (protected)
privateRouter.post("/food-logs", FoodLogController.create);
privateRouter.get("/food-logs/:id", FoodLogController.getById);
privateRouter.get("/food-logs/user/:userId", FoodLogController.getByUserId);
privateRouter.get("/food-logs/user/:userId/range", FoodLogController.getByUserIdAndDateRange);
privateRouter.patch("/food-logs/:id", FoodLogController.update);
privateRouter.delete("/food-logs/:id", FoodLogController.delete);

// foods in foodlog (protected)
privateRouter.post("/food-in-logs", FoodInLogController.create);
privateRouter.get("/food-in-logs/:id", FoodInLogController.getById);
privateRouter.get("/food-in-logs/log/:logId", FoodInLogController.getByLogId);
privateRouter.patch("/food-in-logs/:id", FoodInLogController.update);
privateRouter.delete("/food-in-logs/:id", FoodInLogController.delete);

// activity logs (protected)
privateRouter.post("/activity-logs", ActivityLogController.create);
privateRouter.post("/activity-logs/bulk", ActivityLogController.bulkCreate);
privateRouter.get("/activity-logs/:id", ActivityLogController.getById);
privateRouter.get("/activity-logs/user/:userId", ActivityLogController.getByUserId);
privateRouter.get("/activity-logs/user/:userId/current", ActivityLogController.getCurrentActivity);
privateRouter.get("/activity-logs/user/:userId/range", ActivityLogController.getByUserIdAndDateRange);
privateRouter.get("/activity-logs/user/:userId/type/:activityType", ActivityLogController.getByUserIdAndActivityType);
privateRouter.patch("/activity-logs/:id", ActivityLogController.update);
privateRouter.delete("/activity-logs/:id", ActivityLogController.delete);

// visit logs (protected)
privateRouter.post("/visit-logs", VisitLogController.create);
privateRouter.get("/visit-logs/:id", VisitLogController.getById);
privateRouter.get("/visit-logs/user/:userId", VisitLogController.getByUserId);
privateRouter.get("/visit-logs/place/:placeId", VisitLogController.getByPlaceId);
privateRouter.get("/visit-logs/user/:userId/range", VisitLogController.getByUserIdAndDateRange);
privateRouter.patch("/visit-logs/:id", VisitLogController.update);
privateRouter.delete("/visit-logs/:id", VisitLogController.delete);

// ema logs (protected)
privateRouter.post("/ema-logs", EmaLogController.create);
privateRouter.get("/ema-logs/:id", EmaLogController.getById);
privateRouter.get("/ema-logs/user/:userId", EmaLogController.getByUserId);
privateRouter.get("/ema-logs/user/:userId/range", EmaLogController.getByUserIdAndDateRange);
privateRouter.get("/ema-logs/user/:userId/location", EmaLogController.getByUserIdAndLocation);
privateRouter.patch("/ema-logs/:id", EmaLogController.update);
privateRouter.delete("/ema-logs/:id", EmaLogController.delete);