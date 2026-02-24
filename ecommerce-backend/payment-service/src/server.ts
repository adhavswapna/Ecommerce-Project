// src/server.ts
import "dotenv/config";
import app from "./app";

const PORT = process.env.PORT || 3007;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Payment Service running on port ${PORT}`);
});
