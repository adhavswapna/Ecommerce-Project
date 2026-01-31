import express from "express";
import emailRoutes from "./routes/email.routes";

const app = express();

app.use(express.json());

app.use("/emails", emailRoutes);

app.get("/health", (_, res) => {
  res.json({ status: "email-service up" });
});

export default app;
