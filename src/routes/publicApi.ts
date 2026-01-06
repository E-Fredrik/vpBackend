import express from "express";
import { UserController } from "../controllers/userController";
import { PlaceController } from "../controllers/placeController";
import { FoodController } from "../controllers/foodController";

export const publicRouter = express.Router();

// Health check endpoint
publicRouter.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// User authentication (no token required)
publicRouter.post("/register", UserController.register);
publicRouter.post("/login", UserController.login);

// Places (read-only, public access for browsing)
publicRouter.get("/places", PlaceController.getAll);
publicRouter.get("/places/nearby", PlaceController.getNearby);
publicRouter.get("/places/category/:category", PlaceController.getByCategory);
publicRouter.get("/places/:id", PlaceController.getById);

// Food lookup (read-only, for searching food database)
publicRouter.get("/foods/:food_id", FoodController.getFood);
publicRouter.get("/foods/name/:name", FoodController.getFoodByName);



