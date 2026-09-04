import { Consumer } from "kafkajs";

import { kafka } from "./kafka.client";
import { VENDOR_TOPICS } from "./vendor.topics";

import prisma from "../db/prisma/prisma";

const consumer: Consumer = kafka.consumer({
  groupId: "vendor-service-group",
});

/* =====================================================
   AUTH USER CREATED EVENT

   Auth Service publishes:

   {
     event: "AUTH_USER_CREATED",
     data: {
       id,
       name,
       email,
       role,
       phone,
       address
     }
   }

   When role = VENDOR, Vendor Service creates
   the Vendor profile.

   IMPORTANT:

   Auth Service owns:
     - AuthUser
     - password
     - authentication

   Vendor Service owns:
     - Vendor profile
     - vendor status
     - vendor activation
===================================================== */

async function handleAuthUserCreated(data: any) {
  const {
    id,
    name,
    email,
    role,
    phone,
    address,
  } = data;

  /* =====================================================
     VALIDATE AUTH USER DATA
  ===================================================== */

  if (!id) {
    console.error(
      "❌ AUTH_USER_CREATED missing user id"
    );

    return;
  }

  if (!email) {
    console.error(
      "❌ AUTH_USER_CREATED missing email"
    );

    return;
  }

  if (!role) {
    console.error(
      "❌ AUTH_USER_CREATED missing role"
    );

    return;
  }

  /* =====================================================
     ONLY CREATE VENDOR FOR VENDOR ROLE
  ===================================================== */

  if (role !== "VENDOR") {
    console.log(
      `ℹ️ AUTH_USER_CREATED ignored. Role: ${role}`
    );

    return;
  }

  console.log(
    "=========================================="
  );

  console.log(
    "🏪 VENDOR REGISTRATION EVENT RECEIVED"
  );

  console.log(
    "👤 Auth User ID:",
    id
  );

  console.log(
    "👤 Vendor Name:",
    name
  );

  console.log(
    "📧 Email:",
    email
  );

  console.log(
    "📱 Phone:",
    phone
  );

  console.log(
    "=========================================="
  );

  /* =====================================================
     CHECK WHETHER VENDOR ALREADY EXISTS

     This protects against duplicate Kafka events.
  ===================================================== */

  const existingVendor =
    await prisma.vendor.findFirst({
      where: {
        OR: [
          {
            userId: id,
          },
          {
            email: email.toLowerCase(),
          },
        ],
      },
    });

  if (existingVendor) {
    console.log(
      "ℹ️ Vendor already exists. Skipping creation.",
      {
        vendorId: existingVendor.id,
        userId: existingVendor.userId,
        email: existingVendor.email,
      }
    );

    return;
  }

  /* =====================================================
     CREATE VENDOR PROFILE

     New vendor always starts as:

       status   = PENDING
       isActive = false

     Admin must approve the vendor before
     the vendor becomes active.
  ===================================================== */

  const vendor =
    await prisma.vendor.create({
      data: {
        userId: id,
        name: name || email,
        email: email.toLowerCase(),
        phone: phone || null,
        address: address || null,

        status: "PENDING",
        isActive: false,
      },
    });

  console.log(
    "=========================================="
  );

  console.log(
    "✅ VENDOR PROFILE CREATED"
  );

  console.log(
    "🏪 Vendor ID:",
    vendor.id
  );

  console.log(
    "👤 User ID:",
    vendor.userId
  );

  console.log(
    "📧 Email:",
    vendor.email
  );

  console.log(
    "📋 Status:",
    vendor.status
  );

  console.log(
    "🔴 Active:",
    vendor.isActive
  );

  console.log(
    "=========================================="
  );
}


/* =====================================================
   VENDOR STATUS UPDATED

   Vendor Service publishes:

   vendor.status.updated

   Auth Service consumes this event and updates:

   AuthUser.vendorStatus

   Vendor Service does NOT create AuthUser.

   This consumer only logs the event.
===================================================== */

