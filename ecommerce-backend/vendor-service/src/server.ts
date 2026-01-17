import app from "./app";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 3011;

app.listen(PORT, () => {
  console.log(`Vendor service running on port ${PORT}`);
});
