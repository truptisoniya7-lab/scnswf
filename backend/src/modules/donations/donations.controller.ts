import { Request, Response } from 'express';
import { donationsRepo, auditRepo } from '../../db';
import { sendSuccess, sendError } from '../../utils/response';

export const donationsController = {
  create: async (req: Request, res: Response): Promise<void> => {
    const { program_id, amount, currency, is_anonymous, donor_name, donor_email, donor_phone } =
      req.body;

    const result = donationsRepo.create({
      program_id: program_id || null,
      amount,
      currency: currency || 'INR',
      is_anonymous: Boolean(is_anonymous),
      donor_name: donor_name || null,
      donor_email: donor_email || null,
      donor_phone: donor_phone || null,
    });

    sendSuccess(
      res,
      {
        id: result.donation.id,
        status: result.donation.status,
        payment_session: result.paymentSession,
      },
      201
    );
  },

  getStatus: async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const donation = donationsRepo.findById(id);

    if (!donation) {
      sendError(res, 404, 'not_found', 'Donation not found.');
      return;
    }

    sendSuccess(res, {
      id: donation.id,
      amount: donation.amount,
      currency: donation.currency,
      status: donation.status,
      receipt_number: donation.status === 'succeeded' ? donation.receipt_number : null,
      created_at: donation.created_at,
    });
  },

  verifyPayment: async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const donation = donationsRepo.findById(id);

    if (!donation) {
      sendError(res, 404, 'not_found', 'Donation not found.');
      return;
    }

    const updated = donationsRepo.updateStatus(id, 'succeeded');

    sendSuccess(res, {
      id: updated?.id,
      amount: updated?.amount,
      currency: updated?.currency,
      status: updated?.status,
      receipt_number: updated?.receipt_number,
      donor_name: updated?.donor_name,
      donor_email: updated?.donor_email,
      created_at: updated?.created_at,
    });
  },

  handleWebhook: async (req: Request, res: Response): Promise<void> => {
    const { provider } = req.params;
    const event = req.body.event;

    // Simulate webhook handling / verification
    if (req.body.payload?.payment?.entity?.id && req.body.payload?.payment?.entity?.notes?.donation_id) {
      const donationId = req.body.payload.payment.entity.notes.donation_id;
      if (event === 'payment.captured' || event === 'charge.success') {
        donationsRepo.updateStatus(donationId, 'succeeded');
      }
    }

    sendSuccess(res, { received: true, provider });
  },

  listAdmin: async (_req: Request, res: Response): Promise<void> => {
    const items = donationsRepo.findAll();
    sendSuccess(res, items);
  },

  refund: async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const donation = donationsRepo.findById(id);

    if (!donation) {
      sendError(res, 404, 'not_found', 'Donation not found.');
      return;
    }

    const updated = donationsRepo.updateStatus(id, 'refunded');

    if (req.user) {
      auditRepo.log({
        actor_user_id: req.user.userId,
        actor_email: req.user.email,
        action: 'refund_donation',
        entity_type: 'Donation',
        entity_id: id,
        details: { amount: donation.amount },
      });
    }

    sendSuccess(res, updated);
  },
};
