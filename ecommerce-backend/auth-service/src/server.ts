import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import { connectConsumer } from "./kafka/auth.consumer";

const PORT = process.env.PORT || 3001;

async function startServer() {
  try {
    /*
     * Start Auth Kafka Consumer.
     *
     * This consumer listens for vendor approval events
     * and creates the AuthUser only after approval.
     */
    await connectConsumer();

    app.listen(Number(PORT), "0.0.0.0", () => {
      console.log(
        `🚀 Auth service running on http://127.0.0.1:${PORT}`
      );
    });
  } catch (error) {
    console.error(
      "❌ Failed to start Auth service:",
      error
    );

    process.exit(1);
  }
}

startServer();

