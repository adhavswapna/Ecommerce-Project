import { Role, Prisma, VendorStatus } from "@prisma/client";
import prisma from "../db/prisma/prisma";
import { signToken } from "../utils/jwt";
import { hashPassword, comparePassword } from "../utils/password";
import * as authProducer from "../kafka/auth.producer";
import redis from "../redis/redis";
import axios from "axios";
import crypto from "crypto";
import { v4 as uuid } from "uuid";

export class AuthService {
  // =====================================================
  // GOOGLE AUTH URL
  // =====================================================

  static getGoogleAuthUrl() {
    const state = crypto.randomUUID();

    const params = new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI!,
      response_type: "code",
      scope: "openid email profile",
      access_type: "offline",
      prompt: "consent",
      state,
    });

    return {
      url: `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`,
      state,
    };
  }

  // =====================================================
  // GOOGLE CALLBACK
  // =====================================================

  static async googleCallback(code: string) {
    try {
      const tokenRes = await axios.post(
        "https://oauth2.googleapis.com/token",
        new URLSearchParams({
          client_id: process.env.GOOGLE_CLIENT_ID!,
          client_secret: process.env.GOOGLE_CLIENT_SECRET!,
          code,
          redirect_uri: process.env.GOOGLE_REDIRECT_URI!,
          grant_type: "authorization_code",
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      const accessToken = tokenRes.data.access_token;

      const userInfo = await axios.get(
        "https://www.googleapis.com/oauth2/v2/userinfo",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const { email, name, picture } = userInfo.data;

      let user = await prisma.authUser.findUnique({
        where: { email },
      });

      if (!user) {
        user = await prisma.authUser.create({
          data: {
            email,
            name,
            password: uuid(),
            role: Role.USER,
            isVerified: true,
          },
        });

        if (process.env.ENABLE_KAFKA === "true") {
          await authProducer.publishUserCreated({
            id: user.id,
            name: user.name!,
            email: user.email,
            role: user.role,
          });
        }
      }

      const sessionId = uuid();

      await redis.set(
        `session:${sessionId}`,
        JSON.stringify({
          userId: user.id,
          role: user.role,
          email: user.email,
        }),
        "EX",
        7 * 24 * 60 * 60
      );

      return {
        token: signToken({
          userId: user.id,
          role: user.role,
          name: user.name,
          email: user.email,
        }),
        sessionId,
        user,
        avatar: picture,
      };
    } catch (err: any) {
      console.error(
        "Google OAuth Error:",
        err.response?.data || err.message
      );

      throw new Error("Google authentication failed");
    }
  }

  // =====================================================
  // NORMAL USER REGISTER
  // =====================================================

  static async register(
    name: string,
    email: string,
    password: string,
    role: Role,
    phone?: string,
    address?: string
  ) {
    try {
      const hashedPassword = await hashPassword(password);

      const user = await prisma.authUser.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role,
          phone,
          address,
          isVerified: true,
        },
      });

      if (process.env.ENABLE_KAFKA === "true") {
        await authProducer.publishUserCreated({
          id: user.id,
          name: user.name!,
          email: user.email,
          role: user.role,
        });
      }

      const token = signToken({
        userId: user.id,
        role: user.role,
        name: user.name,
        email: user.email,
      });

      return {
        token,
        userId: user.id,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          address: user.address,
        },
      };
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new Error("User already exists");
      }

      throw error;
    }
  }

  // =====================================================
  // VENDOR REGISTER
  //
  // NEW REAL-WORLD VENDOR FLOW
  //
  // Vendor
  //    ↓
  // Enters name/email/password
  //    ↓
  // AuthUser created
  //    ↓
  // role = VENDOR
  // vendorStatus = PENDING
  //    ↓
  // auth.user.created
  //    ↓
  // User Service creates User
  // Vendor Service creates Vendor
  //    ↓
  // Admin reviews vendor
  //
  // IMPORTANT:
  // Vendor does NOT receive a JWT here.
  //
  // Vendor must wait for admin approval.
  // =====================================================
  static async registerVendor(
  name: string,
  email: string,
  password: string,
  phone?: string,
  address?: string
) {
  try {
    if (!name || !name.trim()) {
      throw new Error("Vendor name is required");
    }

    if (!email || !email.trim()) {
      throw new Error("Vendor email is required");
    }

    if (!password || password.length < 8) {
      throw new Error(
        "Vendor password must be at least 8 characters"
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await prisma.authUser.findUnique({
      where: {
        email: normalizedEmail,
      },
    });

    if (existingUser) {
      throw new Error("User already exists");
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.authUser.create({
      data: {
        name: name.trim(),
        email: normalizedEmail,
        password: hashedPassword,
        role: Role.VENDOR,

        phone: phone?.trim() || null,
        address: address?.trim() || null,

        /*
         * Email/account verification.
         *
         * This is NOT vendor approval.
         */
        isVerified: true,

        /*
         * Vendor must be approved by Admin
         * before the vendor can log in.
         */
        vendorStatus: VendorStatus.PENDING,
      },
    });

    /*
     * Publish auth.user.created.
     *
     * User Service creates the common User record.
     *
     * Vendor Service creates the Vendor profile
     * with:
     *
     *   userId    = AuthUser.id
     *   status    = PENDING
     *   isActive  = false
     */
    if (process.env.ENABLE_KAFKA === "true") {
      await authProducer.publishUserCreated({
        id: user.id,
        name: user.name!,
        email: user.email,
        role: user.role,
        phone: user.phone ?? undefined,
        address: user.address ?? undefined,
      });
    }

    console.log(
      "=========================================="
    );

    console.log(
      "✅ Vendor registration submitted"
    );

    console.log(
      "👤 Vendor:",
      user.email
    );

    console.log(
      "🔑 Vendor userId:",
      user.id
    );

    console.log(
      "⏳ Vendor status:",
      user.vendorStatus
    );

    console.log(
      "=========================================="
    );

    /*
     * IMPORTANT:
     *
     * Do NOT generate a JWT.
     *
     * Vendor must wait for Admin approval.
     */
    return {
      userId: user.id,

      status: user.vendorStatus,

      message:
        "Vendor registration submitted successfully. Your account is pending admin approval.",

      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        address: user.address,
        vendorStatus: user.vendorStatus,
      },
    };
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new Error("User already exists");
    }

    throw error;
  }
}
 
  // =====================================================
// UPDATE VENDOR STATUS
//
// Called by the Auth Service Kafka consumer when
// Vendor Service publishes:
//
// vendor.status.updated
//
// IMPORTANT:
//
// Vendor Service is the source of truth for vendor
// approval.
//
// Auth Service only maintains a local projection of
// the vendor status so that login can be allowed or
// blocked without making a synchronous call to the
// Vendor Service.
// =====================================================

static async updateVendorStatus(
  userId: string,
  status: string
) {
  try {
    if (!userId) {
      throw new Error(
        "Auth user ID is required"
      );
    }

    const normalizedStatus =
      status.trim().toUpperCase();

    /*
     * Validate vendor status before writing
     * anything to the database.
     */
    if (
      normalizedStatus !== "PENDING" &&
      normalizedStatus !== "APPROVED" &&
      normalizedStatus !== "REJECTED"
    ) {
      throw new Error(
        `Invalid vendor status: ${status}`
      );
    }

    /*
     * Make sure the AuthUser exists and is
     * actually a vendor.
     */
    const existingUser =
      await prisma.authUser.findUnique({
        where: {
          id: userId,
        },
      });

    if (!existingUser) {
      throw new Error(
        `Auth user not found: ${userId}`
      );
    }

    if (existingUser.role !== Role.VENDOR) {
      throw new Error(
        `Auth user ${userId} is not a vendor`
      );
    }

    /*
     * Update only the Auth Service's local
     * vendor approval projection.
     */
    const user =
      await prisma.authUser.update({
        where: {
          id: userId,
        },

        data: {
          vendorStatus:
            normalizedStatus as VendorStatus,
        },
      });

    console.log(
      "=========================================="
    );

    console.log(
      "✅ Vendor Auth status updated"
    );

    console.log(
      "👤 User ID:",
      user.id
    );

    console.log(
      "📧 Email:",
      user.email
    );

    console.log(
      "🏪 Vendor status:",
      user.vendorStatus
    );

    console.log(
      "=========================================="
    );

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      vendorStatus: user.vendorStatus,
    };

  } catch (error) {
    console.error(
      "❌ Failed to update vendor Auth status:",
      error
    );

    throw error;
  }
}
  // =====================================================
  // CREATE VENDOR INVITATION
  //
  // OLD WORKFLOW
  //
  // This method is temporarily kept for compatibility.
  //
  // OLD FLOW:
  //
  // Admin approves vendor
  //       ↓
  // Auth Service creates AuthUser
  //       ↓
  // Vendor receives password setup link
  //
  // NEW FLOW:
  //
  // Vendor registers
  //       ↓
  // Vendor creates password immediately
  //       ↓
  // Admin approves existing account
  //
  // This old method will be removed after all Kafka
  // consumers/producers and frontend code are migrated.
  // =====================================================

  static async createVendorInvitation(
    vendorId: string,
    name: string,
    email: string,
    phone?: string,
    address?: string
  ) {
    try {
      if (!vendorId) {
        throw new Error("Vendor ID is required");
      }

      if (!name || !email) {
        throw new Error(
          "Vendor name and email are required"
        );
      }

      const temporaryPassword =
        crypto.randomBytes(32).toString("hex");

      const temporaryHashedPassword =
        await hashPassword(temporaryPassword);

      const rawToken =
        crypto.randomBytes(32).toString("hex");

      const hashedToken =
        crypto
          .createHash("sha256")
          .update(rawToken)
          .digest("hex");

      const TOKEN_EXPIRY =
        24 * 60 * 60 * 1000;

      const user =
        await prisma.authUser.create({
          data: {
            name,
            email,
            password: temporaryHashedPassword,
            role: Role.VENDOR,
            phone,
            address,
            isVerified: true,

            /*
             * Old invitation flow creates an already approved
             * vendor account.
             *
             * This is kept only for backward compatibility.
             */
            vendorStatus: VendorStatus.APPROVED,

            resetToken: hashedToken,

            resetTokenExpiry: new Date(
              Date.now() + TOKEN_EXPIRY
            ),
          },
        });

      console.log(
        "✅ Vendor AuthUser created:",
        {
          vendorId,
          userId: user.id,
          email: user.email,
        }
      );

      if (process.env.ENABLE_KAFKA === "true") {
        await authProducer.publishUserCreated({
          id: user.id,
          name: user.name!,
          email: user.email,
          role: user.role,
        });
      }

      const vendorFrontendUrl =
        process.env.VENDOR_FRONTEND_URL ||
        "http://localhost:5173";

      const setupUrl =
        `${vendorFrontendUrl}/set-password?token=${rawToken}`;

      if (process.env.ENABLE_KAFKA === "true") {
        await authProducer.publishPasswordReset({
          to: user.email,

          subject:
            "Vendor Account Invitation",

          html: `
            <p>
              Hello ${user.name || "Vendor"},
            </p>

            <p>
              Your vendor account has been approved.
            </p>

            <p>
              Please create your password using
              the button below:
            </p>

            <p>
              <a
                href="${setupUrl}"
                style="
                  display:inline-block;
                  padding:10px 16px;
                  background:#2563eb;
                  color:white;
                  text-decoration:none;
                  border-radius:6px;
                "
              >
                Create Vendor Password
              </a>
            </p>

            <p>
              This setup link will expire in
              <b>24 hours</b>.
            </p>

            <p>
              After creating your password,
              you can log in to the Vendor Dashboard.
            </p>
          `,
        });
      }

      if (process.env.ENABLE_KAFKA === "true") {
        await authProducer.publishVendorAuthCreated({
          vendorId,
          userId: user.id,
          name: user.name!,
          email: user.email,
        });
      }

      console.log(
        "📤 Vendor auth-created event published"
      );

      console.log(
        "=========================================="
      );

      console.log(
        "✅ Vendor authentication account created"
      );

      console.log(
        "👤 Vendor:",
        user.email
      );

      console.log(
        "🔑 Vendor userId:",
        user.id
      );

      if (
        process.env.NODE_ENV !==
        "production"
      ) {
        console.log(
          "🔗 Vendor password setup URL:",
          setupUrl
        );
      }

      console.log(
        "=========================================="
      );

      return {
        vendorId,

        userId: user.id,

        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          address: user.address,
        },

        setupUrl,
      };
    } catch (error) {
      if (
        error instanceof
          Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new Error(
          "User already exists"
        );
      }

      throw error;
    }
  }

  // =====================================================
  // LOGIN
  // =====================================================

  static async login(
    email: string,
    password: string
  ) {
    const normalizedEmail =
      email.trim().toLowerCase();

    const user =
      await prisma.authUser.findUnique({
        where: {
          email: normalizedEmail,
        },
      });

    if (!user) {
      throw new Error(
        "Invalid credentials"
      );
    }

    /*
     * ===================================================
     * VENDOR APPROVAL CHECK
     * ===================================================
     *
     * Vendor credentials are created during registration,
     * but the vendor cannot log in until Admin approves
     * the vendor application.
     *
     * This check is intentionally based on vendorStatus,
     * NOT isVerified.
     */

    if (user.role === Role.VENDOR) {
      if (
        user.vendorStatus ===
        VendorStatus.PENDING
      ) {
        throw new Error(
          "Your vendor application is pending admin approval"
        );
      }

      if (
        user.vendorStatus ===
        VendorStatus.REJECTED
      ) {
        throw new Error(
          "Your vendor application has been rejected"
        );
      }

      if (
        user.vendorStatus !==
        VendorStatus.APPROVED
      ) {
        throw new Error(
          "Your vendor account is not approved"
        );
      }
    }

    /*
     * Compare password only after checking whether
     * the vendor is allowed to log in.
     */
    const isMatch =
      await comparePassword(
        password,
        user.password
      );

    if (!isMatch) {
      throw new Error(
        "Invalid credentials"
      );
    }

    return signToken({
      userId: user.id,
      role: user.role,
      name: user.name,
      email: user.email,
    });
  }

  // =====================================================
  // GET PROFILE
  // =====================================================

  static async getMe(userId: string) {
    return prisma.authUser.findUnique({
      where: {
        id: userId,
      },

      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        address: true,
        isVerified: true,
        vendorStatus: true,
        createdAt: true,
      },
    });
  }

  // =====================================================
  // PASSWORD RESET
  // =====================================================

  static async forgotPassword(
    email: string
  ) {
    const normalizedEmail =
      email.trim().toLowerCase();

    const user =
      await prisma.authUser.findUnique({
        where: {
          email: normalizedEmail,
        },
      });

    if (!user) {
      console.log(
        `Password reset requested for non-existing email: ${email}`
      );

      return;
    }

    const rawToken =
      crypto.randomBytes(32).toString("hex");

    const hashedToken =
      crypto
        .createHash("sha256")
        .update(rawToken)
        .digest("hex");

    const TOKEN_EXPIRY =
      15 * 60 * 1000;

    await prisma.authUser.update({
      where: {
        email: normalizedEmail,
      },

      data: {
        resetToken: hashedToken,

        resetTokenExpiry: new Date(
          Date.now() + TOKEN_EXPIRY
        ),
      },
    });

    const frontendUrl =
      process.env.FRONTEND_URL ||
      process.env.NEXT_PUBLIC_FRONTEND_URL ||
      "http://localhost:3000";

    const resetUrl =
      `${frontendUrl}/reset-password?token=${rawToken}`;

    console.log(
      "Generated reset URL:",
      resetUrl
    );

    if (
      process.env.ENABLE_KAFKA === "true"
    ) {
      await authProducer.publishPasswordReset({
        to: user.email,

        subject:
          "Password Reset Request 🔑",

        html: `
          <p>
            Hi ${user.name || "User"},
          </p>

          <p>
            You requested a password reset
            for your account.
          </p>

          <p>
            Click the button below to reset
            your password:
          </p>

          <p>
            <a
              href="${resetUrl}"
              style="
                padding:10px 16px;
                background:#2563eb;
                color:white;
                text-decoration:none;
                border-radius:6px;
              "
            >
              Reset Password
            </a>
          </p>

          <p>
            This link will expire in
            <b>15 minutes</b>.
          </p>

          <p>
            If you did not request this,
            please ignore this email.
          </p>
        `,
      });
    }

    if (
      process.env.NODE_ENV !==
      "production"
    ) {
      console.log(
        "RESET TOKEN (DEV ONLY):",
        rawToken
      );
    }
  }

  // =====================================================
  // RESET PASSWORD
  // =====================================================

  static async resetPassword(
    token: string,
    newPassword: string
  ) {
    const hashedToken =
      crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

    const user =
      await prisma.authUser.findFirst({
        where: {
          resetToken: hashedToken,

          resetTokenExpiry: {
            gt: new Date(),
          },
        },
      });

    if (!user) {
      throw new Error(
        "Invalid or expired reset token"
      );
    }

    const hashedPassword =
      await hashPassword(
        newPassword
      );

    await prisma.authUser.update({
      where: {
        id: user.id,
      },

      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    console.log(
      `Password reset successful for user: ${user.email}`
    );
  }
}
