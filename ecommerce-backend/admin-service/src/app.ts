import express from "express";
import cors from "cors";
import helmet from "helmet";
import { requestLogger } from "./middlewares/requestLogger.middleware";
import { errorHandler } from "./middlewares/error.middleware";
import adminRoutes from "./routes/admin.routes";

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(requestLogger);

app.use("/admin", adminRoutes);

app.use(errorHandler);

export default app;
