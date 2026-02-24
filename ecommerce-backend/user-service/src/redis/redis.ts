import Redis from 'ioredis';

const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: Number(process.env.REDIS_PORT) || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
  db: 1, // separate DB for user service
});

redis.on('connect', () => console.log('✅ User Service Redis connected'));
redis.on('error', (err) => console.error('❌ User Service Redis error:', err));

export default redis;

