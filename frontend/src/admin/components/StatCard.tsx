import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
}) => {
  return (
    <div className="relative overflow-hidden rounded-xl bg-[rgba(10,42,26,0.6)] backdrop-blur-md border border-[rgba(110,231,183,0.14)] p-5 transition-all duration-200 hover:border-emerald-500/30">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-emerald-400/80">
          {title}
        </span>
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-900/30 border border-emerald-500/20 text-emerald-400">
          <Icon className="h-4 w-4" />
        </div>
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-2xl font-bold tracking-tight text-white font-heading">
          {value}
        </span>
        {trend && (
          <span
            className={`text-xs font-semibold ${
              trend.isPositive ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {trend.isPositive ? '↑' : '↓'} {trend.value}
          </span>
        )}
      </div>

      {subtitle && (
        <p className="mt-1 text-xs text-zinc-400 line-clamp-1">{subtitle}</p>
      )}
    </div>
  );
};
