import nodemailer from "nodemailer";
import crypto from "node:crypto";
import config from "../config/config.js";

const generateOtp = () => {
  return crypto.randomInt(100000, 1000000).toString();
};

const hashOtp = (otp) => {
  return crypto.createHash("sha256").update(otp).digest("hex");
};

// Verify that SMTP credentials exist without printing secrets.
if (!config.EMAIL_USER || !config.EMAIL_APP_PASSWORD) {
  console.error("[SMTP CONFIG] EMAIL_USER or EMAIL_APP_PASSWORD is missing.");
}

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  requireTLS: true,
  auth: {
    user: config.EMAIL_USER,
    pass: config.EMAIL_APP_PASSWORD,
  },
});

export { generateOtp, hashOtp };

export const sendVerificationEmail = async (email, otp) => {
  const mailOptions = {
    from: `"Wolvo" <${config.EMAIL_USER}>`,
    to: email,
    subject: "Verify your email address – Wolvo",
    text: `Your Wolvo verification code is ${otp}. It expires in 10 minutes.`,
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="color-scheme" content="dark" />
  <meta name="supported-color-schemes" content="dark" />
  <title>Verify your email</title>
</head>
<body style="margin:0; padding:0; background-color:#05060D;">
  <!-- Preheader (inbox preview text) -->
  <div style="display:none; max-height:0; overflow:hidden; opacity:0;">
    Your Wolvo verification code is inside. It expires in 10 minutes.
  </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
    style="background-color:#05060D; background-image:radial-gradient(ellipse at 50% 0%, rgba(63,66,190,0.35), rgba(5,6,13,0) 60%), linear-gradient(rgba(63,66,190,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(63,66,190,0.07) 1px, transparent 1px); background-size:100% 100%, 32px 32px, 32px 32px; padding:40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
          style="max-width:480px; text-align:center; background-color:#0C0E1F; border:1px solid #20235A; border-radius:20px; overflow:hidden; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">

          <!-- Accent bar -->
          <tr>
            <td height="3" bgcolor="#3F42BE" style="height:3px; line-height:3px; font-size:0; background-image:linear-gradient(90deg,#3F42BE,#7C5CFF,#35D0FF);">&nbsp;</td>
          </tr>

          <!-- Header / Logo (centered) -->
          <tr>
            <td align="center" style="padding:34px 32px 0 32px;">
              <!-- Logo -->
              <img
              src="https://ik.imagekit.io/w5wx4gdmoj/wolvo-logo.png"
              width="72"
              height="72"
             alt="Wolvo Logo"
             style="display:block; margin:0 auto; width:72px; height:72px; border:0; object-fit:contain;"
          />
              <div style="margin-top:16px; font-size:19px; font-weight:700; color:#FFFFFF; letter-spacing:7px; text-transform:uppercase;">Wolvo</div>
              <div style="margin-top:8px; font-family:'SF Mono','Courier New',monospace; font-size:10px; letter-spacing:2px; color:#6F72D8; text-transform:uppercase;">● Secure</div>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px 32px 0 32px;">
              <div style="font-family:'SF Mono','Courier New',monospace; font-size:11px; letter-spacing:3px; color:#6F72D8; text-transform:uppercase; margin-bottom:10px;">
                Identity check
              </div>
              <h2 style="margin:0 0 12px 0; font-size:26px; line-height:1.25; color:#FFFFFF; font-weight:700;">Verify your email</h2>
              <p style="margin:0; font-size:15px; line-height:1.65; color:#9EA1C7;">
                Enter the one-time code below to confirm your email address and activate your Wolvo account.
              </p>
            </td>
          </tr>

          <!-- Verification code -->
          <tr>
            <td align="center" style="padding:30px 32px 0 32px;">
              <div style="border-radius:14px; background-color:#3F42BE; background-image:linear-gradient(135deg,#3F42BE,#7C5CFF 55%,#35D0FF); padding:1px;">
                <div style="background-color:#0A0C1C; border-radius:13px; padding:22px 16px; font-size:36px; font-weight:700; letter-spacing:12px; text-indent:12px; color:#CFD0FF; text-align:center; font-family:'SF Mono','Courier New',monospace; text-shadow:0 0 18px rgba(124,92,255,0.55);">
                  ${otp}
                </div>
              </div>
            </td>
          </tr>

          <!-- Expiry chip -->
          <tr>
            <td align="center" style="padding:20px 32px 0 32px;">
              <span style="display:inline-block; font-family:'SF Mono','Courier New',monospace; font-size:11px; letter-spacing:2px; text-transform:uppercase; color:#9EA1C7; border:1px solid #20235A; background-color:#0A0C1C; border-radius:999px; padding:8px 16px;">
                Valid for <span style="color:#FFFFFF;">10 min</span>
              </span>
            </td>
          </tr>

          <!-- Footer note -->
          <tr>
            <td style="padding:28px 32px 32px 32px;">
              <div style="height:1px; background-color:#1A1D48; line-height:1px; font-size:0; margin-bottom:18px;">&nbsp;</div>
              <p style="margin:0; font-size:13px; line-height:1.6; color:#7C7FB0;">
                Didn't request this? You can safely ignore this email — no changes will be made to your account.
              </p>
            </td>
          </tr>
        </table>

        <p style="margin:18px 0 0 0; font-family:Arial,sans-serif; font-size:11px; letter-spacing:1px; color:#5B5E88;">
          © ${new Date().getFullYear()} WOLVO · ALL RIGHTS RESERVED
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.error("[MAIL] Failed to send verification email:", err.message);
    throw err;
  }
};
