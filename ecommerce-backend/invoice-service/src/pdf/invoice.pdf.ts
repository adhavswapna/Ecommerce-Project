import PDFDocument from "pdfkit";
import bwipjs from "bwip-js";
import { toWords } from "number-to-words";
import { minioClient } from "../minio/minio-client";

/* =====================================================
   TYPES
===================================================== */

export interface InvoiceItem {
  description: string;
  unitPrice: number;
  quantity: number;
  taxRate: number;
}

export interface InvoiceData {
  orderId: string;

  customerName: string;
  customerEmail: string;

  billingAddress: string;
  shippingAddress: string;

  vendorName?: string;
  vendorAddress?: string;
  gstNumber?: string;
  panNumber?: string;

  phone?: string;

  paymentMethod?: string;
  paymentStatus?: string;
  currency?: string;

  invoiceNumber?: string;

  items: InvoiceItem[];

  date: string;
}

/* =====================================================
   HELPERS
===================================================== */

function formatCurrency(
  amount: number,
  currency = "INR"
): string {
  if (currency === "INR") {
    return `Rs. ${amount.toFixed(2)}`;
  }

  return `${currency} ${amount.toFixed(2)}`;
}

function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);

    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return dateString;
  }
}

function drawLine(
  doc: PDFKit.PDFDocument,
  x1: number,
  y: number,
  x2: number
) {
  doc
    .moveTo(x1, y)
    .lineTo(x2, y)
    .strokeColor("#d1d5db")
    .stroke();
}

function drawSectionTitle(
  doc: PDFKit.PDFDocument,
  title: string,
  x: number,
  y: number
) {
  doc
    .font("Helvetica-Bold")
    .fontSize(10)
    .fillColor("#111827")
    .text(title.toUpperCase(), x, y);
}

/* =====================================================
   GENERATE INVOICE PDF
===================================================== */