async function handleVendorStatusUpdated(
  data: any
) {
  const {
    vendorId,
    userId,
    name,
    email,
    status,
  } = data;

  if (!vendorId) {
    console.error(
      "❌ Vendor status event missing vendorId"
    );

    return;
  }

  console.log(
    "=========================================="
  );

  console.log(
    "📋 VENDOR STATUS UPDATED EVENT"
  );

  console.log(
    "🏪 Vendor ID:",
    vendorId
  );

  console.log(
    "👤 User ID:",
    userId
  );

  console.log(
    "👤 Name:",
    name
  );

  console.log(
    "📧 Email:",
    email
  );

  console.log(
    "📋 Status:",
    status
  );

  console.log(
    "=========================================="
  );

  if (status === "APPROVED") {
    console.log(
      `✅ Vendor ${email} has been approved.`
    );

    console.log(
      "🔐 Auth Service will update AuthUser.vendorStatus."
    );

    return;
  }

  if (status === "REJECTED") {
    console.log(
      `❌ Vendor ${email} has been rejected.`
    );

    console.log(
      "🔐 Auth Service will update AuthUser.vendorStatus."
    );

    return;
  }

  if (status === "PENDING") {
    console.log(
      `⏳ Vendor ${email} is pending approval.`
    );

    return;
  }

  console.warn(
    "⚠️ Unknown vendor status:",
    status
  );
}


/* =====================================================
   CONNECT VENDOR KAFKA CONSUMER
===================================================== */

export async function connectConsumer() {
  try {
    await consumer.connect();

    console.log(
      "✅ Vendor Kafka Consumer connected"
    );

    /* ===================================================
       AUTH USER CREATED

       IMPORTANT:
       This is the event that creates the Vendor profile.
    =================================================== */

    await consumer.subscribe({
      topic: "auth.user.created",
      fromBeginning: false,
    });

    /* ===================================================
       VENDOR STATUS UPDATED

       Used for vendor-service observability.

       Auth Service also consumes this event.
    =================================================== */

    await consumer.subscribe({
      topic: VENDOR_TOPICS.VENDOR_STATUS_UPDATED,
      fromBeginning: false,
    });

    console.log(
      "📥 Vendor Kafka Consumer subscribed to:"
    );

    console.log(
      "   - auth.user.created"
    );

    console.log(
      "   -",
      VENDOR_TOPICS.VENDOR_STATUS_UPDATED
    );

    /* ===================================================
       START CONSUMING EVENTS
    =================================================== */

    await consumer.run({
      eachMessage: async ({
        topic,
        message,
      }) => {
        try {
          if (!message.value) {
            console.warn(
              "⚠️ Empty Kafka message received"
            );

            return;
          }

          const rawMessage =
            message.value.toString();

          console.log(
            "📥 Vendor Service received Kafka event:",
            {
              topic,
              message: rawMessage,
            }
          );

          let payload: any;

          try {
            payload =
              JSON.parse(rawMessage);
          } catch (parseError) {
            console.error(
              "❌ Invalid JSON Kafka message:",
              rawMessage
            );

            return;
          }

          /*
           * Support both formats:
           *
           * Wrapped:
           * {
           *   event: "...",
           *   data: {...}
           * }
           *
           * Direct:
           * {
           *   id: "...",
           *   email: "..."
           * }
           */

          const data =
            payload?.data || payload;

          /* =================================================
             AUTH USER CREATED
          ================================================= */

          if (
            topic ===
            "auth.user.created"
          ) {
            await handleAuthUserCreated(
              data
            );

            return;
          }

          /* =================================================
             VENDOR STATUS UPDATED
          ================================================= */

          if (
            topic ===
            VENDOR_TOPICS.VENDOR_STATUS_UPDATED
          ) {
            await handleVendorStatusUpdated(
              data
            );

            return;
          }

          console.log(
            "ℹ️ Vendor Service ignored unknown topic:",
            topic
          );

        } catch (error) {
          console.error(
            "❌ Error processing Vendor Kafka event:",
            error
          );
        }
      },
    });

  } catch (error) {
    console.error(
      "❌ Vendor Kafka Consumer connection failed:",
      error
    );

    throw error;
  }
}
