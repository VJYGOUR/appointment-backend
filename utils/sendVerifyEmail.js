import nodemailer from "nodemailer";

const sendVerificationEmail = async (email, token) => {
  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST, // e.g. smtp.gmail.com
      port: process.env.EMAIL_PORT, // e.g. 587
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Verification link (frontend or backend route)
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${token}`;

    // Email options
    const mailOptions = {
      from: `"YourApp Support" <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: "Verify your email",
      html: `
        <h3>Welcome to YourApp 🎉</h3>
        <p>Please verify your email by clicking the link below:</p>
        <a href="${verificationUrl}" target="_blank">Verify Email</a>
        <p>This link will expire in 24 hours.</p>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);
    console.log(`✅ Verification email sent to ${email}`);
  } catch (error) {
    console.error("❌ Error sending verification email:", error);
    throw new Error("Email could not be sent");
  }
};
export default sendVerificationEmail;
