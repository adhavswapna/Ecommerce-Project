import dotenv from "dotenv";
dotenv.config();

import app from "./app";

const PORT = process.env.PORT || 3001;

app.listen(Number(PORT), "0.0.0.0", () => {
  console.log(`🚀 Auth service running on http://127.0.0.1:${PORT}`);
});

