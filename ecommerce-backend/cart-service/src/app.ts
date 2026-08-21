import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import routes from "./routes/cart.routes";

const app = express();

/*
 * ======================================================
 * MIDDLEWARE
 * ======================================================
 *
 * CORS is handled by Nginx/API Gateway.
 * DO NOT add cors() here.
 */

app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

/*
 * ======================================================
 * HEALTH CHECK
 * ======================================================
 */

app.get("/health", (_req, res) => {
  return res.status(200).json({
    status: "cart-service running",
  });
});

/*
 * ======================================================
 * CART + WISHLIST ROUTES
 * ======================================================
 */

app.use("/", routes);

/*
 * ======================================================
 * 404
 * ======================================================
 */

app.use((_req, res) => {
  return res.status(404).json({
    message: "Route not found",
  });
});

/*
 * ======================================================
 * ERROR HANDLER
 * ======================================================
 */

app.use(
  (
    err: any,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error("Cart service error:", err);

    if (res.headersSent) {
      return;
    }

    return res.status(500).json({
      message: "Internal server error",
    });
  }
);

export default app;
