import express from "express";
import dotenv from "dotenv";
import emailRoutes from "./routes/email.routes";

dotenv.config();

const app = express();

app.use(express.json());

// email routes
app.use("/api/email", emailRoutes);

const PORT = process.env.PORT || 3003;

app.listen(PORT, () => {
  console.log(`📧 Email service running on port ${PORT}`);
});

