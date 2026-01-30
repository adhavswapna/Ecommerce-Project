import dotenv from "dotenv";
import app from "./app"; // your Express app

dotenv.config(); // load .env

const port = Number(process.env.SERVICE_PORT) || 300; // use SERVICE_PORT from .env

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
