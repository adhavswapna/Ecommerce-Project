import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * 📦 CREATE SHIPMENT
 */
export async function createShipment(data: {
  orderId: string;
  userId: string;
  address: string;
  trackingId: string;
}) {
  return prisma.shipment.create({
    data: {
      orderId: data.orderId,
      userId: data.userId,
      address: data.address,
      trackingId: data.trackingId,
      status: "CREATED",
    },
  });
}

/**
 * 📦 GET ALL SHIPMENTS
 */
export async function getAllShipmentsService() {
  return prisma.shipment.findMany({
    orderBy: { createdAt: "desc" },
  });
}

/**
 * 📦 GET SHIPMENT BY ORDER ID
 */
export async function getShipmentByOrderIdService(orderId: string) {
  return prisma.shipment.findUnique({
    where: { orderId },
  });
}

/**
 * 🔄 UPDATE SHIPMENT STATUS
 */
export async function updateShipmentStatusService(
  id: string,
  status: string
) {
  return prisma.shipment.update({
    where: { id },
    data: { status },
  });
}

/**
 * ❌ DELETE SHIPMENT
 */
export async function deleteShipmentService(id: string) {
  return prisma.shipment.delete({
    where: { id },
  });
}
