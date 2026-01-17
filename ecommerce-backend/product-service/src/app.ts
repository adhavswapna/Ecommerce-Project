import express from "express";
import routes from "./routes/product-routes";

const app = express();
app.use(express.json());
app.use("/", routes); // <- mounted at "/"

export default app;
