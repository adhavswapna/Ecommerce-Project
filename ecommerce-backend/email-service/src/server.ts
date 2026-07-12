import express from "express";
import dotenv from "dotenv";
import emailRoutes from "./routes/email.routes";
import { startEmailConsumer } from "./kafka/email.consumer";

dotenv.config();

const app = express();

app.use(express.json());

/* ===============================
   ROUTES
================================ */

// email APIs
app.use("/email", emailRoutes);


// health check
app.get("/health", (_req, res) => {
  res.json({
    status: "UP",
    service: "Email Service",
  });
});


const PORT = Number(process.env.SERVICE_PORT) || 3004;


(async () => {

  try {

    console.log("🚀 Starting Email Service...");

    await startEmailConsumer();


    app.listen(PORT, () => {
      console.log(`📧 Email-service running on port ${PORT}`);
    });


  } catch (error) {

    console.error("Email service failed:", error);
    process.exit(1);

  }

})();
