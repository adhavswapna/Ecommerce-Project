import express from "express";
import dotenv from "dotenv";
import { getUserProducer } from "./kafka/kafka.client"; // ✅ correct import
import { UserController } from "./controllers/user.controller";

dotenv.config();

const app = express();
app.use(express.json());

// Routes
app.post("/users/register", UserController.register);
app.post("/users/verify/:id", UserController.verify);
app.post("/users/login", UserController.login);
app.put("/users/profile/:id", UserController.updateProfile);
app.post("/users/password/reset/request", UserController.passwordResetRequest);
app.post("/users/password/reset/complete", UserController.passwordResetComplete);
app.delete("/users/:id", UserController.deleteUser);

async function startServer() {
  // ✅ Connect Kafka producer
  await getUserProducer();

  const port = process.env.PORT || 3002;
  app.listen(port, () => {
    console.log(`👤 User-service running on port ${port}`);
  });
}

startServer().catch((err) => {
  console.error("❌ Failed to start User Service", err);
  process.exit(1);
});

