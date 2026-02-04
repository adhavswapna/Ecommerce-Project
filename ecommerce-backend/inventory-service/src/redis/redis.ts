import Redis from 'ioredis';

const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: Number(process.env.REDIS_PORT) || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
  db: 2, // separate DB for inventory
});

redis.on('connect', () => console.log('✅ Inventory Service Redis connected'));
redis.on('error', (err) => console.error('❌ Inventory Service Redis error:', err));

export default redis;

