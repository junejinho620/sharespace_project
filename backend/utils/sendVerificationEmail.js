const nodemailer = require('nodemailer');
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: 'gmail', // Use 'gmail' or your provider (e.g., "outlook", "yahoo")
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

/**
 * Sends a verification email to the specified user.
 * @param {string} to - The recipient's email address.
 * @param {string} token - The verification token to include in the URL.
 */
async function sendVerificationEmail(to, token) {
  const verificationLink = `http://localhost:5000/api/users/verify?token=${token}`;
  const mailOptions = {
    from: `"ShareSpace" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Please verify your email - ShareSpace",
    html: `
      <h2>Welcome to ShareSpace! 🎉</h2>
      <p>To complete your signup, please verify your email by clicking the button below:</p>
      <a href="${verificationLink}" style="display:inline-block;padding:10px 20px;background:#4CAF50;color:white;text-decoration:none;border-radius:5px;">Verify Email</a>
      <p>If the button doesn't work, copy and paste this URL into your browser:</p>
      <p>${verificationLink}</p>
      <br>
      <p>Thanks,<br>Team ShareSpace</p>
    `,
  };

  await transporter.sendMail(mailOptions);
}

module.exports = sendVerificationEmail;