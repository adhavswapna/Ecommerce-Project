import sendEmail from "./kafka/sendEmail";

(async () => {
  try {
    await sendEmail(
      "swapnaadhav123@gmail.com", // recipient
      "Test Email from Email-Service", // subject
      "<p>This is a test email sent directly via sendEmail.ts</p>" // HTML body
    );
    console.log("✅ Test email sent successfully");
  } catch (err) {
    console.error("🔥 Failed to send test email:", err);
  }
})();

