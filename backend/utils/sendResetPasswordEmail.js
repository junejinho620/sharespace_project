const nodemailer = require('nodemailer');
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: 'gmail', // Use 'gmail' or your provider (e.g., "outlook", "yahoo")
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

async function sendResetPasswordEmail(to, link) {
  const mailOptions = {
    from: `"ShareSpace" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Reset your password • ShareSpace",
    html: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width,initial-scale=1" />
      <title>Reset your ShareSpace password</title>
      <style>
        body,table,td,a{ -webkit-text-size-adjust:100%; -ms-text-size-adjust:100% }
        table,td{ mso-table-lspace:0pt; mso-table-rspace:0pt }
        img{ -ms-interpolation-mode:bicubic; border:0; outline:none; text-decoration:none }
        body{ margin:0; padding:0; width:100%!important; height:100%!important; font-family:Arial,Helvetica,sans-serif; background:#f4f6fa }
        .container{ max-width:600px; margin:0 auto; background:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 4px 14px rgba(0,0,0,.08) }
        .header{ background:#74512D; padding:32px 24px; text-align:center }
        .header h1{ color:#ffffff; font-size:24px; margin:0; letter-spacing:0.5px }
        .content{ padding:32px 24px 40px; color:#333333; line-height:1.6; font-size:16px }
        .btn{ display:inline-block; padding:14px 28px; margin:24px 0; background:#AF8F6F; color:#ffffff!important; border-radius:6px; text-decoration:none; font-weight:bold }
        .subtext{ font-size:13px; color:#888888; word-break:break-all }
        .footer{ text-align:center; padding:24px; font-size:12px; color:#aaaaaa }
        @media only screen and (max-width:600px){
          .content{ padding:24px 18px 32px }
          .header h1{ font-size:22px }
        }
      </style>
    </head>
    <body>
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
        <tr>
          <td align="center" style="padding:24px 0;">
            <table role="presentation" class="container" width="100%" cellspacing="0" cellpadding="0" border="0">
              <!-- Header -->
              <tr>
                <td class="header">
                  <h1>Password Reset Requested</h1>
                </td>
              </tr>
              <!-- Body -->
              <tr>
                <td class="content">
                  <p>Hi there 👋,</p>
                  <p>We received a request to reset your password for your ShareSpace account. Click the button below to set a new password:</p>
                  <p style="text-align:center;">
                    <a href="${link}" class="btn">Reset My Password</a>
                  </p>
                  <p>If you didn’t request this, you can safely ignore this email.</p>
                  <p>If the button doesn’t work, copy and paste this link into your browser:</p>
                  <p class="subtext">${link}</p>
                  <p>Stay safe and see you soon inside&nbsp;ShareSpace!</p>
                  <p style="margin:32px 0 0;">— The ShareSpace Team</p>
                </td>
              </tr>
              <!-- Footer -->
              <tr>
                <td class="footer">
                  &copy; ${new Date().getFullYear()} ShareSpace · All&nbsp;rights&nbsp;reserved
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
    `,
  };
  await transporter.sendMail(mailOptions);
}

module.exports = sendResetPasswordEmail;