import "dotenv/config";
import app from "./app";

const port = Number(process.env.SERVICE_PORT) || 3010;

app.listen(port, () => {
  console.log(`🚀 Invoice service running on port ${port}`);
});
