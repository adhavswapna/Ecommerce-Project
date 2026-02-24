admin-service/
├── src/
│   ├── app.ts
│   ├── main.ts
│   ├── config/
│   │   └── index.ts
│   ├── controllers/
│   │   └── admin.controller.ts
│   ├── services/
│   │   └── admin.service.ts
│   ├── routes/
│   │   └── admin.routes.ts
│   ├── middlewares/
│   │   ├── error.middleware.ts
│   │   ├── requestLogger.middleware.ts
│   │   └── role.middleware.ts
│   ├── kafka/
│   │   ├── kafka-client.ts
│   │   ├── kafka-producer.ts
│   │   └── kafka-consumer.ts
│   ├── redis/
│   │   └── redis-client.ts
│   └── prisma/
│       ├── prisma.ts
│       └── schema.prisma
├── .env
├── package.json
├── tsconfig.json
├── Dockerfile
└── docker-compose.yml
