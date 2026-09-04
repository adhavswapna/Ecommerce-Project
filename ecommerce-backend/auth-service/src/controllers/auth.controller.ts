import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { Role } from "../constants/role.enum";
import { registerSchema } from "../validators/auth.validator";

export class AuthController {
  // =====================================================
  // REGISTER USER
  // =====================================================

  static registerUser = async (
    req: Request,
    res: Response
  ) => {
    try {
      const data = registerSchema.parse(req.body);

      const result = await AuthService.register(
        data.name,
        data.email,
        data.password,
        Role.USER,
        data.phone,
        data.address
      );

      return res.status(201).json({
        success: true,
        token: result.token,
        userId: result.userId,
        user: result.user,
      });
    } catch (err: any) {
      console.error(
        "Register User Error:",
        err
      );

      return res.status(400).json({
        success: false,
        message:
          err.message ||
          "User registration failed",
      });
    }
  };

  // =====================================================
  // REGISTER VENDOR
  //
  // PUBLIC
  //
  // NEW REAL-WORLD FLOW:
  //
  // Vendor
  //    ↓
  // Vendor enters:
  // name
  // email
  // password
  // phone
  // address
  //    ↓
  // Auth Service creates AuthUser
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
  //
  // Vendor does NOT receive a JWT here.
  //
  // Vendor must wait for Admin approval.
  // =====================================================

  static registerVendor = async (
    req: Request,
    res: Response
  ) => {
    try {
      const {
        name,
        email,
        password,
        phone,
        address,
      } = req.body;

      // -------------------------------------------------
      // VALIDATION
      // -------------------------------------------------

      if (!name || !name.trim()) {
        return res.status(400).json({
          success: false,
          message:
            "Vendor name is required",
        });
      }

      if (!email || !email.trim()) {
        return res.status(400).json({
          success: false,
          message:
            "Vendor email is required",
        });
      }

      if (!password) {
        return res.status(400).json({
          success: false,
          message:
            "Vendor password is required",
        });
      }

      if (password.length < 8) {
        return res.status(400).json({
          success: false,
          message:
            "Vendor password must be at least 8 characters",
        });
      }

      // -------------------------------------------------
      // REGISTER VENDOR
      // -------------------------------------------------

      const result =
        await AuthService.registerVendor(
          name,
          email,
          password,
          phone,
          address
        );

      // -------------------------------------------------
      // IMPORTANT
      //
      // No token is returned.
      //
      // Vendor has to wait for admin approval.
      // -------------------------------------------------

      return res.status(201).json({
        success: true,

        message:
          "Vendor registration submitted successfully. Your account is pending admin approval.",

        userId: result.userId,

        status: result.status,

        user: result.user,
      });
    } catch (err: any) {
      console.error(
        "Register Vendor Error:",
        err
      );

      return res.status(400).json({
        success: false,
        message:
          err.message ||
          "Vendor registration failed",
      });
    }
  };

  // =====================================================
  // REGISTER ADMIN
  //
  // ADMIN ONLY
  // =====================================================

