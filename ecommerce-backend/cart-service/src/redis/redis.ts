import Redis from 'ioredis';

const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: Number(process.env.REDIS_PORT) || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
  db: 0, // optional: you can use different DB index for each service
});

redis.on('connect', () => console.log('✅ Cart Service Redis connected'));
redis.on('error', (err) => console.error('❌ Cart Service Redis error:', err));

export default redis;

