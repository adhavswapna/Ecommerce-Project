import { producer } from "./kafka-client";

export const publishShipmentCreated = async (data: any) => {
  await producer.connect();

  await producer.send({
    topic: "shipping.created",
    messages: [
      {
        value: JSON.stringify(data)
      }
    ]
  });
};

