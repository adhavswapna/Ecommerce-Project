export const createShipment = async (orderId: string) => {
  return {
    orderId,
    status: "SHIPPED",
    shippedAt: new Date()
  };
};

