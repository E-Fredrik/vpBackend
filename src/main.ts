import express from "express";
import { PORT } from "./utils/env-util";
import { publicRouter } from "./routes/public-router";
import { errorMiddleware } from "./middlewares/error-middleware";

const app = express();

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use("/api", publicRouter);

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    errors: "Route not found"
  });
});

// Error handling middleware - must be last
app.use(errorMiddleware);

app.listen(PORT || 3000, () => {
  console.log(`Server running on port ${PORT || 3000}`);
});