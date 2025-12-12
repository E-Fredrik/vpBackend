import express from "express";
import { PORT } from "./utils/env-util";
import { publicRouter } from "./routes/publicApi";
import { errorMiddleware } from "./middlewares/errorMiddleware";
import { privateRouter } from "./routes/privateApi";

const app = express()
app.use(express.json())

app.use('/api', publicRouter)
app.use('/api', privateRouter)


app.use(errorMiddleware)

app.listen(PORT || 3000, () => {
    console.log(`Connected to port ${PORT || 3000}`);
});