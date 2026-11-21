import { Request, Response } from 'express';
import {
  usersRepo,
  applicationsRepo,
  donationsRepo,
  programsRepo,
  eventsRepo,
  galleryRepo,
  impactRepo,
  auditRepo,
  dbStore,
} from '../../db';
import { sendSuccess, sendPaginated, sendError } from '../../utils/response';
import { emailService } from '../../services/email.service';

export const adminController = {
  // ==========================================
  // 1. DASHBOARD & STATS
  // ==========================================
  getOverview: async (req: Request, res: Response): Promise<void> => {
    const state = dbStore.getState();
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const users = state.users || [];
    const totalUsers = users.length;
    const newUsersThisMonth = users.filter((u) => new Date(u.createdAt) >= firstDayOfMonth).length;

    // Applications
    const volApps = state.volunteerApplications || [];
    const internApps = state.internshipApplications || [];
    const pendingVol = volApps.filter((a) => !a.is_deleted && (a.status === 'new' || (a.status as string) === 'pending')).length;
    const pendingIntern = internApps.filter((a) => !a.is_deleted && (a.status === 'new' || (a.status as string) === 'pending')).length;
    const pendingApplications = pendingVol + pendingIntern;

    // Donations this month
    const donations = (state.donations || []).filter((d) => !d.is_deleted && d.status === 'succeeded');
    const thisMonthDonations = donations.filter((d) => new Date(d.created_at) >= firstDayOfMonth);
    const donationsThisMonthAmount = thisMonthDonations.reduce((acc, curr) => acc + (curr.amount || 0), 0);
    const donationsThisMonthCount = thisMonthDonations.length;
    const totalDonationsAmount = donations.reduce((acc, curr) => acc + (curr.amount || 0), 0);

    // Recent activity: last 10 audit logs and 5 newest pending applications
    const recentAudit = [...(state.auditLogs || [])]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 10);

    const unifiedApps = applicationsRepo.findAllUnified({ status: 'pending', pageSize: 5 });

    sendSuccess(res, {
      totalUsers,
      newUsersThisMonth,
      pendingApplications,
      donationsThisMonthAmount,
      donationsThisMonthCount,
      totalDonationsAmount,
      recentAudit,
      recentApplications: unifiedApps.data,
    });
  },

  getRegistrationsChart: async (req: Request, res: Response): Promise<void> => {
    const days = parseInt(req.query.days as string, 10) || 30;
    const state = dbStore.getState();
    const users = state.users || [];
    const now = Date.now();
    const cutoff = now - days * 24 * 60 * 60 * 1000;

    // Group by date
    const dateMap: Record<string, number> = {};
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now - i * 24 * 60 * 60 * 1000);
      const key = d.toISOString().split('T')[0];
      dateMap[key] = 0;
    }

    users.forEach((u) => {
      const uTime = new Date(u.createdAt).getTime();
      if (uTime >= cutoff) {
        const key = u.createdAt.split('T')[0];
        if (dateMap[key] !== undefined) {
          dateMap[key] += 1;
        }
      }
    });

    const timeline = Object.entries(dateMap).map(([date, count]) => ({ date, count }));

    // Role breakdown
    const roleCounts = {
      volunteer: 0,
      internship: 0,
      donor: 0,
      other: 0,
    };

    users.forEach((u) => {
      const regRole = u.registrationRole || (u.role as string);
      if (regRole === 'volunteer') roleCounts.volunteer++;
      else if (regRole === 'internship') roleCounts.internship++;
      else if (regRole === 'donor') roleCounts.donor++;
      else roleCounts.other++;
    });

    sendSuccess(res, {
      timeline,
      roles: [
        { name: 'Volunteers', value: roleCounts.volunteer },
        { name: 'Interns', value: roleCounts.internship },
        { name: 'Donors', value: roleCounts.donor },
      ],
    });
  },

  getDonationsChart: async (req: Request, res: Response): Promise<void> => {
    const state = dbStore.getState();
    const donations = (state.donations || []).filter((d) => !d.is_deleted && d.status === 'succeeded');

    // Last 6 months bar chart
    const monthMap: Record<string, { month: string; amount: number; count: number }> = {};
    const now = new Date();

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const monthLabel = d.toLocaleString('default', { month: 'short' });
      monthMap[key] = { month: monthLabel, amount: 0, count: 0 };
    }

    donations.forEach((d) => {
      const date = new Date(d.created_at);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (monthMap[key]) {
        monthMap[key].amount += d.amount || 0;
        monthMap[key].count += 1;
      }
    });

    sendSuccess(res, Object.values(monthMap));
  },

  // ==========================================
  // 2. USERS MANAGEMENT
  // ==========================================
  listUsers: async (req: Request, res: Response): Promise<void> => {
    const { q, role, systemRole, status, verified, page, pageSize } = req.query;
    const parsedPage = parseInt(page as string, 10) || 1;
    const parsedPageSize = parseInt(pageSize as string, 10) || 25;
    const isVerified = verified !== undefined ? verified === 'true' : undefined;

    const result = usersRepo.findAll({
      q: q as string,
      role: role as string,
      systemRole: systemRole as string,
      status: status as string,
      verified: isVerified,
      page: parsedPage,
      pageSize: parsedPageSize,
    });

    sendPaginated(res, result.data, result.meta);
  },

  getUser: async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const user = usersRepo.findById(id);
    if (!user) {
      sendError(res, 404, 'not_found', 'User not found.');
      return;
    }

    const state = dbStore.getState();
    const normalizedEmail = user.email.toLowerCase().trim();

    // Linked applications
    const volApps = (state.volunteerApplications || []).filter((a) => a.email.toLowerCase() === normalizedEmail);
    const internApps = (state.internshipApplications || []).filter((a) => a.email.toLowerCase() === normalizedEmail);
    const linkedDonations = (state.donations || []).filter(
      (d) => d.donor_email?.toLowerCase() === normalizedEmail || d.id === user.id
    );

    sendSuccess(res, {
      user,
      linkedApplications: {
        volunteer: volApps,
        internship: internApps,
      },
      linkedDonations,
    });
  },

  updateUser: async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { name, phone, registrationRole, status } = req.body;

    const existing = usersRepo.findById(id);
    if (!existing) {
      sendError(res, 404, 'not_found', 'User not found.');
      return;
    }

    const updated = usersRepo.update(id, {
      name,
      phone,
      registrationRole,
      status,
      isActive: status !== 'suspended',
    });

    auditRepo.log({
      actor_user_id: req.user?.userId || 'admin',
      actor_email: req.user?.email || 'admin@scnswf.org',
      action: 'user.update',
      entity_type: 'User',
      entity_id: id,
      details: { before: existing, after: updated },
    });

    sendSuccess(res, updated);
  },

  suspendUser: async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const target = usersRepo.findById(id);
    if (!target) {
      sendError(res, 404, 'not_found', 'User not found.');
      return;
    }

    if (target.role === 'super_admin' || target.systemRole === 'superadmin') {
      sendError(res, 403, 'forbidden', 'Cannot suspend a superadmin account.');
      return;
    }

    const updated = usersRepo.suspend(id);
    auditRepo.log({
      actor_user_id: req.user?.userId || 'admin',
      actor_email: req.user?.email || 'admin@scnswf.org',
      action: 'user.suspend',
      entity_type: 'User',
      entity_id: id,
      details: { targetEmail: target.email },
    });

    sendSuccess(res, { message: 'User suspended successfully.', user: updated });
  },

  reactivateUser: async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const target = usersRepo.findById(id);
    if (!target) {
      sendError(res, 404, 'not_found', 'User not found.');
      return;
    }

    const updated = usersRepo.reactivate(id);
    auditRepo.log({
      actor_user_id: req.user?.userId || 'admin',
      actor_email: req.user?.email || 'admin@scnswf.org',
      action: 'user.reactivate',
      entity_type: 'User',
      entity_id: id,
      details: { targetEmail: target.email },
    });

    sendSuccess(res, { message: 'User reactivated successfully.', user: updated });
  },

  deleteUser: async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const target = usersRepo.findById(id);
    if (!target) {
      sendError(res, 404, 'not_found', 'User not found.');
      return;
    }

    if (target.role === 'super_admin' || target.systemRole === 'superadmin') {
      sendError(res, 403, 'forbidden', 'Cannot delete a superadmin account.');
      return;
    }

    usersRepo.delete(id);
    auditRepo.log({
      actor_user_id: req.user?.userId || 'admin',
      actor_email: req.user?.email || 'admin@scnswf.org',
      action: 'user.delete',
      entity_type: 'User',
      entity_id: id,
      details: { targetEmail: target.email },
    });

    sendSuccess(res, { message: 'User deleted permanently.' });
  },

  changeSystemRole: async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { systemRole } = req.body;

    const target = usersRepo.findById(id);
    if (!target) {
      sendError(res, 404, 'not_found', 'User not found.');
      return;
    }

    const updated = usersRepo.changeSystemRole(id, systemRole);
    auditRepo.log({
      actor_user_id: req.user?.userId || 'admin',
      actor_email: req.user?.email || 'admin@scnswf.org',
      action: 'user.change_system_role',
      entity_type: 'User',
      entity_id: id,
      details: { targetEmail: target.email, previousRole: target.systemRole, newRole: systemRole },
    });

    sendSuccess(res, { message: `System role changed to ${systemRole}.`, user: updated });
  },

  // ==========================================
  // 3. APPLICATIONS MANAGEMENT
  // ==========================================
  listApplications: async (req: Request, res: Response): Promise<void> => {
    const { type, status, q, page, pageSize } = req.query;
    const parsedPage = parseInt(page as string, 10) || 1;
    const parsedPageSize = parseInt(pageSize as string, 10) || 25;

    const result = applicationsRepo.findAllUnified({
      type: type as string,
      status: status as string,
      q: q as string,
      page: parsedPage,
      pageSize: parsedPageSize,
    });

    sendPaginated(res, result.data, result.meta);
  },

  getApplication: async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const app = applicationsRepo.findUnifiedById(id);
    if (!app) {
      sendError(res, 404, 'not_found', 'Application not found.');
      return;
    }
    sendSuccess(res, app);
  },

  updateApplicationStatus: async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { status, reason } = req.body;

    if (status === 'rejected' && !reason) {
      sendError(res, 400, 'reason_required', 'A reason is required when rejecting an application.');
      return;
    }

    const app = applicationsRepo.findUnifiedById(id);
    if (!app) {
      sendError(res, 404, 'not_found', 'Application not found.');
      return;
    }

    const actor = req.user?.email || 'Admin';
    const updated = applicationsRepo.updateUnifiedStatus(id, status, actor, reason);

    auditRepo.log({
      actor_user_id: req.user?.userId || 'admin',
      actor_email: req.user?.email || 'admin@scnswf.org',
      action: `application.${status}`,
      entity_type: 'Application',
      entity_id: id,
      details: { previousStatus: app.status, newStatus: status, reason },
    });

    // Fire email notification to applicant
    if (status === 'approved') {
      emailService.sendGenericEmail({
        toEmail: app.email,
        subject: `Your ${app.type === 'internship' ? 'Internship' : 'Volunteer'} Application has been Approved!`,
        bodyText: `Dear ${app.applicantName},\n\nWe are pleased to inform you that your application for the ${app.type} program at Suresh Chandra Nayak Social Welfare Foundation has been approved!\n\nOur team will contact you soon with next steps.\n\nWarm regards,\nSCNSWF Team`,
      }).catch((e: any) => console.warn('[Email] App approved email warning:', e));
    } else if (status === 'rejected') {
      emailService.sendGenericEmail({
        toEmail: app.email,
        subject: `Update regarding your ${app.type === 'internship' ? 'Internship' : 'Volunteer'} Application`,
        bodyText: `Dear ${app.applicantName},\n\nThank you for your interest in SCNSWF. At this time, we are unable to accept your application.\n\nReason: ${reason}\n\nWe encourage you to apply again in the future.\n\nWarm regards,\nSCNSWF Team`,
      }).catch((e: any) => console.warn('[Email] App rejected email warning:', e));
    }

    sendSuccess(res, { message: `Application marked as ${status}.`, application: updated });
  },

  addApplicationNote: async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { text } = req.body;
    const authorId = req.user?.userId || 'admin';
    const authorName = req.user?.name || req.user?.email || 'Admin Staff';

    const note = applicationsRepo.addUnifiedNote(id, authorId, authorName, text);
    if (!note) {
      sendError(res, 404, 'not_found', 'Application not found.');
      return;
    }

    auditRepo.log({
      actor_user_id: authorId,
      actor_email: req.user?.email || 'admin@scnswf.org',
      action: 'application.add_note',
      entity_type: 'Application',
      entity_id: id,
      details: { noteId: note.id },
    });

    sendSuccess(res, note, 201);
  },

  bulkApplications: async (req: Request, res: Response): Promise<void> => {
    const { ids, action, reason } = req.body;
    const actor = req.user?.email || 'Admin';
    const targetStatus = action === 'approve' ? 'approved' : 'rejected';

    const results = ids.map((id: string) => {
      return applicationsRepo.updateUnifiedStatus(id, targetStatus, actor, reason);
    });

    auditRepo.log({
      actor_user_id: req.user?.userId || 'admin',
      actor_email: req.user?.email || 'admin@scnswf.org',
      action: `application.bulk_${action}`,
      entity_type: 'Application',
      entity_id: 'multiple',
      details: { count: ids.length, action, reason },
    });

    sendSuccess(res, { message: `Successfully updated ${results.filter(Boolean).length} applications.` });
  },

  // ==========================================
  // 4. DONATIONS MANAGEMENT
  // ==========================================
  listDonations: async (req: Request, res: Response): Promise<void> => {
    const { status, q, startDate, endDate, minAmount, maxAmount, page, pageSize } = req.query;
    const parsedPage = parseInt(page as string, 10) || 1;
    const parsedPageSize = parseInt(pageSize as string, 10) || 25;

    const result = donationsRepo.findAllFiltered({
      status: status as string,
      q: q as string,
      startDate: startDate as string,
      endDate: endDate as string,
      minAmount: minAmount ? parseFloat(minAmount as string) : undefined,
      maxAmount: maxAmount ? parseFloat(maxAmount as string) : undefined,
      page: parsedPage,
      pageSize: parsedPageSize,
    });

    // Summary strip for current filtered set
    const state = dbStore.getState();
    const activeDonations = (state.donations || []).filter((d) => !d.is_deleted && d.status === 'succeeded');
    const totalAmount = activeDonations.reduce((sum, d) => sum + (d.amount || 0), 0);
    const totalCount = activeDonations.length;

    res.status(200).json({
      data: result.data,
      meta: result.meta,
      summary: {
        totalAmount,
        totalCount,
      },
    });
  },

  getDonation: async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const donation = donationsRepo.findById(id);
    if (!donation) {
      sendError(res, 404, 'not_found', 'Donation not found.');
      return;
    }
    sendSuccess(res, donation);
  },

  createManualDonation: async (req: Request, res: Response): Promise<void> => {
    const { donor_name, donor_email, donor_phone, amount, currency, method, notes, program_id } = req.body;

    const donation = donationsRepo.createManual({
      donor_name,
      donor_email,
      donor_phone,
      amount,
      currency,
      method,
      notes,
      program_id,
    });

    auditRepo.log({
      actor_user_id: req.user?.userId || 'admin',
      actor_email: req.user?.email || 'admin@scnswf.org',
      action: 'donation.create_manual',
      entity_type: 'Donation',
      entity_id: donation.id,
      details: { amount, donor_name, donor_email, method },
    });

    // Dispatch receipt
    emailService.sendGenericEmail({
      toEmail: donor_email,
      subject: `Donation Receipt - SCNSWF Foundation (#${donation.receipt_number})`,
      bodyText: `Dear ${donor_name},\n\nThank you for your generous contribution of ₹${amount} to Suresh Chandra Nayak Social Welfare Foundation.\n\nReceipt Number: ${donation.receipt_number}\nDate: ${new Date(donation.created_at).toLocaleDateString()}\nStatus: Confirmed (${method})\n\nWith gratitude,\nSCNSWF Team`,
    }).catch((e: any) => console.warn('[Email] Receipt email warning:', e));

    sendSuccess(res, donation, 201);
  },

  updateDonationStatus: async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { status } = req.body;

    const updated = donationsRepo.updateStatus(id, status);
    if (!updated) {
      sendError(res, 404, 'not_found', 'Donation not found.');
      return;
    }

    auditRepo.log({
      actor_user_id: req.user?.userId || 'admin',
      actor_email: req.user?.email || 'admin@scnswf.org',
      action: `donation.status_${status}`,
      entity_type: 'Donation',
      entity_id: id,
      details: { newStatus: status },
    });

    sendSuccess(res, updated);
  },

  resendDonationReceipt: async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const donation = donationsRepo.findById(id);
    if (!donation) {
      sendError(res, 404, 'not_found', 'Donation not found.');
      return;
    }

    if (!donation.donor_email) {
      sendError(res, 400, 'no_email', 'Donation record does not have an associated email address.');
      return;
    }

    await emailService.sendGenericEmail({
      toEmail: donation.donor_email,
      subject: `Duplicate Receipt - SCNSWF Foundation (#${donation.receipt_number})`,
      bodyText: `Dear ${donation.donor_name || 'Supporter'},\n\nHere is your receipt for your donation of ₹${donation.amount}.\n\nReceipt Number: ${donation.receipt_number}\nDate: ${new Date(donation.created_at).toLocaleDateString()}\nStatus: ${donation.status}\n\nSCNSWF Foundation`,
    });

    auditRepo.log({
      actor_user_id: req.user?.userId || 'admin',
      actor_email: req.user?.email || 'admin@scnswf.org',
      action: 'donation.resend_receipt',
      entity_type: 'Donation',
      entity_id: id,
      details: { sentTo: donation.donor_email },
    });

    sendSuccess(res, { message: `Receipt successfully sent to ${donation.donor_email}.` });
  },

  // ==========================================
  // 5. WEBSITE CONTENT MANAGEMENT
  // ==========================================
  listContent: async (req: Request, res: Response): Promise<void> => {
    const { type } = req.params;
    const state = dbStore.getState();

    switch (type) {
      case 'programs':
        sendSuccess(res, state.programs || []);
        break;
      case 'events':
        sendSuccess(res, state.events || []);
        break;
      case 'gallery':
        sendSuccess(res, state.galleryAlbums || []);
        break;
      case 'news':
      case 'stories':
        sendSuccess(res, state.impactStories || []);
        break;
      default:
        sendError(res, 400, 'invalid_type', `Unsupported content type: ${type}`);
    }
  },

  createContent: async (req: Request, res: Response): Promise<void> => {
    const { type } = req.params;
    let created: any = null;

    if (type === 'programs') {
      created = programsRepo.create(req.body);
    } else if (type === 'events') {
      created = eventsRepo.create(req.body);
    } else if (type === 'gallery') {
      created = galleryRepo.createAlbum(req.body);
    } else if (type === 'stories' || type === 'news') {
      created = impactRepo.createStory(req.body);
    } else {
      sendError(res, 400, 'invalid_type', `Unsupported content type: ${type}`);
      return;
    }

    auditRepo.log({
      actor_user_id: req.user?.userId || 'admin',
      actor_email: req.user?.email || 'admin@scnswf.org',
      action: `content.create_${type}`,
      entity_type: type,
      entity_id: created.id,
      details: { title: created.title },
    });

    sendSuccess(res, created, 201);
  },

  deleteContent: async (req: Request, res: Response): Promise<void> => {
    const { type, id } = req.params;

    if (type === 'programs') {
      programsRepo.delete(id);
    } else {
      // In-place delete for other types
      dbStore.update((state) => {
        if (type === 'events') {
          state.events = (state.events || []).filter((e) => e.id !== id);
        } else if (type === 'gallery') {
          state.galleryAlbums = (state.galleryAlbums || []).filter((a) => a.id !== id);
        } else if (type === 'stories' || type === 'news') {
          state.impactStories = (state.impactStories || []).filter((s) => s.id !== id);
        }
      });
    }

    auditRepo.log({
      actor_user_id: req.user?.userId || 'admin',
      actor_email: req.user?.email || 'admin@scnswf.org',
      action: `content.delete_${type}`,
      entity_type: type,
      entity_id: id,
      details: { type, id },
    });

    sendSuccess(res, { message: `${type} item deleted successfully.` });
  },

  // ==========================================
  // 6. AUDIT LOG (Superadmin Only)
  // ==========================================
  listAudit: async (req: Request, res: Response): Promise<void> => {
    const { actorId, action, entityType, page, pageSize } = req.query;
    const parsedPage = parseInt(page as string, 10) || 1;
    const parsedPageSize = parseInt(pageSize as string, 10) || 25;

    const result = auditRepo.findAllFiltered({
      actorId: actorId as string,
      action: action as string,
      entityType: entityType as string,
      page: parsedPage,
      pageSize: parsedPageSize,
    });

    sendPaginated(res, result.data, result.meta);
  },

  getAudit: async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const entry = auditRepo.findById(id);
    if (!entry) {
      sendError(res, 404, 'not_found', 'Audit entry not found.');
      return;
    }
    sendSuccess(res, entry);
  },

  // ==========================================
  // 7. SETTINGS & STAFF MANAGEMENT
  // ==========================================
  getSettings: async (req: Request, res: Response): Promise<void> => {
    const state = dbStore.getState();
    const staff = (state.users || []).filter(
      (u) => u.isStaff || u.systemRole === 'staff' || u.systemRole === 'superadmin' || u.role === 'super_admin'
    );

    sendSuccess(res, {
      siteName: 'Suresh Chandra Nayak Social Welfare Foundation',
      contactEmail: 'contact@scnswf.org',
      contactPhone: '+91 94370 00000',
      staffCount: staff.length,
      staff,
    });
  },

  listStaff: async (req: Request, res: Response): Promise<void> => {
    const state = dbStore.getState();
    const staff = (state.users || []).filter(
      (u) => u.isStaff || u.systemRole === 'staff' || u.systemRole === 'superadmin' || u.role === 'super_admin'
    );
    sendSuccess(res, staff);
  },

  // ==========================================
  // 8. CSV EXPORT
  // ==========================================
  exportCsv: async (req: Request, res: Response): Promise<void> => {
    const { entity } = req.params;
    const state = dbStore.getState();
    const today = new Date().toISOString().split('T')[0];

    // CSV injection sanitizer
    const sanitizeCsv = (val: any) => {
      if (val === null || val === undefined) return '""';
      let str = String(val).replace(/"/g, '""');
      if (str.startsWith('=') || str.startsWith('+') || str.startsWith('-') || str.startsWith('@')) {
        str = `'${str}`;
      }
      return `"${str}"`;
    };

    let filename = `scnswf-${entity}-${today}.csv`;
    let headers: string[] = [];
    let rows: any[][] = [];

    if (entity === 'users') {
      headers = ['ID', 'Name', 'Email', 'Phone', 'Registration Role', 'System Role', 'Status', 'Verified', 'Created At'];
      const users = state.users || [];
      rows = users.map((u) => [
        u.id,
        `${u.firstName || ''} ${u.lastName || ''}`.trim() || u.name || 'User',
        u.email,
        u.phone || '',
        u.registrationRole || u.role,
        u.systemRole || (u.role === 'super_admin' ? 'superadmin' : u.isStaff ? 'staff' : 'user'),
        u.status || (u.isActive ? 'active' : 'suspended'),
        u.emailVerified ? 'Yes' : 'No',
        u.createdAt,
      ]);
    } else if (entity === 'applications') {
      headers = ['ID', 'Type', 'Applicant Name', 'Email', 'Phone', 'Status', 'Submitted At'];
      const apps = applicationsRepo.findAllUnified({ pageSize: 50000 }).data;
      rows = apps.map((a: any) => [
        a.id,
        a.type,
        a.applicantName,
        a.email,
        a.phone || '',
        a.status,
        a.submittedAt,
      ]);
    } else if (entity === 'donations') {
      headers = ['ID', 'Receipt Number', 'Donor Name', 'Donor Email', 'Donor Phone', 'Amount (INR)', 'Currency', 'Status', 'Created At'];
      const donations = state.donations || [];
      rows = donations.map((d) => [
        d.id,
        d.receipt_number || '',
        d.donor_name || 'Anonymous',
        d.donor_email || '',
        d.donor_phone || '',
        d.amount,
        d.currency,
        d.status,
        d.created_at,
      ]);
    } else {
      sendError(res, 400, 'invalid_entity', `Export entity '${entity}' is not supported.`);
      return;
    }

    const csvContent = [
      headers.map(sanitizeCsv).join(','),
      ...rows.map((row) => row.map(sanitizeCsv).join(',')),
    ].join('\r\n');

    auditRepo.log({
      actor_user_id: req.user?.userId || 'admin',
      actor_email: req.user?.email || 'admin@scnswf.org',
      action: `export.csv_${entity}`,
      entity_type: entity,
      entity_id: 'export',
      details: { rowCount: rows.length, filename },
    });

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.status(200).send(csvContent);
  },
};
