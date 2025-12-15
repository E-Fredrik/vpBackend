import express from "express";
import { PORT } from "./utils/env-util";
import { publicRouter } from "./routes/publicApi";
import { privateRouter } from "./routes/privateApi"
import { errorMiddleware } from "./middlewares/errorMiddleware";


const app = express()
app.use(express.json())

app.use('/api', publicRouter)
app.use('/api', privateRouter)


app.use(errorMiddleware)

app.listen(PORT || 3000, () => {
    console.log(`Server running on port ${PORT || 3000}`);
});