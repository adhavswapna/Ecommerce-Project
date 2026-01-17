import express from "express";
import routes from "./routes/cart-routes";

const app = express();
app.use(express.json());

// Mount at /cart
app.use("/cart", routes);

export default app;
