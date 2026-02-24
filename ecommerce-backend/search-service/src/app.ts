import express from "express";
import searchRoutes from "./routes/search.routes";
import { errorMiddleware } from "./middlewares/error.middleware";


const app = express();


app.use(express.json());


app.use("/search", searchRoutes);


app.use(errorMiddleware);


export default app;