export async function generateInvoicePDF(
  invoice: InvoiceData
): Promise<Buffer> {
  return new Promise(async (resolve, reject) => {
    try {
      /*
      -------------------------------------------------
      PDF SETUP
      -------------------------------------------------
      */

      const doc = new PDFDocument({
        size: "A4",
        margin: 40,
        bufferPages: true,
      });

      const buffers: Buffer[] = [];

      doc.on("data", (chunk) => {
        buffers.push(chunk);
      });

      doc.on("end", () => {
        resolve(Buffer.concat(buffers));
      });

      doc.on("error", reject);

      const pageWidth = doc.page.width;
      const pageHeight = doc.page.height;

      const marginLeft = 40;
      const marginRight = 40;

      const contentWidth =
        pageWidth - marginLeft - marginRight;

      let y = 40;

      const currency =
        invoice.currency || "INR";

      /*
      -------------------------------------------------
      COLORS
      -------------------------------------------------
      */

      const dark = "#111827";
      const gray = "#6b7280";
      const lightGray = "#f3f4f6";
      const border = "#d1d5db";
      const accent = "#2563eb";

      /* =================================================
         HEADER
      ================================================= */

      // Company name
      doc
        .font("Helvetica-Bold")
        .fontSize(22)
        .fillColor(dark)
        .text(
          invoice.vendorName || "ShopSphere",
          marginLeft,
          y
        );

      // Company subtitle
      doc
        .font("Helvetica")
        .fontSize(8.5)
        .fillColor(gray)
        .text(
          invoice.vendorAddress ||
            "Your Favorite Marketplace for Everything Cool",
          marginLeft,
          y + 27,
          {
            width: 270,
          }
        );

      // INVOICE title
      doc
        .font("Helvetica-Bold")
        .fontSize(25)
        .fillColor(accent)
        .text(
          "INVOICE",
          pageWidth - marginRight - 150,
          y,
          {
            width: 150,
            align: "right",
          }
        );

      /*
      -------------------------------------------------
      Invoice metadata
      -------------------------------------------------
      */

      const invoiceNumber =
        invoice.invoiceNumber ||
        `INV-${new Date(invoice.date)
          .getFullYear()}-${invoice.orderId
          .slice(-8)
          .toUpperCase()}`;

      doc
        .font("Helvetica")
        .fontSize(8.5)
        .fillColor(gray)
        .text(
          `Invoice No: ${invoiceNumber}`,
          pageWidth - marginRight - 210,
          y + 35,
          {
            width: 210,
            align: "right",
          }
        );

      doc.text(
        `Invoice Date: ${formatDate(invoice.date)}`,
        pageWidth - marginRight - 210,
        y + 48,
        {
          width: 210,
          align: "right",
        }
      );

      doc.text(
        `Order ID: ${invoice.orderId}`,
        pageWidth - marginRight - 210,
        y + 61,
        {
          width: 210,
          align: "right",
        }
      );

      y += 88;

      drawLine(
        doc,
        marginLeft,
        y,
        pageWidth - marginRight
      );

      y += 18;

      /* =================================================
         SOLD BY
      ================================================= */

      if (
        invoice.vendorName ||
        invoice.vendorAddress ||
        invoice.gstNumber ||
        invoice.panNumber
      ) {
        drawSectionTitle(
          doc,
          "Sold By",
          marginLeft,
          y
        );

        y += 15;

        doc
          .font("Helvetica-Bold")
          .fontSize(9)
          .fillColor(dark)
          .text(
            invoice.vendorName ||
              "ShopSphere Marketplace Pvt. Ltd.",
            marginLeft,
            y
          );

        y += 12;

        if (invoice.vendorAddress) {
          doc
            .font("Helvetica")
            .fontSize(8.5)
            .fillColor(gray)
            .text(
              invoice.vendorAddress,
              marginLeft,
              y,
              {
                width: contentWidth,
              }
            );

          y += 13;
        }

        if (invoice.gstNumber) {
          doc
            .font("Helvetica")
            .fontSize(8.5)
            .fillColor(gray)
            .text(
              `GSTIN: ${invoice.gstNumber}`,
              marginLeft,
              y
            );

          y += 12;
        }

        if (invoice.panNumber) {
          doc
            .font("Helvetica")
            .fontSize(8.5)
            .fillColor(gray)
            .text(
              `PAN: ${invoice.panNumber}`,
              marginLeft,
              y
            );

          y += 12;
        }

        y += 8;

        drawLine(
          doc,
          marginLeft,
          y,
          pageWidth - marginRight
        );

        y += 18;
      }

      /* =================================================
         BILLING + SHIPPING
      ================================================= */

      const gap = 15;

      const boxWidth =
        (contentWidth - gap) / 2;

      const boxHeight = 118;

      /*
      -------------------------------------------------
      Billing box
      -------------------------------------------------
      */

      doc
        .roundedRect(
          marginLeft,
          y,
          boxWidth,
          boxHeight,
          4
        )
        .fillAndStroke("#fafafa", border);

      drawSectionTitle(
        doc,
        "Billing To",
        marginLeft + 10,
        y + 10
      );

      let billingY = y + 28;

      doc
        .font("Helvetica-Bold")
        .fontSize(10)
        .fillColor(dark)
        .text(
          invoice.customerName || "Customer",
          marginLeft + 10,
          billingY,
          {
            width: boxWidth - 20,
          }
        );

      billingY += 15;

      doc
        .font("Helvetica")
        .fontSize(8.5)
        .fillColor(gray)
        .text(
          invoice.billingAddress || "Address not available",
          marginLeft + 10,
          billingY,
          {
            width: boxWidth - 20,
            lineGap: 2,
          }
        );

      billingY += 55;

      if (invoice.phone) {
        doc
          .fontSize(8.5)
          .fillColor(gray)
          .text(
            `Phone: ${invoice.phone}`,
            marginLeft + 10,
            billingY,
            {
              width: boxWidth - 20,
            }
          );

        billingY += 12;
      }

      if (invoice.customerEmail) {
        doc
          .fontSize(8.5)
          .fillColor(gray)
          .text(
            `Email: ${invoice.customerEmail}`,
            marginLeft + 10,
            billingY,
            {
              width: boxWidth - 20,
            }
          );
      }

      /*
      -------------------------------------------------
      Shipping box
      -------------------------------------------------
      */

      const shippingX =
        marginLeft + boxWidth + gap;

      doc
        .roundedRect(
          shippingX,
          y,
          boxWidth,
          boxHeight,
          4
        )
        .fillAndStroke("#fafafa", border);

      drawSectionTitle(
        doc,
        "Shipping To",
        shippingX + 10,
        y + 10
      );

      let shippingY = y + 28;

      doc
        .font("Helvetica-Bold")
        .fontSize(10)
        .fillColor(dark)
        .text(
          invoice.customerName || "Customer",
          shippingX + 10,
          shippingY,
          {
            width: boxWidth - 20,
          }
        );

      shippingY += 15;

      doc
        .font("Helvetica")
        .fontSize(8.5)
        .fillColor(gray)
        .text(
          invoice.shippingAddress ||
            "Address not available",
          shippingX + 10,
          shippingY,
          {
            width: boxWidth - 20,
            lineGap: 2,
          }
        );

      shippingY += 55;

      if (invoice.phone) {
        doc
          .fontSize(8.5)
          .fillColor(gray)
          .text(
            `Phone: ${invoice.phone}`,
            shippingX + 10,
            shippingY,
            {
              width: boxWidth - 20,
            }
          );

        shippingY += 12;
      }

      if (invoice.customerEmail) {
        doc
          .fontSize(8.5)
          .fillColor(gray)
          .text(
            `Email: ${invoice.customerEmail}`,
            shippingX + 10,
            shippingY,
            {
              width: boxWidth - 20,
            }
          );
      }

      y += boxHeight + 20;

      /* =================================================
         PAYMENT INFORMATION
      ================================================= */

      const paymentBoxHeight = 52;

      doc
        .roundedRect(
          marginLeft,
          y,
          contentWidth,
          paymentBoxHeight,
          4
        )
        .fillAndStroke("#f9fafb", border);

      const paymentColWidth =
        contentWidth / 4;

      /*
      Payment Method
      */

      drawSectionTitle(
        doc,
        "Payment Method",
        marginLeft + 10,
        y + 10
      );

      doc
        .font("Helvetica")
        .fontSize(9)
        .fillColor(dark)
        .text(
          invoice.paymentMethod || "ONLINE",
          marginLeft + 10,
          y + 27
        );

      /*
      Payment Status
      */

      drawSectionTitle(
        doc,
        "Payment Status",
        marginLeft + paymentColWidth + 10,
        y + 10
      );

      doc
        .font("Helvetica")
        .fontSize(9)
        .fillColor(dark)
        .text(
          invoice.paymentStatus || "PENDING",
          marginLeft + paymentColWidth + 10,
          y + 27
        );

      /*
      Currency
      */

      drawSectionTitle(
        doc,
        "Currency",
        marginLeft +
          paymentColWidth * 2 +
          10,
        y + 10
      );

      doc
        .font("Helvetica")
        .fontSize(9)
        .fillColor(dark)
        .text(
          currency,
          marginLeft +
            paymentColWidth * 2 +
            10,
          y + 27
        );

      /*
      Order Date
      */

      drawSectionTitle(
        doc,
        "Order Date",
        marginLeft +
          paymentColWidth * 3 +
          10,
        y + 10
      );

      doc
        .font("Helvetica")
        .fontSize(8.5)
        .fillColor(dark)
        .text(
          formatDate(invoice.date),
          marginLeft +
            paymentColWidth * 3 +
            10,
          y + 27,
          {
            width: paymentColWidth - 15,
          }
        );

      y += paymentBoxHeight + 22;

      /* =================================================
         ORDER DETAILS
      ================================================= */

      drawSectionTitle(
        doc,
        "Order Details",
        marginLeft,
        y
      );

      y += 15;

      /*
      -------------------------------------------------
      TABLE HEADER
      -------------------------------------------------
      */

      const tableHeaderHeight = 27;

      doc
        .rect(
          marginLeft,
          y,
          contentWidth,
          tableHeaderHeight
        )
        .fill("#eef2ff");

      const colNo = marginLeft + 8;

      const colItem = marginLeft + 35;

      const colPrice =
        marginLeft + contentWidth - 205;

      const colQty =
        marginLeft + contentWidth - 140;

      const colTax =
        marginLeft + contentWidth - 95;

      const colAmount =
        marginLeft + contentWidth - 8;

      doc
        .font("Helvetica-Bold")
        .fontSize(8.5)
        .fillColor(dark)
        .text("#", colNo, y + 8)
        .text(
          "ITEM DESCRIPTION",
          colItem,
          y + 8
        )
        .text(
          "UNIT PRICE",
          colPrice - 20,
          y + 8,
          {
            width: 70,
            align: "right",
          }
        )
        .text(
          "QTY",
          colQty - 10,
          y + 8,
          {
            width: 30,
            align: "right",
          }
        )
        .text(
          "TAX",
          colTax - 5,
          y + 8,
          {
            width: 45,
            align: "right",
          }
        )
        .text(
          "AMOUNT",
          colAmount - 60,
          y + 8,
          {
            width: 60,
            align: "right",
          }
        );

      y += tableHeaderHeight;

      /* =================================================
         TABLE ROWS
      ================================================= */

      let subtotal = 0;
      let totalTax = 0;

      const rowHeight = 32;

      (invoice.items || []).forEach(
        (item, index) => {
          const net =
            item.unitPrice * item.quantity;

          const taxAmount =
            (net * item.taxRate) / 100;

          const total =
            net + taxAmount;

          subtotal += net;
          totalTax += taxAmount;

          /*
          Alternate row background
          */

          if (index % 2 === 0) {
            doc
              .rect(
                marginLeft,
                y,
                contentWidth,
                rowHeight
              )
              .fill("#fafafa");
          }

          doc
            .rect(
              marginLeft,
              y,
              contentWidth,
              rowHeight
            )
            .strokeColor(border)
            .stroke();

          /*
          Item number
          */

          doc
            .font("Helvetica")
            .fontSize(8.5)
            .fillColor(dark)
            .text(
              `${index + 1}`,
              colNo,
              y + 10
            );

          /*
          Item description
          */

          doc
            .font("Helvetica")
            .fontSize(8.5)
            .fillColor(dark)
            .text(
              item.description,
              colItem,
              y + 7,
              {
                width:
                  colPrice -
                  colItem -
                  15,
                height: rowHeight - 8,
              }
            );

          /*
          Unit price
          */

          doc
            .fontSize(8.5)
            .text(
              formatCurrency(
                item.unitPrice,
                currency
              ),
              colPrice - 20,
              y + 10,
              {
                width: 70,
                align: "right",
              }
            );

          /*
          Quantity
          */

          doc
            .text(
              item.quantity.toString(),
              colQty - 10,
              y + 10,
              {
                width: 30,
                align: "right",
              }
            );

          /*
          Tax
          */

          doc
            .text(
              `${item.taxRate}%`,
              colTax - 5,
              y + 10,
              {
                width: 45,
                align: "right",
              }
            );

          /*
          Total
          */

          doc
            .font("Helvetica-Bold")
            .text(
              formatCurrency(
                total,
                currency
              ),
              colAmount - 60,
              y + 10,
              {
                width: 60,
                align: "right",
              }
            );

          y += rowHeight;
        }
      );

      /* =================================================
         TOTALS
      ================================================= */

      y += 12;

      const totalsWidth = 230;

      const totalsX =
        pageWidth -
        marginRight -
        totalsWidth;

      /*
      Subtotal
      */

      doc
        .font("Helvetica")
        .fontSize(9)
        .fillColor(gray)
        .text(
          "Subtotal",
          totalsX,
          y,
          {
            width: 120,
          }
        )
        .fillColor(dark)
        .text(
          formatCurrency(
            subtotal,
            currency
          ),
          totalsX + 120,
          y,
          {
            width: 110,
            align: "right",
          }
        );

      y += 16;

      /*
      Tax
      */

      doc
        .fillColor(gray)
        .text(
          `Tax`,
          totalsX,
          y,
          {
            width: 120,
          }
        )
        .fillColor(dark)
        .text(
          formatCurrency(
            totalTax,
            currency
          ),
          totalsX + 120,
          y,
          {
            width: 110,
            align: "right",
          }
        );

      y += 10;

      drawLine(
        doc,
        totalsX,
        y,
        pageWidth - marginRight
      );

      y += 10;

      /*
      Grand Total
      */

      const grandTotal =
        subtotal + totalTax;

      doc
        .font("Helvetica-Bold")
        .fontSize(13)
        .fillColor(dark)
        .text(
          "GRAND TOTAL",
          totalsX,
          y,
          {
            width: 120,
          }
        )
        .fillColor(accent)
        .text(
          formatCurrency(
            grandTotal,
            currency
          ),
          totalsX + 120,
          y,
          {
            width: 110,
            align: "right",
          }
        );

      y += 35;

      /* =================================================
         AMOUNT IN WORDS
      ================================================= */

      const amountWords =
        toWords(
          Math.floor(grandTotal)
        ).replace(
          /^\w/,
          (c) => c.toUpperCase()
        );

      const decimalPart =
        Math.round(
          (grandTotal -
            Math.floor(grandTotal)) *
            100
        );

      let amountInWords =
        `${amountWords} Rupees`;

      if (decimalPart > 0) {
        const paiseWords =
          toWords(decimalPart);

        amountInWords +=
          ` and ${paiseWords} Paise`;
      }

      amountInWords += " Only";

      /*
      Amount words box
      */

      const wordsBoxHeight = 48;

      doc
        .roundedRect(
          marginLeft,
          y,
          contentWidth,
          wordsBoxHeight,
          4
        )
        .fillAndStroke("#f9fafb", border);

      drawSectionTitle(
        doc,
        "Amount in Words",
        marginLeft + 10,
        y + 9
      );

      doc
        .font("Helvetica")
        .fontSize(8.5)
        .fillColor(dark)
        .text(
          amountInWords,
          marginLeft + 10,
          y + 25,
          {
            width: contentWidth - 20,
          }
        );

      y += wordsBoxHeight + 15;

      /* =================================================
         NOTES
      ================================================= */

      drawSectionTitle(
        doc,
        "Notes",
        marginLeft,
        y
      );

      y += 14;

      doc
        .font("Helvetica")
        .fontSize(7.8)
        .fillColor(gray)
        .text(
          "• This is a computer generated invoice and does not require a signature.",
          marginLeft,
          y
        );

      y += 11;

      doc.text(
        "• Please retain this invoice for your records.",
        marginLeft,
        y
      );

      /* =================================================
         FOOTER
      ================================================= */

      const footerY =
        pageHeight -
        doc.page.margins.bottom -
        50;

      drawLine(
        doc,
        marginLeft,
        footerY,
        pageWidth - marginRight
      );

      doc
        .font("Helvetica-Bold")
        .fontSize(8.5)
        .fillColor(dark)
        .text(
          "NEED HELP?",
          marginLeft,
          footerY + 10
        );

      doc
        .font("Helvetica")
        .fontSize(8)
        .fillColor(gray)
        .text(
          "support@shopsphere.com  |  +91 22 1234 5678",
          marginLeft,
          footerY + 23
        );

      doc
        .font("Helvetica-Bold")
        .fontSize(8)
        .fillColor(dark)
        .text(
          "Thank you for shopping with ShopSphere.",
          pageWidth - marginRight - 260,
          footerY + 10,
          {
            width: 260,
            align: "right",
          }
        );

      doc
        .font("Helvetica")
        .fontSize(7.5)
        .fillColor(gray)
        .text(
          "We appreciate your business.",
          pageWidth - marginRight - 260,
          footerY + 23,
          {
            width: 260,
            align: "right",
          }
        );

      /* =================================================
         PAGE NUMBER
      ================================================= */

      doc
        .font("Helvetica")
        .fontSize(7)
        .fillColor("#9ca3af")
        .text(
          "Page 1 of 1",
          marginLeft,
          pageHeight - 22,
          {
            width: contentWidth,
            align: "center",
          }
        );

      /* =================================================
         FINISH PDF
      ================================================= */

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

/* =====================================================
   MINIO
===================================================== */

const BUCKET = "invoices";

/**
 * Upload generated invoice PDF to MinIO
 */
export async function storeInvoicePDF(
  invoiceId: string,
  buffer: Buffer
): Promise<string> {
  const fileName = `${invoiceId}.pdf`;

  await minioClient.putObject(
    BUCKET,
    fileName,
    buffer,
    {
      "Content-Type": "application/pdf",
    }
  );

  return fileName;
}
