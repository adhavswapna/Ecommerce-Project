import redis from './redis';

export const setStock = async (productId: string, quantity: number) => {
  await redis.set(`stock:${productId}`, quantity.toString(), 'EX', 3600); // 1 hour TTL
};

export const getStock = async (productId: string) => {
  const qty = await redis.get(`stock:${productId}`);
  return qty ? parseInt(qty, 10) : null;
};

export const deleteStock = async (productId: string) => {
  await redis.del(`stock:${productId}`);
};

