import dotenv from 'dotenv';
dotenv.config();   // ✅ load env first

import app from './app';
import { connectKafka } from './kafka/kafka.client';

const PORT = 3008;

async function start() {
  await connectKafka();

  app.listen(PORT, () => {
    console.log(`🚀 Rating Service running on port ${PORT}`);
  });
}

start();