  static registerAdmin = async (
    req: Request,
    res: Response
  ) => {
    try {
      const {
        name,
        email,
        password,
        phone,
        address,
      } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({
          success: false,
          message:
            "Name, email and password are required",
        });
      }

      if (password.length < 8) {
        return res.status(400).json({
          success: false,
          message:
            "Password must be at least 8 characters",
        });
      }

      const result =
        await AuthService.register(
          name,
          email,
          password,
          Role.ADMIN,
          phone,
          address
        );

      return res.status(201).json({
        success: true,
        token: result.token,
        userId: result.userId,
        user: result.user,
      });
    } catch (err: any) {
      console.error(
        "Register Admin Error:",
        err
      );

      return res.status(400).json({
        success: false,
        message:
          err.message ||
          "Admin registration failed",
      });
    }
  };

  // =====================================================
  // LOGIN
  // =====================================================

  static login = async (
    req: Request,
    res: Response
  ) => {
    try {
      const {
        email,
        password,
      } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message:
            "Email and password are required",
        });
      }

      const token =
        await AuthService.login(
          email,
          password
        );

      return res.json({
        success: true,
        token,
      });
    } catch (err: any) {
      console.error(
        "Login Error:",
        err
      );

      const message =
        err.message ||
        "Login failed";

      // -------------------------------------------------
      // VENDOR APPROVAL ERRORS
      // -------------------------------------------------
      //
      // These are not credential errors.
      //
      // The account exists, but vendor access is
      // not currently allowed.
      // -------------------------------------------------

      if (
        message.includes(
          "pending admin approval"
        ) ||
        message.includes(
          "application has been rejected"
        ) ||
        message.includes(
          "vendor account is not approved"
        )
      ) {
        return res.status(403).json({
          success: false,
          message,
        });
      }

      // -------------------------------------------------
      // NORMAL LOGIN ERROR
      // -------------------------------------------------

      return res.status(401).json({
        success: false,
        message,
      });
    }
  };

  // =====================================================
  // GOOGLE LOGIN REDIRECT
  // =====================================================

  static googleLogin = async (
    _req: Request,
    res: Response
  ) => {
    try {
      const { url } =
        AuthService.getGoogleAuthUrl();

      console.log(
        "🔵 Google login redirect"
      );

      console.log(
        "🔵 Google Redirect URI:",
        process.env.GOOGLE_REDIRECT_URI
      );

      return res.redirect(url);
    } catch (err) {
      console.error(
        "🔥 Google login error:",
        err
      );

      return res.status(500).json({
        message:
          "Google login failed",
      });
    }
  };

  // =====================================================
  // GOOGLE CALLBACK
  // =====================================================

  static googleCallback = async (
    req: Request,
    res: Response
  ) => {
    try {
      console.log(
        "=========================================="
      );

      console.log(
        "🔥 GOOGLE CALLBACK RECEIVED"
      );

      console.log(
        "🔥 Callback URL:",
        req.originalUrl
      );

      console.log(
        "🔥 Query parameters:",
        req.query
      );

      console.log(
        "=========================================="
      );

      const {
        code,
        error,
        error_description,
        state,
      } = req.query;

      if (error) {
        console.error(
          "❌ Google OAuth error:",
          {
            error,
            error_description,
            state,
          }
        );

        return res.status(400).json({
          message:
            "Google authorization failed",
          error,
          error_description,
        });
      }

      if (!code) {
        console.error(
          "❌ Google authorization code missing"
        );

        return res.status(400).json({
          message:
            "Google authorization code missing",
          query: req.query,
        });
      }

      console.log(
        "✅ Google authorization code received"
      );

      const result =
        await AuthService.googleCallback(
          code as string
        );

      const frontendUrl =
        process.env.FRONTEND_URL ||
        "http://localhost:3000";

      console.log(
        "✅ Google authentication successful"
      );

      console.log(
        "🔵 Redirecting to frontend:",
        `${frontendUrl}/login-success`
      );

      return res.redirect(
        `${frontendUrl}/login-success?token=${result.token}`
      );
    } catch (err: any) {
      console.error(
        "=========================================="
      );

      console.error(
        "🔥 GOOGLE AUTHENTICATION ERROR"
      );

      console.error(err);

      if (err?.response?.data) {
        console.error(
          "🔥 Google/API response:",
          err.response.data
        );
      }

      console.error(
        "=========================================="
      );

      return res.status(500).json({
        message:
          "Google authentication failed",
      });
    }
  };

  // =====================================================
  // GET CURRENT USER
  // =====================================================

  static me = async (
    req: Request & {
      user?: any;
    },
    res: Response
  ) => {
    try {
      if (!req.user?.userId) {
        return res.status(401).json({
          message:
            "Unauthorized",
        });
      }

      const user =
        await AuthService.getMe(
          req.user.userId
        );

      if (!user) {
        return res.status(404).json({
          message:
            "User not found",
        });
      }

      return res.json(user);
    } catch (err) {
      console.error(
        "Get current user error:",
        err
      );

      return res.status(401).json({
        message:
          "Unauthorized",
      });
    }
  };

  // =====================================================
  // FORGOT PASSWORD
  // =====================================================

  static forgotPassword = async (
    req: Request,
    res: Response
  ) => {
    try {
      const { email } =
        req.body;

      if (!email) {
        return res.status(400).json({
          message:
            "Email is required",
        });
      }

      await AuthService.forgotPassword(
        email
      );

      return res.json({
        message:
          "If the email exists, a reset link has been sent. Check your inbox.",
      });
    } catch (err) {
      console.error(
        "🔥 forgotPassword error:",
        err
      );

      /*
       * Return the same response even if an error
       * occurs so we do not expose account existence.
       */
      return res.json({
        message:
          "If the email exists, a reset link has been sent. Check your inbox.",
      });
    }
  };

  // =====================================================
  // RESET / SET PASSWORD
  // =====================================================

  static resetPassword = async (
    req: Request,
    res: Response
  ) => {
    try {
      const {
        token,
        newPassword,
      } = req.body;

      if (!token || !newPassword) {
        return res.status(400).json({
          message:
            "Token and new password are required",
        });
      }

      if (newPassword.length < 8) {
        return res.status(400).json({
          message:
            "Password must be at least 8 characters",
        });
      }

      await AuthService.resetPassword(
        token,
        newPassword
      );

      return res.json({
        success: true,
        message:
          "Password set successfully. You can now login.",
      });
    } catch (err: any) {
      console.error(
        "🔥 resetPassword error:",
        err
      );

      return res.status(400).json({
        success: false,
        message:
          err.message ||
          "Invalid or expired token",
      });
    }
  };
}
