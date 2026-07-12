import dotenv from "dotenv";

dotenv.config();

import app from "./app";


const PORT = Number(process.env.PORT) || 3013;


app.listen(PORT, () => {
  console.log(`🔍 Search Service running on port ${PORT}`);
});
