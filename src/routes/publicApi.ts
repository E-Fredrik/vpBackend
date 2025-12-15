import express from "express";
import { UserController } from "../controllers/userController";
import { FriendController } from "../controllers/friendController";
import { DailySummaryController } from "../controllers/dailySummaryController";
import { PlaceController } from "../controllers/placeController";
import { FoodController } from "../controllers/foodController";
import { FoodLogController } from "../controllers/foodLogController";
import { FoodInLogController } from "../controllers/foodInLogController";
import { ActivityLogController } from "../controllers/activityLogController";
import { VisitLogController } from "../controllers/visitLogController";
import { EmaLogController } from "../controllers/emaLogController";

export const publicRouter = express.Router();

//dumps

//notification routes are protected and moved to private API

//loginregister
publicRouter.post("/register", UserController.register);
publicRouter.post("/login", UserController.login);

// friends routes
publicRouter.post("/friends", FriendController.create);
publicRouter.get("/friends/:id", FriendController.getById);
publicRouter.get("/friends/user/:userId", FriendController.getByUserId);
publicRouter.patch("/friends/:id", FriendController.updateStatus);
publicRouter.delete("/friends/:id", FriendController.delete);

// daily summary routes
publicRouter.post("/daily-summaries", DailySummaryController.create);
publicRouter.get("/daily-summaries/:id", DailySummaryController.getById);
publicRouter.get("/daily-summaries/user/:userId", DailySummaryController.getByUserId);
publicRouter.get("/daily-summaries/user/:userId/date/:date", DailySummaryController.getByUserIdAndDate);
publicRouter.patch("/daily-summaries/:id", DailySummaryController.update);
publicRouter.delete("/daily-summaries/:id", DailySummaryController.delete);

// places
publicRouter.post("/places", PlaceController.create);
publicRouter.get("/places", PlaceController.getAll);
publicRouter.get("/places/nearby", PlaceController.getNearby);
publicRouter.get("/places/category/:category", PlaceController.getByCategory);
publicRouter.get("/places/:id", PlaceController.getById);
publicRouter.patch("/places/:id", PlaceController.update);
publicRouter.delete("/places/:id", PlaceController.delete);

//food routes
publicRouter.post("/foods", FoodController.createFood);
publicRouter.delete("/foods/:id", FoodController.getFood);
publicRouter.post('/createfood', FoodController.createFood);
publicRouter.get('/getfood/:food_id', FoodController.getFood);
publicRouter.get('/getfoodbyname/:name', FoodController.getFoodByName); 

//food logs routes
publicRouter.post("/food-logs", FoodLogController.create);
publicRouter.get("/food-logs/:id", FoodLogController.getById);
publicRouter.get("/food-logs/user/:userId", FoodLogController.getByUserId);
publicRouter.get("/food-logs/user/:userId/range", FoodLogController.getByUserIdAndDateRange);
publicRouter.patch("/food-logs/:id", FoodLogController.update);
publicRouter.delete("/food-logs/:id", FoodLogController.delete);

//foods in foodlog routes
publicRouter.post("/food-in-logs", FoodInLogController.create);
publicRouter.get("/food-in-logs/:id", FoodInLogController.getById);
publicRouter.get("/food-in-logs/log/:logId", FoodInLogController.getByLogId);
publicRouter.patch("/food-in-logs/:id", FoodInLogController.update);
publicRouter.delete("/food-in-logs/:id", FoodInLogController.delete);

//activitylog routes
publicRouter.post("/activity-logs", ActivityLogController.create);
publicRouter.post("/activity-logs/bulk", ActivityLogController.bulkCreate);
publicRouter.get("/activity-logs/:id", ActivityLogController.getById);
publicRouter.get("/activity-logs/user/:userId", ActivityLogController.getByUserId);
publicRouter.get("/activity-logs/user/:userId/current", ActivityLogController.getCurrentActivity);
publicRouter.get("/activity-logs/user/:userId/range", ActivityLogController.getByUserIdAndDateRange);
publicRouter.get("/activity-logs/user/:userId/type/:activityType", ActivityLogController.getByUserIdAndActivityType);
publicRouter.patch("/activity-logs/:id", ActivityLogController.update);
publicRouter.delete("/activity-logs/:id", ActivityLogController.delete);

//visit logs routes
publicRouter.post("/visit-logs", VisitLogController.create);
publicRouter.get("/visit-logs/:id", VisitLogController.getById);
publicRouter.get("/visit-logs/user/:userId", VisitLogController.getByUserId);
publicRouter.get("/visit-logs/place/:placeId", VisitLogController.getByPlaceId);
publicRouter.get("/visit-logs/user/:userId/range", VisitLogController.getByUserIdAndDateRange);
publicRouter.patch("/visit-logs/:id", VisitLogController.update);
publicRouter.delete("/visit-logs/:id", VisitLogController.delete);

//ema log routes
publicRouter.post("/ema-logs", EmaLogController.create);
publicRouter.get("/ema-logs/:id", EmaLogController.getById);
publicRouter.get("/ema-logs/user/:userId", EmaLogController.getByUserId);
publicRouter.get("/ema-logs/user/:userId/range", EmaLogController.getByUserIdAndDateRange);
publicRouter.get("/ema-logs/user/:userId/location", EmaLogController.getByUserIdAndLocation);
publicRouter.patch("/ema-logs/:id", EmaLogController.update);
publicRouter.delete("/ema-logs/:id", EmaLogController.delete);



