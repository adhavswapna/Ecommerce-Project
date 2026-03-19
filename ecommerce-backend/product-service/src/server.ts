import dotenv from "dotenv";
import app from "./app"; // ✅ import configured app

dotenv.config();

const PORT = process.env.PORT || 3003;

app.listen(PORT, () => {
  console.log(`🚀 Product service running on port ${PORT}`);
});
