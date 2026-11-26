import crypto from 'crypto';
import { dbStore, applicationsRepo, usersRepo } from '../../db';
import { emailService } from '../../services/email.service';
import { env } from '../../config/env';
import { hashPassword } from '../../utils/security';

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

export interface LoginSession {
  loginId: string;
  email: string;
  hash: string;
  salt: string;
  expiresAt: number;
  resendAvailableAt: number;
  attempts: number;
  resendCount: number;
  isRegistered: boolean;
  user?: any;
}

export interface RegisterSession {
  registrationId: string;
  name: string;
  phone: string;
  email: string;
  hash: string;
  salt: string;
  passwordHash?: string;
  passwordSalt?: string;
  expiresAt: number;
  resendAvailableAt: number;
  attempts: number;
  resendCount: number;
  verified: boolean;
}

class OtpService {
  // In-memory active OTP store with periodic cleanup
  private otpRecords = new Map<string, OtpRecord>();
  private resetRecords = new Map<string, OtpRecord>();
  private loginSessions = new Map<string, LoginSession>();
  private registerSessions = new Map<string, RegisterSession>();

  private readonly OTP_EXPIRY_MS = 10 * 60 * 1000; // 10 minutes for volunteer/reset
  private readonly RESEND_COOLDOWN_MS = 60 * 1000; // 60 seconds for volunteer/reset
  private readonly AUTH_OTP_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes for login/register
  private readonly AUTH_RESEND_COOLDOWN_MS = 30 * 1000; // 30 seconds for login/register
  private readonly MAX_ATTEMPTS = 5;
  private readonly MAX_RESENDS = 5;

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
    for (const [key, record] of this.resetRecords.entries()) {
      if (now > record.expiresAt || record.isUsed) {
        this.resetRecords.delete(key);
      }
    }
    for (const [key, session] of this.loginSessions.entries()) {
      if (now > session.expiresAt) {
        this.loginSessions.delete(key);
      }
    }
    for (const [key, session] of this.registerSessions.entries()) {
      if (now > session.expiresAt) {
        this.registerSessions.delete(key);
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

  /**
   * Request Password Reset OTP
   */
  public async requestPasswordResetOtp(email: string): Promise<{
    success: boolean;
    errorType?: 'not_found' | 'cooldown' | 'send_failed';
    message: string;
    cooldownSeconds?: number;
  }> {
    const normalized = email.toLowerCase().trim();
    const user = usersRepo.findByEmail(normalized);

    if (!user || !user.isActive) {
      // Return message without revealing account existence to prevent user enumeration
      return {
        success: true,
        message: 'If an active account exists with this email address, a password reset code has been sent.',
        cooldownSeconds: 60,
      };
    }

    // Check resend cooldown
    const existing = this.resetRecords.get(normalized);
    const now = Date.now();
    if (existing && !existing.isUsed && now < existing.resendAvailableAt) {
      const waitSeconds = Math.ceil((existing.resendAvailableAt - now) / 1000);
      return {
        success: false,
        errorType: 'cooldown',
        message: `Please wait ${waitSeconds} seconds before requesting a new reset code.`,
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

    this.resetRecords.set(normalized, record);

    const emailResult = await emailService.sendPasswordResetOtp({
      toEmail: normalized,
      userName: `${user.firstName} ${user.lastName}`.trim(),
      otp: rawOtp,
      expiresInMinutes: 10,
    });

    if (!emailResult.success) {
      return {
        success: false,
        errorType: 'send_failed',
        message: emailResult.error || 'Failed to dispatch password reset code. Please try again.',
      };
    }

    return {
      success: true,
      message: 'A 6-digit password reset code has been sent to your email address.',
      cooldownSeconds: 60,
    };
  }

  /**
   * Verify Password Reset OTP (without consuming yet)
   */
  public verifyPasswordResetOtp(
    email: string,
    inputOtp: string
  ): {
    success: boolean;
    errorType?: 'not_found' | 'expired' | 'max_attempts' | 'invalid_otp';
    message: string;
  } {
    const normalized = email.toLowerCase().trim();
    const record = this.resetRecords.get(normalized);

    if (!record) {
      return {
        success: false,
        errorType: 'not_found',
        message: 'No active password reset request found. Please request a new code.',
      };
    }

    const now = Date.now();
    if (now > record.expiresAt) {
      this.resetRecords.delete(normalized);
      return {
        success: false,
        errorType: 'expired',
        message: 'The reset code has expired. Please request a new code.',
      };
    }

    if (record.attempts >= this.MAX_ATTEMPTS) {
      this.resetRecords.delete(normalized);
      return {
        success: false,
        errorType: 'max_attempts',
        message: 'Maximum verification attempts exceeded. Please request a new reset code.',
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
        message: `Incorrect code. ${remaining} attempt${remaining === 1 ? '' : 's'} remaining.`,
      };
    }

    return {
      success: true,
      message: 'Verification code confirmed.',
    };
  }

  /**
   * Consume Password Reset OTP upon successful password reset
   */
  public consumePasswordResetOtp(email: string, inputOtp: string): boolean {
    const check = this.verifyPasswordResetOtp(email, inputOtp);
    if (!check.success) return false;
    const normalized = email.toLowerCase().trim();
    this.resetRecords.delete(normalized);
    return true;
  }

  // ==========================================
  // PASSWORDLESS LOGIN (Spec: login.md)
  // ==========================================

  public async startPasswordlessLogin(email: string): Promise<{
    loginId: string;
    otpExpiresInSec: number;
    resendAfterSec: number;
  }> {
    const normalized = email.toLowerCase().trim();
    const loginId = crypto.randomUUID();
    const now = Date.now();

    // Check if user is registered in users table or approved volunteer
    const user = usersRepo.findByEmail(normalized);
    const volunteer = !user ? this.findApprovedVolunteer(normalized) : null;
    const isRegistered = Boolean(user || (volunteer && volunteer.isApproved));

    const rawOtp = crypto.randomInt(100000, 1000000).toString();
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = this.hashOtp(rawOtp, salt);

    this.loginSessions.set(loginId, {
      loginId,
      email: normalized,
      hash,
      salt,
      expiresAt: now + this.AUTH_OTP_EXPIRY_MS,
      resendAvailableAt: now + this.AUTH_RESEND_COOLDOWN_MS,
      attempts: 0,
      resendCount: 0,
      isRegistered,
      user: user || volunteer,
    });

    // Anti-enumeration: only dispatch email if user actually exists
    if (isRegistered) {
      const recipientName = user
        ? `${user.firstName} ${user.lastName}`.trim()
        : volunteer?.name || 'Supporter';

      if (env.NODE_ENV === 'development' || env.NODE_ENV === 'test') {
        console.log(`🔑 [DEV OTP] Login OTP for ${normalized}: ${rawOtp}`);
      }

      await emailService.sendLoginOtp({
        toEmail: normalized,
        userName: recipientName,
        otp: rawOtp,
        expiresInMinutes: 5,
      });
    } else {
      if (env.NODE_ENV === 'development' || env.NODE_ENV === 'test') {
        console.log(`[Anti-Enumeration DEV] Login requested for unregistered email: ${normalized}. Code: ${rawOtp} (not emailed).`);
      }
    }

    return {
      loginId,
      otpExpiresInSec: 300,
      resendAfterSec: 30,
    };
  }

  public verifyPasswordlessLogin(loginId: string, inputOtp: string): {
    success: boolean;
    errorType?: 'OTP_EXPIRED' | 'OTP_ATTEMPTS_EXCEEDED' | 'OTP_INVALID';
    message: string;
    user?: any;
  } {
    const session = this.loginSessions.get(loginId);
    const now = Date.now();

    if (!session || now > session.expiresAt) {
      this.loginSessions.delete(loginId);
      return {
        success: false,
        errorType: 'OTP_EXPIRED',
        message: 'Verification code has expired. Please request a new code.',
      };
    }

    if (session.attempts >= this.MAX_ATTEMPTS) {
      this.loginSessions.delete(loginId);
      return {
        success: false,
        errorType: 'OTP_ATTEMPTS_EXCEEDED',
        message: 'Maximum attempts exceeded. Please request a new code.',
      };
    }

    const candidateHash = this.hashOtp(inputOtp, session.salt);
    const candidateBuf = Buffer.from(candidateHash, 'hex');
    const storedBuf = Buffer.from(session.hash, 'hex');

    const isDevMock = (env.NODE_ENV === 'development' || env.NODE_ENV === 'test') && inputOtp.trim() === '123456';
    const isMatch =
      isDevMock ||
      (candidateBuf.length === storedBuf.length &&
      crypto.timingSafeEqual(candidateBuf, storedBuf));

    if (!isMatch || !session.isRegistered) {
      session.attempts += 1;
      if (session.attempts >= this.MAX_ATTEMPTS) {
        this.loginSessions.delete(loginId);
        return {
          success: false,
          errorType: 'OTP_ATTEMPTS_EXCEEDED',
          message: 'Maximum attempts exceeded. Please request a new code.',
        };
      }
      return {
        success: false,
        errorType: 'OTP_INVALID',
        message: "That code isn't right",
      };
    }

    // OTP verified successfully
    this.loginSessions.delete(loginId);
    return {
      success: true,
      message: 'Logged in successfully.',
      user: session.user,
    };
  }

  public async resendPasswordlessLogin(loginId: string): Promise<{
    success: boolean;
    errorType?: 'INVALID_INPUT' | 'OTP_EXPIRED' | 'RATE_LIMITED';
    message: string;
    otpExpiresInSec?: number;
    resendAfterSec?: number;
  }> {
    const session = this.loginSessions.get(loginId);
    const now = Date.now();

    if (!session || now > session.expiresAt) {
      this.loginSessions.delete(loginId);
      return {
        success: false,
        errorType: 'OTP_EXPIRED',
        message: 'Session expired. Please start over.',
      };
    }

    if (session.resendCount >= this.MAX_RESENDS) {
      return {
        success: false,
        errorType: 'RATE_LIMITED',
        message: 'Maximum resend limit reached for this session.',
      };
    }

    if (now < session.resendAvailableAt) {
      const wait = Math.ceil((session.resendAvailableAt - now) / 1000);
      return {
        success: false,
        errorType: 'RATE_LIMITED',
        message: `Please wait ${wait} seconds before requesting a new code.`,
      };
    }

    const rawOtp = crypto.randomInt(100000, 1000000).toString();
    const salt = crypto.randomBytes(16).toString('hex');
    session.hash = this.hashOtp(rawOtp, salt);
    session.salt = salt;
    session.expiresAt = now + this.AUTH_OTP_EXPIRY_MS;
    session.resendAvailableAt = now + this.AUTH_RESEND_COOLDOWN_MS;
    session.resendCount += 1;
    session.attempts = 0; // reset attempts on new code

    if (session.isRegistered) {
      const recipientName = session.user
        ? `${session.user.firstName || ''} ${session.user.lastName || ''}`.trim()
        : 'Supporter';

      await emailService.sendLoginOtp({
        toEmail: session.email,
        userName: recipientName || 'Supporter',
        otp: rawOtp,
        expiresInMinutes: 5,
      });
    }

    return {
      success: true,
      message: 'A new code has been sent.',
      otpExpiresInSec: 300,
      resendAfterSec: 30,
    };
  }

  // ==========================================
  // PASSWORDLESS REGISTER (Spec: register.md)
  // ==========================================

  public async startPasswordlessRegister(name: string, phone: string, email: string, password?: string): Promise<{
    success: boolean;
    errorType?: 'EMAIL_EXISTS' | 'INVALID_INPUT';
    message?: string;
    registrationId?: string;
    otpExpiresInSec?: number;
    resendAfterSec?: number;
  }> {
    const normalized = email.toLowerCase().trim();

    // Check if email already registered in users table
    const existing = usersRepo.findByEmail(normalized);
    if (existing) {
      return {
        success: false,
        errorType: 'EMAIL_EXISTS',
        message: 'This email is already registered. Log in instead.',
      };
    }

    const registrationId = crypto.randomUUID();
    const now = Date.now();
    const rawOtp = crypto.randomInt(100000, 1000000).toString();
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = this.hashOtp(rawOtp, salt);

    let passwordHash = '';
    let passwordSalt = '';
    if (password) {
      const hashed = hashPassword(password);
      passwordHash = hashed.hash;
      passwordSalt = hashed.salt;
    }

    this.registerSessions.set(registrationId, {
      registrationId,
      name: name.trim(),
      phone: phone.trim(),
      email: normalized,
      hash,
      salt,
      passwordHash,
      passwordSalt,
      expiresAt: now + this.AUTH_OTP_EXPIRY_MS,
      resendAvailableAt: now + this.AUTH_RESEND_COOLDOWN_MS,
      attempts: 0,
      resendCount: 0,
      verified: false,
    });

    await emailService.sendRegisterOtp({
      toEmail: normalized,
      userName: name.trim(),
      otp: rawOtp,
      expiresInMinutes: 5,
    });

    return {
      success: true,
      registrationId,
      otpExpiresInSec: 300,
      resendAfterSec: 30,
    };
  }

  public verifyPasswordlessRegister(registrationId: string, inputOtp: string): {
    success: boolean;
    errorType?: 'OTP_EXPIRED' | 'OTP_ATTEMPTS_EXCEEDED' | 'OTP_INVALID';
    message: string;
    verified?: boolean;
  } {
    const session = this.registerSessions.get(registrationId);
    const now = Date.now();

    if (!session || now > session.expiresAt) {
      this.registerSessions.delete(registrationId);
      return {
        success: false,
        errorType: 'OTP_EXPIRED',
        message: 'Verification code has expired. Please request a new code.',
      };
    }

    if (session.attempts >= this.MAX_ATTEMPTS) {
      this.registerSessions.delete(registrationId);
      return {
        success: false,
        errorType: 'OTP_ATTEMPTS_EXCEEDED',
        message: 'Maximum attempts exceeded. Please request a new code.',
      };
    }

    const candidateHash = this.hashOtp(inputOtp, session.salt);
    const candidateBuf = Buffer.from(candidateHash, 'hex');
    const storedBuf = Buffer.from(session.hash, 'hex');

    const isDevMock = (env.NODE_ENV === 'development' || env.NODE_ENV === 'test') && inputOtp.trim() === '123456';
    const isMatch =
      isDevMock ||
      (candidateBuf.length === storedBuf.length &&
      crypto.timingSafeEqual(candidateBuf, storedBuf));

    if (!isMatch) {
      session.attempts += 1;
      if (session.attempts >= this.MAX_ATTEMPTS) {
        this.registerSessions.delete(registrationId);
        return {
          success: false,
          errorType: 'OTP_ATTEMPTS_EXCEEDED',
          message: 'Maximum attempts exceeded. Please request a new code.',
        };
      }
      return {
        success: false,
        errorType: 'OTP_INVALID',
        message: "That code isn't right",
      };
    }

    session.verified = true;
    return {
      success: true,
      message: 'Email verified successfully.',
      verified: true,
    };
  }

  public async resendPasswordlessRegister(registrationId: string): Promise<{
    success: boolean;
    errorType?: 'INVALID_INPUT' | 'OTP_EXPIRED' | 'RATE_LIMITED';
    message: string;
    otpExpiresInSec?: number;
    resendAfterSec?: number;
  }> {
    const session = this.registerSessions.get(registrationId);
    const now = Date.now();

    if (!session || now > session.expiresAt) {
      this.registerSessions.delete(registrationId);
      return {
        success: false,
        errorType: 'OTP_EXPIRED',
        message: 'Registration session has expired. Please start over.',
      };
    }

    if (session.resendCount >= this.MAX_RESENDS) {
      return {
        success: false,
        errorType: 'RATE_LIMITED',
        message: 'Maximum resend limit reached for this registration.',
      };
    }

    if (now < session.resendAvailableAt) {
      const wait = Math.ceil((session.resendAvailableAt - now) / 1000);
      return {
        success: false,
        errorType: 'RATE_LIMITED',
        message: `Please wait ${wait} seconds before requesting a new code.`,
      };
    }

    const rawOtp = crypto.randomInt(100000, 1000000).toString();
    const salt = crypto.randomBytes(16).toString('hex');
    session.hash = this.hashOtp(rawOtp, salt);
    session.salt = salt;
    session.expiresAt = now + this.AUTH_OTP_EXPIRY_MS;
    session.resendAvailableAt = now + this.AUTH_RESEND_COOLDOWN_MS;
    session.resendCount += 1;
    session.attempts = 0;

    await emailService.sendRegisterOtp({
      toEmail: session.email,
      userName: session.name,
      otp: rawOtp,
      expiresInMinutes: 5,
    });

    return {
      success: true,
      message: 'A new verification code has been sent.',
      otpExpiresInSec: 300,
      resendAfterSec: 30,
    };
  }

  public completePasswordlessRegister(registrationId: string, role: 'internship' | 'donor' | 'volunteer'): {
    success: boolean;
    errorType?: 'INVALID_INPUT' | 'NOT_VERIFIED' | 'EMAIL_EXISTS';
    message: string;
    user?: any;
  } {
    const session = this.registerSessions.get(registrationId);
    if (!session || !session.verified) {
      return {
        success: false,
        errorType: 'NOT_VERIFIED',
        message: 'Email must be verified before completing registration.',
      };
    }

    // Check if created in meantime
    const existing = usersRepo.findByEmail(session.email);
    if (existing) {
      this.registerSessions.delete(registrationId);
      return {
        success: false,
        errorType: 'EMAIL_EXISTS',
        message: 'An account with this email address already exists. Please log in.',
      };
    }

    const parts = session.name.split(/\s+/);
    const firstName = parts[0] || 'Member';
    const lastName = parts.slice(1).join(' ') || '';

    const newUser = usersRepo.create({
      email: session.email,
      passwordHash: session.passwordHash || '',
      salt: session.passwordSalt || '',
      firstName,
      lastName,
      phone: session.phone,
      emailVerified: true,
      isStaff: false,
      isActive: true,
      role: role as any,
    });

    this.registerSessions.delete(registrationId);

    return {
      success: true,
      message: 'Account created successfully.',
      user: {
        id: newUser.id,
        name: `${newUser.firstName} ${newUser.lastName}`.trim(),
        phone: newUser.phone || session.phone,
        email: newUser.email,
        emailVerified: true,
        role: newUser.role,
        createdAt: newUser.createdAt,
      },
    };
  }
}

export const otpService = new OtpService();
