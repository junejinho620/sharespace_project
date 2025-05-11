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
  const mailOptions = {
    from: `"ShareSpace" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Your ShareSpace Verification Code',
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>Verify Your ShareSpace Email</title>
      </head>
      <body style="margin:0;padding:0;background:#f4f4f4;font-family:Inter,Arial,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 4px 14px rgba(0,0,0,0.1);">
                <!-- Header -->
                <tr>
                  <td align="center" style="background:#a48d65;padding:24px;">
                    <h1 style="margin:0;color:#fff;font-family:'Playfair Display',serif;font-size:24px;">
                      Welcome to ShareSpace
                    </h1>
                  </td>
                </tr>
                <!-- Body -->
                <tr>
                  <td style="padding:32px 24px;color:#333;font-size:16px;line-height:1.5;">
                    <p>Hi there 👋,</p>
                    <p>Thanks for signing up! To verify your email and secure your account, please enter the code below:</p>
                    <p style="text-align:center;margin:32px 0;">
                      <span style="display:inline-block;padding:16px 24px;font-size:32px;letter-spacing:8px;background:#f0f0f0;border-radius:6px;">
                        ${token}
                      </span>
                    </p>
                    <p>If you didn’t request this, you can safely ignore this email.</p>
                    <p style="margin-top:24px;">Cheers,<br>The ShareSpace Team</p>
                  </td>
                </tr>
                <!-- Footer -->
                <tr>
                  <td align="center" style="padding:16px;font-size:12px;color:#888;">
                    &copy; ${new Date().getFullYear()} ShareSpace · All rights reserved
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `
  };

  await transporter.sendMail(mailOptions);
}

module.exports = sendVerificationEmail;