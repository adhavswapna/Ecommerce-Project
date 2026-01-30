import dotenv from "dotenv";
dotenv.config();

import app from "./app";

const PORT = process.env.SERVICE_PORT || 3009;

app.listen(PORT, () => {
  console.log(`📦 Inventory Service running on port ${PORT}`);
});
