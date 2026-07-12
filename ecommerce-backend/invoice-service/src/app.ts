import express from "express";
import cors from "cors";

import invoiceRoutes from "./routes/invoice.routes";

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://127.0.0.1:3000"
    ],
    credentials: true,
    methods: [
      "GET",
      "POST",
      "PUT",
      "DELETE",
      "OPTIONS"
    ],
    allowedHeaders: [
      "Content-Type",
      "Authorization"
    ]
  })
);

app.use(express.json());


// ==========================
// HEALTH CHECK
// ==========================
app.get("/health", (_req, res) => {
  return res.status(200).json({
    status: "UP",
    service: "Invoice Service"
  });
});


// ==========================
// ROUTES
// ==========================
app.use("/invoices", invoiceRoutes);


// ==========================
// 404
// ==========================
app.use((_req, res) => {
  return res.status(404).json({
    message: "Invoice route not found"
  });
});


export default app;
