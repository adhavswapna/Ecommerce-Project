import dotenv from "dotenv";
dotenv.config();

import app from "./app";

const PORT = process.env.PORT || 3016;

app.listen(PORT, () => {
  console.log(`🚀 Refund Service running on port ${PORT}`);
});
