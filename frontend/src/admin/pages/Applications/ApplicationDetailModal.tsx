import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  FileText,
  Mail,
  Phone,
  CheckCircle,
  XCircle,
  Clock,
  MessageSquare,
  Send,
  Download,
} from 'lucide-react';
import { AdminApplication, adminApi } from '../../api/adminApi';
import { StatusPill } from '../../components/StatusPill';
import { ConfirmDialog } from '../../components/ConfirmDialog';

interface ApplicationDetailModalProps {
  application: AdminApplication | null;
  isOpen: boolean;
  onClose: () => void;
  onRefresh: () => void;
}

export const ApplicationDetailModal: React.FC<ApplicationDetailModalProps> = ({
  application,
  isOpen,
  onClose,
  onRefresh,
}) => {
  const [newNote, setNewNote] = useState('');
  const [isSubmittingNote, setIsSubmittingNote] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectInput, setShowRejectInput] = useState(false);

  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    action: () => Promise<void>;
    isDestructive: boolean;
  }>({
    isOpen: false,
    title: '',
    message: '',
    action: async () => {},
    isDestructive: false,
  });

  if (!isOpen || !application) return null;

  // Add internal note
  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    try {
      setIsSubmittingNote(true);
      await adminApi.addApplicationNote(application.id, newNote.trim());
      setNewNote('');
      onRefresh();
    } catch (err) {
      console.error('Failed to add note:', err);
    } finally {
      setIsSubmittingNote(false);
    }
  };

  // Change status action
  const handleStatusChange = (status: 'approved' | 'rejected' | 'under_review') => {
    if (status === 'rejected' && !showRejectInput) {
      setShowRejectInput(true);
      return;
    }

    if (status === 'rejected' && !rejectReason.trim()) {
      alert('Please provide a reason for rejecting this application.');
      return;
    }

    setConfirmDialog({
      isOpen: true,
      title: `${status === 'approved' ? 'Approve' : status === 'rejected' ? 'Reject' : 'Review'} Application`,
      message: `Are you sure you want to change the status of ${application.applicantName}'s application to "${status}"? This will send an automated notification email to ${application.email}.`,
      isDestructive: status === 'rejected',
      action: async () => {
        await adminApi.updateApplicationStatus(
          application.id,
          status,
          status === 'rejected' ? rejectReason.trim() : undefined
        );
        setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
        setShowRejectInput(false);
        setRejectReason('');
        onRefresh();
        onClose();
      },
    });
  };

  return (
    <>
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

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-2xl border border-[rgba(110,231,183,0.2)] bg-[#071f14] shadow-2xl flex flex-col z-10 text-zinc-200"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(110,231,183,0.14)] bg-[#04140c]">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-900/50 border border-emerald-500/30 text-emerald-400">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-heading">
                    {application.applicantName}
                  </h3>
                  <div className="flex items-center gap-2 text-[11px] text-zinc-400">
                    <span className="capitalize font-semibold text-emerald-400">
                      {application.type} Application
                    </span>
                    <span>•</span>
                    <span>
                      Submitted {new Date(application.submittedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <StatusPill status={application.status} />
                <button
                  onClick={onClose}
                  className="rounded-lg p-1.5 text-zinc-400 hover:text-white hover:bg-emerald-950/40 transition-colors ml-2"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
              {/* Contact info grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 rounded-xl border border-[rgba(110,231,183,0.1)] bg-[#04140c]/80 p-4">
                <div className="flex items-center gap-2.5">
                  <Mail className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span className="truncate">{application.email}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Phone className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>{application.phone || 'No phone provided'}</span>
                </div>
              </div>

              {/* Submitted Answers / Details */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                  Submitted Information
                </h4>
                <div className="rounded-xl border border-zinc-800 bg-[#04140c] p-4 space-y-3">
                  {Object.entries(application.details || {}).map(([key, val]) => (
                    <div key={key} className="border-b border-zinc-800/60 pb-2 last:border-0 last:pb-0">
                      <div className="text-[10px] text-zinc-500 uppercase font-semibold">
                        {key.replace(/_/g, ' ')}
                      </div>
                      <div className="text-zinc-200 mt-0.5 whitespace-pre-wrap leading-relaxed">
                        {typeof val === 'string' && val.startsWith('http') && val.includes('resume') ? (
                          <a
                            href={val}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-emerald-400 hover:underline"
                          >
                            <Download className="h-3 w-3" /> View Resume
                          </a>
                        ) : (
                          String(val || '—')
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status History */}
              {application.statusHistory && application.statusHistory.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" /> Status History
                  </h4>
                  <div className="rounded-lg border border-zinc-800 bg-[#04140c] p-3 divide-y divide-zinc-800/60">
                    {application.statusHistory.map((h, i) => (
                      <div key={i} className="py-1.5 text-[11px] flex justify-between">
                        <div>
                          <span className="font-semibold capitalize text-emerald-400">
                            {h.status}
                          </span>{' '}
                          <span className="text-zinc-400">by {h.changedBy}</span>
                          {h.reason && (
                            <div className="text-zinc-500 italic mt-0.5">
                              "{h.reason}"
                            </div>
                          )}
                        </div>
                        <span className="text-zinc-500 text-[10px]">
                          {new Date(h.at).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Internal Notes */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <MessageSquare className="h-3.5 w-3.5" /> Staff Internal Notes
                </h4>

                {/* Notes List */}
                <div className="space-y-2 max-h-36 overflow-y-auto">
                  {application.notes && application.notes.length > 0 ? (
                    application.notes.map((n) => (
                      <div
                        key={n.id}
                        className="rounded-lg border border-emerald-900/30 bg-emerald-950/20 p-3"
                      >
                        <div className="flex justify-between text-[10px] text-zinc-400 mb-1">
                          <span className="font-semibold text-emerald-400">
                            {n.authorName}
                          </span>
                          <span>{new Date(n.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p className="text-zinc-200 text-xs">{n.text}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-zinc-500 italic">No internal notes yet.</p>
                  )}
                </div>

                {/* Add Note Form */}
                <form onSubmit={handleAddNote} className="flex gap-2">
                  <input
                    type="text"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Add an internal reviewer note..."
                    className="flex-1 rounded-lg border border-[rgba(110,231,183,0.18)] bg-[#04140c] px-3 py-2 text-xs text-zinc-200 placeholder-zinc-500 focus:border-emerald-400 focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={isSubmittingNote || !newNote.trim()}
                    className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-500 transition-colors disabled:opacity-40"
                  >
                    <Send className="h-3 w-3" />
                  </button>
                </form>
              </div>

              {/* Rejection reason box if rejecting */}
              {showRejectInput && (
                <div className="p-4 rounded-xl border border-rose-800/40 bg-rose-950/30 space-y-2">
                  <label className="text-xs font-semibold text-rose-300 block">
                    Reason for rejection (will be emailed to applicant):
                  </label>
                  <textarea
                    rows={3}
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="e.g. Positions for this session have been filled..."
                    className="w-full rounded-lg border border-rose-700/50 bg-[#04140c] p-2.5 text-xs text-zinc-200 focus:border-rose-400 focus:outline-none"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowRejectInput(false)}
                      className="px-3 py-1.5 text-xs font-medium text-zinc-400 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStatusChange('rejected')}
                      className="rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-500"
                    >
                      Confirm Rejection
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Action Buttons */}
            {!showRejectInput && (
              <div className="p-4 border-t border-[rgba(110,231,183,0.14)] bg-[#04140c] flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => handleStatusChange('under_review')}
                  className="rounded-lg border border-sky-800/40 bg-sky-950/30 px-3 py-2 text-xs font-semibold text-sky-400 hover:bg-sky-900/50 transition-colors"
                >
                  Mark Under Review
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleStatusChange('rejected')}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-rose-800/40 bg-rose-950/30 px-3.5 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-900/50 transition-colors"
                  >
                    <XCircle className="h-4 w-4" /> Reject
                  </button>

                  <button
                    type="button"
                    onClick={() => handleStatusChange('approved')}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition-colors"
                  >
                    <CheckCircle className="h-4 w-4" /> Approve
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </AnimatePresence>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        isDestructive={confirmDialog.isDestructive}
        onConfirm={confirmDialog.action}
        onCancel={() => setConfirmDialog((prev) => ({ ...prev, isOpen: false }))}
      />
    </>
  );
};
