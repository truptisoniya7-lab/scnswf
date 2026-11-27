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
            pass: env.SMTP_PASSWORD.replace(/\s+/g, ''),
          },
          tls: {
            rejectUnauthorized: false,
          },
        });
        console.log(`📧 Email service initialized via SMTP (${env.SMTP_HOST}:${env.SMTP_PORT})`);
        this.transporter.verify((err, success) => {
          if (err) {
            console.warn('⚠️ SMTP connection verification failed (common on cloud free-tiers blocking port 465):', err.message);
          } else {
            console.log('✅ SMTP connection verified successfully:', success);
          }
        });
      } catch (err) {
        console.warn('⚠️ Failed to initialize SMTP transporter:', err);
        this.transporter = null;
      }
    } else {
      console.log('ℹ️ SMTP credentials not configured. Will check for HTTPS email APIs.');
    }
  }

  /**
   * Unified dispatcher:
   * 1. Resend HTTPS REST API (Port 443 - works everywhere including Render Free Tier)
   * 2. Brevo HTTPS REST API (Port 443 - works on Render Free Tier)
   * 3. Nodemailer SMTP (Port 465 / 587 - works locally and on paid cloud instances)
   * 4. Dev simulation mode (when running in test/dev without credentials)
   */
  private async dispatchEmail({
    toEmail,
    subject,
    text,
    html,
  }: {
    toEmail: string;
    subject: string;
    text: string;
    html: string;
  }): Promise<{ success: boolean; simulated?: boolean; error?: string }> {
    // 1. Resend HTTPS REST API (Bypasses Render SMTP port blocking)
    if (env.RESEND_API_KEY) {
      try {
        const res = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${env.RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: env.SMTP_FROM?.includes('<') ? env.SMTP_FROM : `SCNSWF <${env.SMTP_FROM || 'onboarding@resend.dev'}>`,
            to: [toEmail],
            subject,
            text,
            html,
          }),
        });

        if (res.ok) {
          console.log(`✅ [EmailService:Resend] Email delivered via HTTPS to ${toEmail}`);
          return { success: true };
        } else {
          const errData = await res.json().catch(() => ({}));
          console.error(`❌ [EmailService:Resend] Error:`, errData);
        }
      } catch (err: any) {
        console.error('❌ [EmailService:Resend] Exception:', err.message);
      }
    }

    // 2. Brevo HTTPS REST API (Port 443)
    if (env.BREVO_API_KEY) {
      try {
        const res = await fetch('https://api.brevo.com/v3/smtp/email', {
          method: 'POST',
          headers: {
            'api-key': env.BREVO_API_KEY,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sender: { email: env.SMTP_FROM || 'info@scnswf.org', name: 'SCNSWF' },
            to: [{ email: toEmail }],
            subject,
            textContent: text,
            htmlContent: html,
          }),
        });

        if (res.ok) {
          console.log(`✅ [EmailService:Brevo] Email delivered via HTTPS to ${toEmail}`);
          return { success: true };
        } else {
          const errData = await res.text().catch(() => '');
          console.error(`❌ [EmailService:Brevo] Error:`, errData);
        }
      } catch (err: any) {
        console.error('❌ [EmailService:Brevo] Exception:', err.message);
      }
    }

    // 3. Nodemailer SMTP (Port 465 / 587)
    if (this.transporter) {
      try {
        await this.transporter.sendMail({
          from: env.SMTP_FROM,
          to: toEmail,
          subject,
          text,
          html,
        });
        console.log(`✅ [EmailService:SMTP] Email sent via SMTP to ${toEmail}`);
        return { success: true };
      } catch (err: any) {
        console.error('❌ [EmailService:SMTP] SMTP error:', err.message || err);
        return {
          success: false,
          error:
            'Failed to dispatch email via SMTP. Note: Render Free Tier blocks outbound SMTP ports 465/587. Please add RESEND_API_KEY or upgrade Render instance.',
        };
      }
    }

    // 4. Dev simulation mode
    if (env.NODE_ENV === 'development' || env.NODE_ENV === 'test') {
      console.log(`\n======================================================`);
      console.log(`[DEV OTP SIMULATION] To: ${toEmail}`);
      console.log(`[DEV OTP SIMULATION] Subject: ${subject}`);
      console.log(`======================================================\n`);
      return { success: true, simulated: true };
    }

    return {
      success: false,
      error: 'No email service configured. Please provide SMTP credentials or RESEND_API_KEY in server environment.',
    };
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

    return this.dispatchEmail({
      toEmail,
      subject: `${otp} is your SCNSWF Volunteer Login Code`,
      text: `Your SCNSWF verification code is: ${otp}. It expires in ${expiresInMinutes} minutes.`,
      html: htmlContent,
    });
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

    return this.dispatchEmail({
      toEmail,
      subject: `${otp} is your SCNSWF Password Reset Code`,
      text: `Your SCNSWF password reset code is: ${otp}. It expires in ${expiresInMinutes} minutes.`,
      html: htmlContent,
    });
  }

  public async sendLoginOtp({
    toEmail,
    userName = 'Supporter',
    otp,
    expiresInMinutes = 5,
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
  <title>SCNSWF Login Verification Code</title>
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
      <div class="subtitle">Social Welfare Foundation • Secure Login</div>
    </div>
    <div class="content">
      <div class="greeting">Hello, ${userName}!</div>
      <p style="color: #475569; font-size: 15px; line-height: 1.6;">
        Here is your one-time verification code to log in to your SCNSWF account.
      </p>
      <div class="otp-container">
        <div class="otp-code">${otp}</div>
        <div class="note">This single-use code expires in ${expiresInMinutes} minutes.</div>
      </div>
      <p style="font-size: 13px; color: #64748b; line-height: 1.6;">
        If you did not request this code, no action is needed. Never share your verification code with anyone.
      </p>
    </div>
    <div class="footer">
      Together for a healthier and greener planet.<br>
      © ${new Date().getFullYear()} SCNSWF. All rights reserved.
    </div>
  </div>
</body>
</html>
`;

    return this.dispatchEmail({
      toEmail,
      subject: `${otp} is your SCNSWF Login Code`,
      text: `Your SCNSWF login code is: ${otp}. It expires in ${expiresInMinutes} minutes.`,
      html: htmlContent,
    });
  }

  public async sendRegisterOtp({
    toEmail,
    userName = 'Supporter',
    otp,
    expiresInMinutes = 5,
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
  <title>SCNSWF Registration Verification Code</title>
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
      <div class="subtitle">Social Welfare Foundation • Verify Email</div>
    </div>
    <div class="content">
      <div class="greeting">Welcome, ${userName}!</div>
      <p style="color: #475569; font-size: 15px; line-height: 1.6;">
        Thank you for joining SCNSWF. Use the verification code below to verify your email address.
      </p>
      <div class="otp-container">
        <div class="otp-code">${otp}</div>
        <div class="note">This single-use code expires in ${expiresInMinutes} minutes.</div>
      </div>
      <p style="font-size: 13px; color: #64748b; line-height: 1.6;">
        If you did not request to create an account, please disregard this email.
      </p>
    </div>
    <div class="footer">
      Together for a healthier and greener planet.<br>
      © ${new Date().getFullYear()} SCNSWF. All rights reserved.
    </div>
  </div>
</body>
</html>
`;

    return this.dispatchEmail({
      toEmail,
      subject: `${otp} is your SCNSWF Email Verification Code`,
      text: `Your SCNSWF email verification code is: ${otp}. It expires in ${expiresInMinutes} minutes.`,
      html: htmlContent,
    });
  }

  public async sendGenericEmail({
    toEmail,
    subject,
    bodyText,
    html,
  }: {
    toEmail: string;
    subject: string;
    bodyText: string;
    html?: string;
  }): Promise<{ success: boolean; error?: string }> {
    return this.dispatchEmail({
      toEmail,
      subject,
      text: bodyText,
      html: html || `<p>${bodyText.replace(/\n/g, '<br/>')}</p>`,
    });
  }
}

export const emailService = new EmailService();
