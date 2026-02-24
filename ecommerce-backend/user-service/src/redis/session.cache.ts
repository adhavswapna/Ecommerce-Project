import redis from './redis';

export const setSession = async (userId: string, sessionData: any) => {
  await redis.set(`session:${userId}`, JSON.stringify(sessionData), 'EX', 86400); // 1 day TTL
};

export const getSession = async (userId: string) => {
  const data = await redis.get(`session:${userId}`);
  return data ? JSON.parse(data) : null;
};

export const deleteSession = async (userId: string) => {
  await redis.del(`session:${userId}`);
};

