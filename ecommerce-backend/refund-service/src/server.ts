import "dotenv/config";
import app from "./app";
import { startRefundConsumer } from "./kafka/refund.consumer";

const PORT = process.env.PORT || 3016;

app.listen(PORT, async () => {
  console.log(`🚀 Refund Service running on ${PORT}`);

  await startRefundConsumer();
});
