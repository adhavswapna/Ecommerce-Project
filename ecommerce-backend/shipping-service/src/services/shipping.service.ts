import { prisma } from "../db/prisma/prisma"; // prisma client
import { producer } from "../kafka/kafka-client"; // Kafka producer

export const createShipment = async (orderId: string) => {
  // 1️⃣ Create a shipment record in DB
  const shipment = await prisma.shipment.create({
    data: {
      orderId,
      status: "SHIPPED", // initial status
    },
  });

  // 2️⃣ Publish Kafka event that shipment is created
  await producer.send({
    topic: "shipping.created",
    messages: [
      {
        value: JSON.stringify(shipment),
      },
    ],
  });

  return shipment;
};

