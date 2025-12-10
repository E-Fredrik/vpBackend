import express from "express";
import { UserController } from "../controllers/user-controller";
import { FoodLogController } from "../controllers/food-log-controller";
import { ActivityLogController } from "../controllers/activity-log-controller";
import { PlaceController } from "../controllers/place-controller";
import { FriendController } from "../controllers/friend-controller";
import { VisitLogController } from "../controllers/visit-log-controller";
import { EMALogController } from "../controllers/ema-log-controller";
import { DailySummaryController } from "../controllers/daily-summary-controller";

export const publicRouter = express.Router();

// User routes
publicRouter.post("/users", UserController.create);
publicRouter.get("/users", UserController.getAll);
publicRouter.get("/users/:id", UserController.getById);
publicRouter.patch("/users/:id", UserController.update);
publicRouter.delete("/users/:id", UserController.delete);

// Food log routes
publicRouter.post("/food-logs", FoodLogController.create);
publicRouter.get("/food-logs", FoodLogController.getAll);
publicRouter.get("/food-logs/:id", FoodLogController.getById);
publicRouter.get("/food-logs/user/:userId", FoodLogController.getByUser);
publicRouter.patch("/food-logs/:id", FoodLogController.update);
publicRouter.delete("/food-logs/:id", FoodLogController.delete);

// Activity log routes
publicRouter.post("/activity-logs", ActivityLogController.create);
publicRouter.get("/activity-logs", ActivityLogController.getAll);
publicRouter.get("/activity-logs/:id", ActivityLogController.getById);
publicRouter.get("/activity-logs/user/:userId", ActivityLogController.getByUser);
publicRouter.patch("/activity-logs/:id", ActivityLogController.update);
publicRouter.delete("/activity-logs/:id", ActivityLogController.delete);

// Place routes
publicRouter.post("/places", PlaceController.create);
publicRouter.get("/places", PlaceController.getAll);
publicRouter.get("/places/:id", PlaceController.getById);
publicRouter.get("/places/category/:category", PlaceController.getByCategory);
publicRouter.patch("/places/:id", PlaceController.update);
publicRouter.delete("/places/:id", PlaceController.delete);

// Friend routes
publicRouter.post("/friends", FriendController.create);
publicRouter.get("/friends", FriendController.getAll);
publicRouter.get("/friends/:id", FriendController.getById);
publicRouter.get("/friends/user/:userId", FriendController.getByUser);
publicRouter.patch("/friends/:id/status", FriendController.updateStatus);
publicRouter.delete("/friends/:id", FriendController.delete);

// Visit log routes
publicRouter.post("/visit-logs", VisitLogController.create);
publicRouter.get("/visit-logs", VisitLogController.getAll);
publicRouter.get("/visit-logs/:id", VisitLogController.getById);
publicRouter.get("/visit-logs/user/:userId", VisitLogController.getByUser);
publicRouter.get("/visit-logs/place/:placeId", VisitLogController.getByPlace);
publicRouter.patch("/visit-logs/:id", VisitLogController.update);
publicRouter.delete("/visit-logs/:id", VisitLogController.delete);

// EMA log routes
publicRouter.post("/ema-logs", EMALogController.create);
publicRouter.get("/ema-logs", EMALogController.getAll);
publicRouter.get("/ema-logs/:id", EMALogController.getById);
publicRouter.get("/ema-logs/user/:userId", EMALogController.getByUser);
publicRouter.patch("/ema-logs/:id", EMALogController.update);
publicRouter.delete("/ema-logs/:id", EMALogController.delete);

// Daily summary routes
publicRouter.post("/daily-summaries", DailySummaryController.create);
publicRouter.get("/daily-summaries", DailySummaryController.getAll);
publicRouter.get("/daily-summaries/:id", DailySummaryController.getById);
publicRouter.get("/daily-summaries/user/:userId", DailySummaryController.getByUser);
publicRouter.patch("/daily-summaries/:id", DailySummaryController.update);
publicRouter.delete("/daily-summaries/:id", DailySummaryController.delete);
