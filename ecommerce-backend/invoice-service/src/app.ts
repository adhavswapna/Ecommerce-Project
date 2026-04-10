// src/app.ts
import express from "express";
import invoiceRoutes from "./routes/invoice.routes";

const app = express();
app.use(express.json());

app.use("/invoices", invoiceRoutes);

export default app;

