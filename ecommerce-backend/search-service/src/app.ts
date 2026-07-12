import express from "express";
import searchRoutes from "./routes/search.routes";
import { errorMiddleware } from "./middlewares/error.middleware";

const app = express();

app.use(express.json());

/* ================= HEALTH ================= */

app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "UP",
    service: "Search Service",
  });
});


/* ================= ROUTES ================= */

app.use("/search", searchRoutes);


/* ================= ERROR ================= */

app.use(errorMiddleware);


export default app;
