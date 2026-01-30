import dotenv from "dotenv";
dotenv.config();

import app from "./app";

const PORT = Number(process.env.SERVICE_PORT) || 3007;

app.listen(PORT, () => {
  console.log(`💳 Payment service running on port ${PORT}`);
});
