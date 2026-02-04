import { Router } from "express";
import { generateInvoicePDF } from "../pdf/invoice.pdf";
import { uploadInvoicePDF } from "../minio/invoice-upload";

const router = Router();

router.post("/invoice", async (req, res) => {
  try {
    const pdfBuffer = await generateInvoicePDF(req.body);

    const fileName = `invoice-${req.body.orderId}.pdf`;

    await uploadInvoicePDF(fileName, pdfBuffer);

    res.status(201).json({
      message: "Invoice generated & uploaded",
      fileName,
    });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({
      message: err.message || "Invoice generation failed",
    });
  }
});

export default router;

