import express from "express";
import routes from "./routes/order-routes";

const app = express();
app.use(express.json());
app.use("/", routes);

export default app;

