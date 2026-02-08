import { Kafka, Partitioners } from "kafkajs";

let kafka: Kafka;
let producerInstance: ReturnType<Kafka["producer"]>;

export function getKafka() {
  if (!kafka) {
    kafka = new Kafka({
      clientId: "user-service",
      brokers: [process.env.KAFKA_BROKER || "localhost:9092"],
    });
  }
  return kafka;
}

export async function getUserProducer() {
  if (!producerInstance) {
    const kafkaClient = getKafka();
    producerInstance = kafkaClient.producer({
      createPartitioner: Partitioners.LegacyPartitioner,
    });
    await producerInstance.connect();
    console.log("✅ User-service Kafka producer connected");
  }
  return producerInstance;
}

