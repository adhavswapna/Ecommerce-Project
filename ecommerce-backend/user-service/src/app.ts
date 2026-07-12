import express from "express";
import userRoutes from "./routes/user.routes";

const app = express();

app.use(express.json());


// Health check
app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "user-service running",
  });
});


app.use("/users", userRoutes);


export default app;
