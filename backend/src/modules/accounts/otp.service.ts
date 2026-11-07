import crypto from 'crypto';
import { dbStore, applicationsRepo } from '../../db';
import { emailService } from '../../services/email.service';

interface OtpRecord {
  email: string;
  hash: string;
  salt: string;
  expiresAt: number;
  resendAvailableAt: number;
  attempts: number;
  isUsed: boolean;
  createdAt: number;
}

class OtpService {
  // In-memory active OTP store with periodic cleanup
  private otpRecords = new Map<string, OtpRecord>();
  private readonly OTP_EXPIRY_MS = 10 * 60 * 1000; // 10 minutes
  private readonly RESEND_COOLDOWN_MS = 60 * 1000; // 60 seconds
  private readonly MAX_ATTEMPTS = 5;

  constructor() {
    // Periodic garbage collection every 5 minutes
    setInterval(() => this.cleanupExpired(), 5 * 60 * 1000);
  }

  private hashOtp(otp: string, salt: string): string {
    return crypto.createHmac('sha256', salt).update(otp.trim()).digest('hex');
  }

  private cleanupExpired(): void {
    const now = Date.now();
    for (const [key, record] of this.otpRecords.entries()) {
      if (now > record.expiresAt || record.isUsed) {
        this.otpRecords.delete(key);
      }
    }
  }

  /**
   * Check if email belongs to an approved volunteer.
   * Checks both volunteerApplications (status === 'accepted') and users (role === 'volunteer').
   */
  public findApprovedVolunteer(email: string) {
    const normalized = email.toLowerCase().trim();

    // 1. Check volunteerApplications
    const apps = applicationsRepo.findAllVolunteer();
    const app = apps.find(
      (a) => a.email.toLowerCase().trim() === normalized && !a.is_deleted
    );

    if (app) {
      if (app.status === 'accepted') {
        return {
          id: app.id,
          name: app.name,
          email: app.email,
          status: app.status,
          isApproved: true,
          phone: app.phone,
          location: app.location,
          skills: app.skills,
        };
      }
      return {
        id: app.id,
        name: app.name,
        email: app.email,
        status: app.status,
        isApproved: false,
      };
    }

    // 2. Check users collection
    const user = dbStore.getState().users.find(
      (u) => u.email.toLowerCase().trim() === normalized && u.isActive
    );
    if (user && user.role === 'volunteer') {
      return {
        id: user.id,
        name: `${user.firstName} ${user.lastName}`.trim(),
        email: user.email,
        status: 'accepted' as const,
        isApproved: true,
      };
    }

    return null;
  }

  /**
   * Request OTP generation & dispatch
   */
  public async requestOtp(email: string): Promise<{
    success: boolean;
    errorType?: 'not_found' | 'not_approved' | 'cooldown' | 'send_failed';
    message: string;
    cooldownSeconds?: number;
  }> {
    const normalized = email.toLowerCase().trim();
    const volunteer = this.findApprovedVolunteer(normalized);

    if (!volunteer) {
      return {
        success: false,
        errorType: 'not_found',
        message: 'No volunteer record found with this email address. Please register as a volunteer first.',
      };
    }

    if (!volunteer.isApproved) {
      return {
        success: false,
        errorType: 'not_approved',
        message: `Your volunteer application is currently "${volunteer.status}". Only approved volunteers can access the portal.`,
      };
    }

    // Check resend cooldown
    const existing = this.otpRecords.get(normalized);
    const now = Date.now();
    if (existing && !existing.isUsed && now < existing.resendAvailableAt) {
      const waitSeconds = Math.ceil((existing.resendAvailableAt - now) / 1000);
      return {
        success: false,
        errorType: 'cooldown',
        message: `Please wait ${waitSeconds} seconds before requesting a new code.`,
        cooldownSeconds: waitSeconds,
      };
    }

    // Generate 6-digit cryptographically secure OTP
    const rawOtp = crypto.randomInt(100000, 1000000).toString();
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = this.hashOtp(rawOtp, salt);

    const record: OtpRecord = {
      email: normalized,
      hash,
      salt,
      expiresAt: now + this.OTP_EXPIRY_MS,
      resendAvailableAt: now + this.RESEND_COOLDOWN_MS,
      attempts: 0,
      isUsed: false,
      createdAt: now,
    };

    this.otpRecords.set(normalized, record);

    // Send email via EmailService
    const emailResult = await emailService.sendVolunteerOtp({
      toEmail: normalized,
      volunteerName: volunteer.name,
      otp: rawOtp,
      expiresInMinutes: 10,
    });

    if (!emailResult.success) {
      return {
        success: false,
        errorType: 'send_failed',
        message: emailResult.error || 'Failed to dispatch email verification code. Please try again.',
      };
    }

    return {
      success: true,
      message: 'A 6-digit verification code has been sent to your email address.',
      cooldownSeconds: 60,
    };
  }

  /**
   * Verify entered OTP code
   */
  public verifyOtp(
    email: string,
    inputOtp: string
  ): {
    success: boolean;
    errorType?: 'not_found' | 'expired' | 'max_attempts' | 'invalid_otp' | 'already_used' | 'not_approved';
    message: string;
    volunteer?: {
      id: string;
      name: string;
      email: string;
      role: 'volunteer';
    };
  } {
    const normalized = email.toLowerCase().trim();
    const record = this.otpRecords.get(normalized);

    if (!record) {
      return {
        success: false,
        errorType: 'not_found',
        message: 'No verification code was requested for this email or it has already expired.',
      };
    }

    if (record.isUsed) {
      return {
        success: false,
        errorType: 'already_used',
        message: 'This verification code has already been used. Please request a new code.',
      };
    }

    const now = Date.now();
    if (now > record.expiresAt) {
      this.otpRecords.delete(normalized);
      return {
        success: false,
        errorType: 'expired',
        message: 'Verification code has expired. Please request a new code.',
      };
    }

    if (record.attempts >= this.MAX_ATTEMPTS) {
      this.otpRecords.delete(normalized);
      return {
        success: false,
        errorType: 'max_attempts',
        message: 'Too many incorrect attempts. For security, this code has been invalidated. Please request a new code.',
      };
    }

    const candidateHash = this.hashOtp(inputOtp, record.salt);
    const candidateBuf = Buffer.from(candidateHash, 'hex');
    const storedBuf = Buffer.from(record.hash, 'hex');

    const isMatch =
      candidateBuf.length === storedBuf.length &&
      crypto.timingSafeEqual(candidateBuf, storedBuf);

    if (!isMatch) {
      record.attempts += 1;
      const remaining = this.MAX_ATTEMPTS - record.attempts;
      return {
        success: false,
        errorType: 'invalid_otp',
        message: `Incorrect verification code. ${remaining} attempt${remaining === 1 ? '' : 's'} remaining.`,
      };
    }

    // Mark as used immediately to prevent reuse
    record.isUsed = true;
    this.otpRecords.delete(normalized);

    const volunteer = this.findApprovedVolunteer(normalized);
    if (!volunteer || !volunteer.isApproved) {
      return {
        success: false,
        errorType: 'not_approved',
        message: 'Volunteer account is no longer approved.',
      };
    }

    return {
      success: true,
      message: 'Verification successful.',
      volunteer: {
        id: volunteer.id,
        name: volunteer.name,
        email: volunteer.email,
        role: 'volunteer',
      },
    };
  }
}

export const otpService = new OtpService();
