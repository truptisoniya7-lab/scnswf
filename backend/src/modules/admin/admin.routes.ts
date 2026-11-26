import { Router } from 'express';
import { adminController } from './admin.controller';
import { authenticate, authorize } from '../../middleware/auth';
import { validateRequest } from '../../middleware/validate';
import {
  userUpdateSchema,
  systemRoleUpdateSchema,
  applicationStatusSchema,
  applicationNoteSchema,
  bulkApplicationsSchema,
  manualDonationSchema,
  donationStatusSchema,
} from './admin.schema';

const router = Router();

// Staff+ roles can access general admin panel
const staffRoles = ['staff', 'superadmin', 'super_admin', 'admin', 'content_editor', 'applications_reviewer'];
const superadminRoles = ['superadmin', 'super_admin'];

// Require authentication for all admin routes
router.use(authenticate);

// ==========================================
// 1. STATS & DASHBOARD (staff+)
// ==========================================
router.get('/stats/overview', authorize(staffRoles), adminController.getOverview);
router.get('/stats/registrations', authorize(staffRoles), adminController.getRegistrationsChart);
router.get('/stats/donations', authorize(staffRoles), adminController.getDonationsChart);

// ==========================================
// 2. USERS (staff+ read/update, superadmin delete/role)
// ==========================================
router.get('/users', authorize(staffRoles), adminController.listUsers);
router.get('/users/:id', authorize(staffRoles), adminController.getUser);
router.patch('/users/:id', authorize(staffRoles), validateRequest({ body: userUpdateSchema }), adminController.updateUser);
router.post('/users/:id/suspend', authorize(staffRoles), adminController.suspendUser);
router.post('/users/:id/reactivate', authorize(staffRoles), adminController.reactivateUser);
router.delete('/users/:id', authorize(superadminRoles), adminController.deleteUser);
router.patch(
  '/users/:id/system-role',
  authorize(superadminRoles),
  validateRequest({ body: systemRoleUpdateSchema }),
  adminController.changeSystemRole
);

// ==========================================
// 3. APPLICATIONS (staff+)
// ==========================================
router.get('/applications', authorize(staffRoles), adminController.listApplications);
router.get('/applications/:id', authorize(staffRoles), adminController.getApplication);
router.patch(
  '/applications/:id/status',
  authorize(staffRoles),
  validateRequest({ body: applicationStatusSchema }),
  adminController.updateApplicationStatus
);
router.post(
  '/applications/:id/notes',
  authorize(staffRoles),
  validateRequest({ body: applicationNoteSchema }),
  adminController.addApplicationNote
);
router.post(
  '/applications/bulk',
  authorize(staffRoles),
  validateRequest({ body: bulkApplicationsSchema }),
  adminController.bulkApplications
);

// ==========================================
// 4. DONATIONS (staff+)
// ==========================================
router.get('/donations', authorize(staffRoles), adminController.listDonations);
router.get('/donations/:id', authorize(staffRoles), adminController.getDonation);
router.post(
  '/donations',
  authorize(staffRoles),
  validateRequest({ body: manualDonationSchema }),
  adminController.createManualDonation
);
router.patch(
  '/donations/:id/status',
  authorize(staffRoles),
  validateRequest({ body: donationStatusSchema }),
  adminController.updateDonationStatus
);
router.post('/donations/:id/resend-receipt', authorize(staffRoles), adminController.resendDonationReceipt);

// ==========================================
// 5. CONTENT (staff+ read/create, superadmin delete)
// ==========================================
router.get('/content/:type', authorize(staffRoles), adminController.listContent);
router.post('/content/:type', authorize(staffRoles), adminController.createContent);
router.delete('/content/:type/:id', authorize(superadminRoles), adminController.deleteContent);

// ==========================================
// 6. AUDIT LOG (superadmin only)
// ==========================================
router.get('/audit', authorize(superadminRoles), adminController.listAudit);
router.get('/audit/:id', authorize(superadminRoles), adminController.getAudit);

// ==========================================
// 7. SETTINGS & STAFF (superadmin only)
// ==========================================
router.get('/settings', authorize(superadminRoles), adminController.getSettings);
router.get('/staff', authorize(superadminRoles), adminController.listStaff);

// ==========================================
// 8. CSV EXPORT (staff+)
// ==========================================
router.get('/export/:entity.csv', authorize(staffRoles), adminController.exportCsv);

export default router;
