import express from "express";
import dotenv from "dotenv";
import emailRoutes from "./routes/email.routes";
import { startEmailConsumer } from "./kafka/email.consumer";

dotenv.config();

const app = express();
app.use(express.json());
app.use("/emails", emailRoutes);

const PORT = process.env.SERVICE_PORT || 3003;

(async () => {
  console.log("🚀 Starting Email Service...");
  await startEmailConsumer();

  app.listen(PORT, () => {
    console.log(`📧 Email-service running on port ${PORT}`);
  });
})();

