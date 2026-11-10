import nodemailer, { type Transporter } from 'nodemailer';
import { env } from '../config/env';

interface SendOtpOptions {
  toEmail: string;
  volunteerName: string;
  otp: string;
  expiresInMinutes?: number;
}

class EmailService {
  private transporter: Transporter | null = null;

  constructor() {
    this.initTransporter();
  }

  private initTransporter(): void {
    if (env.SMTP_USER && env.SMTP_PASSWORD) {
      try {
        this.transporter = nodemailer.createTransport({
          host: env.SMTP_HOST,
          port: env.SMTP_PORT,
          secure: env.SMTP_SECURE, // true for 465, false for 587
          auth: {
            user: env.SMTP_USER,
            pass: env.SMTP_PASSWORD,
          },
        });
        console.log(`📧 Email service initialized via Zoho/SMTP (${env.SMTP_HOST}:${env.SMTP_PORT})`);
      } catch (err) {
        console.warn('⚠️ Failed to initialize SMTP transporter:', err);
        this.transporter = null;
      }
    } else {
      console.log('ℹ️ SMTP credentials not configured. OTP will be processed in secure dev/simulation mode.');
    }
  }

  public async sendVolunteerOtp({
    toEmail,
    volunteerName,
    otp,
    expiresInMinutes = 10,
  }: SendOtpOptions): Promise<{ success: boolean; simulated?: boolean; error?: string }> {
    const brandForestGreen = '#174B3B';
    const brandGold = '#D5AA60';
    const brandCream = '#FBFAF6';

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>SCNSWF Volunteer Portal Login Code</title>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: ${brandCream}; margin: 0; padding: 24px; color: #26382F; }
    .card { max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(23,75,59,0.08); border: 1px solid #EAF2EC; }
    .header { background: ${brandForestGreen}; padding: 32px 24px; text-align: center; color: #ffffff; }
    .logo-text { font-size: 24px; font-weight: 700; letter-spacing: 0.5px; margin: 0; }
    .subtitle { font-size: 13px; color: ${brandGold}; text-transform: uppercase; letter-spacing: 1.5px; margin-top: 6px; }
    .content { padding: 36px 32px; text-align: left; }
    .greeting { font-size: 18px; font-weight: 600; margin-bottom: 12px; }
    .otp-container { text-align: center; margin: 28px 0; padding: 20px; background: #EAF2EC; border-radius: 12px; border: 1px dashed ${brandForestGreen}; }
    .otp-code { font-size: 38px; font-weight: 800; letter-spacing: 10px; color: ${brandForestGreen}; font-family: monospace; }
    .note { font-size: 13px; color: #849087; line-height: 1.5; margin-top: 8px; }
    .footer { background: #f8faf7; padding: 20px 32px; text-align: center; font-size: 12px; color: #849087; border-top: 1px solid #EAF2EC; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h1 class="logo-text">SCNSWF</h1>
      <div class="subtitle">Social Welfare Foundation • Volunteer Portal</div>
    </div>
    <div class="content">
      <div class="greeting">Hello, ${volunteerName || 'Valued Volunteer'}!</div>
      <p style="color: #475569; font-size: 15px; line-height: 1.6;">
        Use the following one-time verification code to securely access the SCNSWF Volunteer Portal.
      </p>
      <div class="otp-container">
        <div class="otp-code">${otp}</div>
        <div class="note">This single-use code expires in ${expiresInMinutes} minutes.</div>
      </div>
      <p style="font-size: 13px; color: #64748b; line-height: 1.6;">
        If you did not request this verification code, please ignore this email or contact support. Never share your verification code with anyone.
      </p>
    </div>
    <div class="footer">
      Making a difference, one life at a time.<br>
      © ${new Date().getFullYear()} SCNSWF. All rights reserved.
    </div>
  </div>
</body>
</html>
`;

    // If transporter is available and configured
    if (this.transporter) {
      try {
        await this.transporter.sendMail({
          from: env.SMTP_FROM,
          to: toEmail,
          subject: `${otp} is your SCNSWF Volunteer Login Code`,
          text: `Your SCNSWF verification code is: ${otp}. It expires in ${expiresInMinutes} minutes.`,
          html: htmlContent,
        });
        return { success: true };
      } catch (err: any) {
        console.error('❌ Failed to send OTP email via SMTP:', err.message || err);
        // Fallback or report error
        return { success: false, error: 'Failed to dispatch email. Please verify SMTP configuration.' };
      }
    }

    // Dev/simulation mode when SMTP credentials are not yet entered in environment
    if (env.NODE_ENV === 'development' || env.NODE_ENV === 'test') {
      console.log(`\n======================================================`);
      console.log(`[DEV OTP SIMULATION] Volunteer: ${volunteerName} <${toEmail}>`);
      console.log(`[DEV OTP SIMULATION] Verification Code: ${otp}`);
      console.log(`[DEV OTP SIMULATION] Valid for ${expiresInMinutes} minutes`);
      console.log(`======================================================\n`);
    } else {
      console.log(`[EmailService] OTP generated for volunteer ${toEmail} (SMTP not configured on server)`);
    }

    return { success: true, simulated: true };
  }

  public async sendPasswordResetOtp({
    toEmail,
    userName = 'Valued Member',
    otp,
    expiresInMinutes = 10,
  }: {
    toEmail: string;
    userName?: string;
    otp: string;
    expiresInMinutes?: number;
  }): Promise<{ success: boolean; simulated?: boolean; error?: string }> {
    const brandForestGreen = '#174B3B';
    const brandGold = '#D5AA60';
    const brandCream = '#FBFAF6';

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>SCNSWF Password Reset Code</title>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: ${brandCream}; margin: 0; padding: 24px; color: #26382F; }
    .card { max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(23,75,59,0.08); border: 1px solid #EAF2EC; }
    .header { background: ${brandForestGreen}; padding: 32px 24px; text-align: center; color: #ffffff; }
    .logo-text { font-size: 24px; font-weight: 700; letter-spacing: 0.5px; margin: 0; }
    .subtitle { font-size: 13px; color: ${brandGold}; text-transform: uppercase; letter-spacing: 1.5px; margin-top: 6px; }
    .content { padding: 36px 32px; text-align: left; }
    .greeting { font-size: 18px; font-weight: 600; margin-bottom: 12px; }
    .otp-container { text-align: center; margin: 28px 0; padding: 20px; background: #EAF2EC; border-radius: 12px; border: 1px dashed ${brandForestGreen}; }
    .otp-code { font-size: 38px; font-weight: 800; letter-spacing: 10px; color: ${brandForestGreen}; font-family: monospace; }
    .note { font-size: 13px; color: #849087; line-height: 1.5; margin-top: 8px; }
    .footer { background: #f8faf7; padding: 20px 32px; text-align: center; font-size: 12px; color: #849087; border-top: 1px solid #EAF2EC; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h1 class="logo-text">SCNSWF</h1>
      <div class="subtitle">Social Welfare Foundation • Account Security</div>
    </div>
    <div class="content">
      <div class="greeting">Hello, ${userName}!</div>
      <p style="color: #475569; font-size: 15px; line-height: 1.6;">
        We received a request to reset your password for your SCNSWF account. Use the verification code below to complete your password reset:
      </p>
      <div class="otp-container">
        <div class="otp-code">${otp}</div>
        <div class="note">This single-use code expires in ${expiresInMinutes} minutes.</div>
      </div>
      <p style="font-size: 13px; color: #64748b; line-height: 1.6;">
        If you did not request a password reset, you can safely ignore this email. Your password will remain unchanged.
      </p>
    </div>
    <div class="footer">
      Making a difference, one life at a time.<br>
      © ${new Date().getFullYear()} SCNSWF. All rights reserved.
    </div>
  </div>
</body>
</html>
`;

    if (this.transporter) {
      try {
        await this.transporter.sendMail({
          from: env.SMTP_FROM,
          to: toEmail,
          subject: `${otp} is your SCNSWF Password Reset Code`,
          text: `Your SCNSWF password reset code is: ${otp}. It expires in ${expiresInMinutes} minutes.`,
          html: htmlContent,
        });
        return { success: true };
      } catch (err: any) {
        console.error('❌ Failed to send password reset OTP via SMTP:', err.message || err);
        return { success: false, error: 'Failed to dispatch email. Please verify SMTP configuration.' };
      }
    }

    if (env.NODE_ENV === 'development' || env.NODE_ENV === 'test') {
      console.log(`\n======================================================`);
      console.log(`[DEV PASSWORD RESET OTP] User: ${userName} <${toEmail}>`);
      console.log(`[DEV PASSWORD RESET OTP] Verification Code: ${otp}`);
      console.log(`[DEV PASSWORD RESET OTP] Valid for ${expiresInMinutes} minutes`);
      console.log(`======================================================\n`);
    } else {
      console.log(`[EmailService] Password reset OTP generated for ${toEmail}`);
    }

    return { success: true, simulated: true };
  }
}

export const emailService = new EmailService();
