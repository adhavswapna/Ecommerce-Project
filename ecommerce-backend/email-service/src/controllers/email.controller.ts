import { Request, Response } from "express";
import { sendEmail } from "../services/email.service";

export const sendEmailController = async (
  req: Request,
  res: Response
) => {
  try {
    const { to, subject, text, html } = req.body;

    await sendEmail({ to, subject, text, html });

    res.status(200).json({
      success: true,
      message: "Email sent successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to send email",
    });
  }
};

