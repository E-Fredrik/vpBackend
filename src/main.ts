import express from "express";
import cors from "cors";
import { PORT } from "./utils/env-util";
import { publicRouter } from "./routes/publicApi";
import { privateRouter } from "./routes/privateApi"
import { errorMiddleware } from "./middlewares/errorMiddleware";


const app = express()

// Add CORS middleware
app.use(cors({
    origin: process.env.CORS_ORIGIN || '*', // Add CORS_ORIGIN to env vars
    credentials: true
}));

app.use(express.json())

app.use('/api', publicRouter)
app.use('/api', privateRouter)


app.use(errorMiddleware)

const port = parseInt(PORT || '3000', 10);
const host = process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost';

app.listen(port, host, () => {
    console.log(`Server running on ${host}:${port}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});