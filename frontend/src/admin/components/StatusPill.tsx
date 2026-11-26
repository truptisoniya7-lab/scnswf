import React from 'react';

interface StatusPillProps {
  status: string;
  size?: 'sm' | 'md';
}

const colorMap: Record<string, { bg: string; text: string; border: string }> = {
  // User statuses
  active: { bg: 'bg-emerald-950/40', text: 'text-emerald-400', border: 'border-emerald-800/40' },
  suspended: { bg: 'bg-rose-950/40', text: 'text-rose-400', border: 'border-rose-800/40' },

  // Application statuses
  pending: { bg: 'bg-amber-950/40', text: 'text-amber-400', border: 'border-amber-800/40' },
  new: { bg: 'bg-amber-950/40', text: 'text-amber-400', border: 'border-amber-800/40' },
  under_review: { bg: 'bg-sky-950/40', text: 'text-sky-400', border: 'border-sky-800/40' },
  in_review: { bg: 'bg-sky-950/40', text: 'text-sky-400', border: 'border-sky-800/40' },
  approved: { bg: 'bg-emerald-950/40', text: 'text-emerald-400', border: 'border-emerald-800/40' },
  accepted: { bg: 'bg-emerald-950/40', text: 'text-emerald-400', border: 'border-emerald-800/40' },
  rejected: { bg: 'bg-rose-950/40', text: 'text-rose-400', border: 'border-rose-800/40' },

  // Donation statuses
  succeeded: { bg: 'bg-emerald-950/40', text: 'text-emerald-400', border: 'border-emerald-800/40' },
  completed: { bg: 'bg-emerald-950/40', text: 'text-emerald-400', border: 'border-emerald-800/40' },
  failed: { bg: 'bg-rose-950/40', text: 'text-rose-400', border: 'border-rose-800/40' },
  refunded: { bg: 'bg-purple-950/40', text: 'text-purple-400', border: 'border-purple-800/40' },

  // Content
  published: { bg: 'bg-emerald-950/40', text: 'text-emerald-400', border: 'border-emerald-800/40' },
  draft: { bg: 'bg-zinc-900/60', text: 'text-zinc-400', border: 'border-zinc-700/40' },
  cancelled: { bg: 'bg-rose-950/40', text: 'text-rose-400', border: 'border-rose-800/40' },

  // Roles
  superadmin: { bg: 'bg-purple-950/40', text: 'text-purple-300', border: 'border-purple-700/40' },
  staff: { bg: 'bg-cyan-950/40', text: 'text-cyan-300', border: 'border-cyan-700/40' },
  user: { bg: 'bg-zinc-900/40', text: 'text-zinc-400', border: 'border-zinc-700/40' },
};

export const StatusPill: React.FC<StatusPillProps> = ({ status, size = 'md' }) => {
  const normalized = (status || '').toLowerCase().replace(/[\s-]/g, '_');
  const style = colorMap[normalized] || {
    bg: 'bg-zinc-900/40',
    text: 'text-zinc-300',
    border: 'border-zinc-700/40',
  };

  const label = (status || 'Unknown').replace(/_/g, ' ');

  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center capitalize font-medium rounded-full border ${style.bg} ${style.text} ${style.border} ${sizeClasses}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-80" />
      {label}
    </span>
  );
};
