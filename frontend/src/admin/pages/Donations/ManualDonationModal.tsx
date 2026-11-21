import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, IndianRupee, User, Mail, Phone } from 'lucide-react';
import { adminApi } from '../../api/adminApi';

interface ManualDonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const ManualDonationModal: React.FC<ManualDonationModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [donorName, setDonorName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [donorPhone, setDonorPhone] = useState('');
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState<'cash' | 'bank_transfer' | 'cheque'>('cash');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const parsedAmount = parseFloat(amount);
    if (!donorName.trim() || !donorEmail.trim() || isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Please provide a valid donor name, email, and amount.');
      return;
    }

    try {
      setIsSubmitting(true);
      await adminApi.createManualDonation({
        donor_name: donorName.trim(),
        donor_email: donorEmail.trim(),
        donor_phone: donorPhone.trim() || undefined,
        amount: parsedAmount,
        currency: 'INR',
        method,
        notes: notes.trim() || undefined,
      });

      onSuccess();
      onClose();
    } catch (err: any) {
      console.error('Failed to create donation:', err);
      setError(err?.response?.data?.error?.message || 'Failed to record manual donation.');
    } finally {
      setIsSubmitting(false);
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
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-900/40 border border-emerald-500/30 text-emerald-400">
                <IndianRupee className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white font-heading">
                  Record Manual Donation
                </h3>
                <p className="text-[11px] text-zinc-400">
                  Direct cash, cheque, or bank transfer contribution
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

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
            {error && (
              <div className="p-3 rounded-lg border border-rose-800/50 bg-rose-950/40 text-rose-300 text-xs">
                {error}
              </div>
            )}

            {/* Donor Name */}
            <div>
              <label className="block text-zinc-300 font-semibold mb-1">
                Donor Name *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-400/60" />
                <input
                  type="text"
                  required
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full rounded-lg border border-[rgba(110,231,183,0.18)] bg-[#04140c] py-2 pl-9 pr-3 text-zinc-200 placeholder-zinc-500 focus:border-emerald-400 focus:outline-none"
                />
              </div>
            </div>

            {/* Donor Email & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-zinc-300 font-semibold mb-1">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-400/60" />
                  <input
                    type="email"
                    required
                    value={donorEmail}
                    onChange={(e) => setDonorEmail(e.target.value)}
                    placeholder="donor@example.com"
                    className="w-full rounded-lg border border-[rgba(110,231,183,0.18)] bg-[#04140c] py-2 pl-9 pr-3 text-zinc-200 placeholder-zinc-500 focus:border-emerald-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-300 font-semibold mb-1">
                  Phone (Optional)
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-400/60" />
                  <input
                    type="tel"
                    value={donorPhone}
                    onChange={(e) => setDonorPhone(e.target.value)}
                    placeholder="+91 9876543210"
                    className="w-full rounded-lg border border-[rgba(110,231,183,0.18)] bg-[#04140c] py-2 pl-9 pr-3 text-zinc-200 placeholder-zinc-500 focus:border-emerald-400 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Amount & Method */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-zinc-300 font-semibold mb-1">
                  Amount (INR) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-emerald-400">
                    ₹
                  </span>
                  <input
                    type="number"
                    required
                    min="1"
                    step="1"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="5000"
                    className="w-full rounded-lg border border-[rgba(110,231,183,0.18)] bg-[#04140c] py-2 pl-8 pr-3 text-zinc-200 placeholder-zinc-500 focus:border-emerald-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-300 font-semibold mb-1">
                  Payment Method *
                </label>
                <select
                  value={method}
                  onChange={(e) => setMethod(e.target.value as any)}
                  className="w-full rounded-lg border border-[rgba(110,231,183,0.18)] bg-[#04140c] px-3 py-2 text-zinc-200 focus:border-emerald-400 focus:outline-none"
                >
                  <option value="cash">Cash in Hand</option>
                  <option value="bank_transfer">Direct Bank Transfer / NEFT</option>
                  <option value="cheque">Bank Cheque / DD</option>
                </select>
              </div>
            </div>

            {/* Internal Notes */}
            <div>
              <label className="block text-zinc-300 font-semibold mb-1">
                Internal Remarks / Reference Number
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Cheque #49281, SBI Bhubaneswar branch"
                className="w-full rounded-lg border border-[rgba(110,231,183,0.18)] bg-[#04140c] p-2.5 text-zinc-200 placeholder-zinc-500 focus:border-emerald-400 focus:outline-none"
              />
            </div>

            {/* Buttons */}
            <div className="pt-3 flex justify-end gap-3 border-t border-[rgba(110,231,183,0.1)]">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-zinc-700 bg-zinc-800/40 px-4 py-2 font-medium text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-lg bg-emerald-500 px-5 py-2 font-bold text-slate-950 hover:bg-emerald-400 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Recording...' : 'Save & Issue Receipt'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
