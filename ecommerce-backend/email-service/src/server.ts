import "dotenv/config";
import app from "./app";

const PORT = Number(process.env.PORT);

app.get("/health", (_req, res) => {
  res.json({ status: "UP", service: process.env.SERVICE_NAME });
});

app.listen(PORT, () => {
  console.log(`🚀 ${process.env.SERVICE_NAME} running on ${PORT}`);
});

