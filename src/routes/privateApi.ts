import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { FoodController } from "../controllers/foodController";
import { UserController } from "../controllers/userController";
import { FriendController } from "../controllers/friendController";
import { DailySummaryController } from "../controllers/dailySummaryController";
import { PlaceController } from "../controllers/placeController";
import { FoodLogController } from "../controllers/foodLogController";
import { FoodInLogController } from "../controllers/foodInLogController";
import { ActivityLogController } from "../controllers/activityLogController";
import { VisitLogController } from "../controllers/visitLogController";
import { EmaLogController } from "../controllers/emaLogController";
import { NotificationController } from "../controllers/notificationController";
import { DashboardController } from "../controllers/dashboardController";

export const privateRouter = express.Router();

// Apply authentication middleware to ALL routes in this router
privateRouter.use(authMiddleware);

// ============================================================================
// User Routes (authenticated)
// ============================================================================
privateRouter.get("/profile", UserController.getProfile);
privateRouter.get("/dashboard", DashboardController.getDashboard);
privateRouter.post("/dumpuserdata", UserController.dumpUserData);

// ============================================================================
// Friend Routes (authenticated)
// ============================================================================
privateRouter.post("/friends", FriendController.create);
privateRouter.get("/friends/:id", FriendController.getById);
privateRouter.get("/friends/user/:userId", FriendController.getByUserId);
privateRouter.patch("/friends/:id", FriendController.updateStatus);
privateRouter.delete("/friends/:id", FriendController.delete);
privateRouter.post("/dumpfrienddata", FriendController.dumpFriendData);

// ============================================================================
// Notification Routes (authenticated)
// ============================================================================
privateRouter.get("/notifications/location-check/:userId", NotificationController.checkLocationTriggers);
privateRouter.get("/notification-settings", UserController.getNotificationSettings);
privateRouter.put("/notification-settings", UserController.updateNotificationSettings);

// ============================================================================
// Daily Summary Routes (authenticated)
// ============================================================================
privateRouter.post("/daily-summaries", DailySummaryController.create);
privateRouter.get("/daily-summaries/:id", DailySummaryController.getById);
privateRouter.get("/daily-summaries/user/:userId", DailySummaryController.getByUserId);
privateRouter.get("/daily-summaries/user/:userId/date/:date", DailySummaryController.getByUserIdAndDate);
privateRouter.patch("/daily-summaries/:id", DailySummaryController.update);
privateRouter.delete("/daily-summaries/:id", DailySummaryController.delete);

// ============================================================================
// Place Routes (authenticated - mutations only, reads are public)
// ============================================================================
privateRouter.post("/places", PlaceController.create);
privateRouter.patch("/places/:id", PlaceController.update);
privateRouter.delete("/places/:id", PlaceController.delete);

// ============================================================================
// Food Routes (authenticated)
// ============================================================================
privateRouter.post("/foods", FoodController.createFood);

// ============================================================================
// Food Log Routes (authenticated)
// ============================================================================
privateRouter.post("/food-logs", FoodLogController.createFoodLog);
privateRouter.get("/food-logs/:id", FoodLogController.getFoodLog);
privateRouter.get("/food-logs/user/:userId", FoodLogController.getFoodLogsByUser);
privateRouter.get("/food-logs/user/:userId/range", FoodLogController.getFoodLogsByUserAndDateRange);
privateRouter.patch("/food-logs/:id", FoodLogController.updateFoodLog);
privateRouter.delete("/food-logs/:id", FoodLogController.deleteFoodLog);
// ============================================================================
// Food In Log Routes (authenticated)
// ============================================================================
privateRouter.post("/food-in-logs", FoodInLogController.createFoodInLog);
privateRouter.get("/food-in-logs/:id", FoodInLogController.getFoodInLog);
privateRouter.get("/food-in-logs/log/:logId", FoodInLogController.getFoodInLogsByLogId);
privateRouter.patch("/food-in-logs/:id", FoodInLogController.updateFoodInLog);
privateRouter.delete("/food-in-logs/:id", FoodInLogController.deleteFoodInLog);
// ============================================================================
// Activity Log Routes (authenticated)
// ============================================================================
privateRouter.post("/activity-logs", ActivityLogController.create);
privateRouter.post("/activity-logs/bulk", ActivityLogController.bulkCreate);
privateRouter.get("/activity-logs/:id", ActivityLogController.getById);
privateRouter.get("/activity-logs/user/:userId", ActivityLogController.getByUserId);
privateRouter.get("/activity-logs/user/:userId/current", ActivityLogController.getCurrentActivity);
privateRouter.get("/activity-logs/user/:userId/range", ActivityLogController.getByUserIdAndDateRange);
privateRouter.get("/activity-logs/user/:userId/type/:activityType", ActivityLogController.getByUserIdAndActivityType);
privateRouter.patch("/activity-logs/:id", ActivityLogController.update);
privateRouter.delete("/activity-logs/:id", ActivityLogController.delete);

// ============================================================================
// Visit Log Routes (authenticated)
// ============================================================================
privateRouter.post("/visit-logs", VisitLogController.create);
privateRouter.get("/visit-logs/:id", VisitLogController.getById);
privateRouter.get("/visit-logs/user/:userId", VisitLogController.getByUserId);
privateRouter.get("/visit-logs/place/:placeId", VisitLogController.getByPlaceId);
privateRouter.get("/visit-logs/user/:userId/range", VisitLogController.getByUserIdAndDateRange);
privateRouter.patch("/visit-logs/:id", VisitLogController.update);
privateRouter.delete("/visit-logs/:id", VisitLogController.delete);

// ============================================================================
// EMA Log Routes (authenticated)
// ============================================================================
privateRouter.post("/ema-logs", EmaLogController.create);
privateRouter.get("/ema-logs/:id", EmaLogController.getById);
privateRouter.get("/ema-logs/user/:userId", EmaLogController.getByUserId);
privateRouter.get("/ema-logs/user/:userId/range", EmaLogController.getByUserIdAndDateRange);
privateRouter.get("/ema-logs/user/:userId/location", EmaLogController.getByUserIdAndLocation);
privateRouter.patch("/ema-logs/:id", EmaLogController.update);
privateRouter.delete("/ema-logs/:id", EmaLogController.delete);