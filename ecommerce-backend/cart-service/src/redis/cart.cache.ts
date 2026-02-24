import redis from './redis';

export const setCart = async (userId: string, cartData: any) => {
  await redis.set(`cart:${userId}`, JSON.stringify(cartData), 'EX', 3600); // 1 hour TTL
};

export const getCart = async (userId: string) => {
  const data = await redis.get(`cart:${userId}`);
  return data ? JSON.parse(data) : null;
};

export const deleteCart = async (userId: string) => {
  await redis.del(`cart:${userId}`);
};

