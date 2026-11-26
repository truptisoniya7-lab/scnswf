import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, IndianRupee, Send, CheckCircle2 } from 'lucide-react';
import { AdminDonation, adminApi } from '../../api/adminApi';
import { StatusPill } from '../../components/StatusPill';

interface DonationDetailModalProps {
  donation: AdminDonation | null;
  isOpen: boolean;
  onClose: () => void;
  onRefresh: () => void;
}

export const DonationDetailModal: React.FC<DonationDetailModalProps> = ({
  donation,
  isOpen,
  onClose,
  onRefresh,
}) => {
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  if (!isOpen || !donation) return null;

  const handleResendReceipt = async () => {
    try {
      setIsResending(true);
      await adminApi.resendDonationReceipt(donation.id);
      setResendSuccess(true);
      setTimeout(() => setResendSuccess(false), 3500);
    } catch (err) {
      console.error('Failed to resend receipt:', err);
      alert('Failed to resend receipt.');
    } finally {
      setIsResending(false);
    }
  };

  const handleStatusChange = async (status: string) => {
    const confirm = window.confirm(`Change donation status to "${status}"?`);
    if (!confirm) return;

    try {
      await adminApi.updateDonationStatus(donation.id, status);
      onRefresh();
      onClose();
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/75 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-[rgba(110,231,183,0.2)] bg-[#071f14] shadow-2xl z-10 text-zinc-200"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(110,231,183,0.14)] bg-[#04140c]">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-900/50 border border-emerald-500/30 text-emerald-400">
                <IndianRupee className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white font-heading">
                  Donation Record
                </h3>
                <p className="text-[11px] text-zinc-400">
                  {donation.receipt_number || donation.id}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-zinc-400 hover:text-white hover:bg-emerald-950/40 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-5 text-xs">
            {/* Amount Banner */}
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-4 flex items-center justify-between">
              <div>
                <div className="text-[10px] uppercase font-bold text-emerald-400/80">
                  Total Contribution
                </div>
                <div className="text-2xl font-bold text-white font-heading mt-0.5">
                  ₹{Number(donation.amount).toLocaleString('en-IN')}
                </div>
              </div>
              <StatusPill status={donation.status} />
            </div>

            {/* Donor info */}
            <div className="rounded-xl border border-zinc-800 bg-[#04140c] p-4 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Donor Name</span>
                <span className="font-semibold text-white">
                  {donation.donor_name || 'Anonymous Supporter'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Donor Email</span>
                <span className="font-semibold text-white">
                  {donation.donor_email || '—'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Phone</span>
                <span className="font-semibold text-white">
                  {donation.donor_phone || '—'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Payment Method</span>
                <span className="font-semibold text-emerald-400 capitalize">
                  {donation.method || 'Online'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Receipt Date</span>
                <span className="text-zinc-300">
                  {new Date(donation.created_at).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Notification alert on resend */}
            {resendSuccess && (
              <div className="flex items-center gap-2 p-3 rounded-lg border border-emerald-700/50 bg-emerald-950/40 text-emerald-300 text-xs font-medium">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>Receipt email sent successfully to {donation.donor_email}!</span>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="p-4 border-t border-[rgba(110,231,183,0.14)] bg-[#04140c] flex items-center justify-between gap-3">
            {/* Status change actions */}
            <div className="flex items-center gap-2">
              {donation.status !== 'refunded' && (
                <button
                  type="button"
                  onClick={() => handleStatusChange('refunded')}
                  className="rounded-lg border border-purple-800/40 bg-purple-950/30 px-3 py-1.5 text-xs font-semibold text-purple-300 hover:bg-purple-900/50 transition-colors"
                >
                  Mark Refunded
                </button>
              )}
            </div>

            {/* Resend Receipt Button */}
            {donation.donor_email && (
              <button
                type="button"
                onClick={handleResendReceipt}
                disabled={isResending}
                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition-colors disabled:opacity-50"
              >
                <Send className="h-3.5 w-3.5" />
                <span>{isResending ? 'Sending...' : 'Resend Receipt Email'}</span>
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
