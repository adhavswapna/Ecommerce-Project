import express from "express";
import invoiceRoutes from "./routes/invoice.routes";

const app = express();

app.use(express.json());

app.use("/invoices", invoiceRoutes);

app.get("/health", (_, res) => {
  res.json({ status: "invoice-service up" });
});

export default app;
