import React from 'react';
import { Search } from 'lucide-react';

interface FilterOption {
  label: string;
  value: string;
}

interface FilterDropdown {
  key: string;
  label: string;
  options: FilterOption[];
  value: string;
  onChange: (val: string) => void;
}

interface FilterBarProps {
  searchValue?: string;
  onSearchChange?: (val: string) => void;
  searchPlaceholder?: string;
  dropdowns?: FilterDropdown[];
  actions?: React.ReactNode;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Search records...',
  dropdowns = [],
  actions,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
      {/* Search & Filters */}
      <div className="flex flex-1 flex-wrap items-center gap-3">
        {onSearchChange && (
          <div className="relative min-w-[220px] max-w-sm flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-400/60" />
            <input
              type="text"
              value={searchValue || ''}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full rounded-lg border border-[rgba(110,231,183,0.18)] bg-[#071f14] py-2 pl-9 pr-3 text-xs sm:text-sm text-zinc-200 placeholder-zinc-500 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400 transition-colors"
            />
          </div>
        )}

        {dropdowns.map((dd) => (
          <div key={dd.key} className="flex items-center gap-1.5">
            <select
              value={dd.value}
              onChange={(e) => dd.onChange(e.target.value)}
              aria-label={dd.label}
              className="rounded-lg border border-[rgba(110,231,183,0.18)] bg-[#071f14] px-3 py-2 text-xs sm:text-sm text-zinc-200 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400 transition-colors cursor-pointer"
            >
              <option value="">{dd.label}: All</option>
              {dd.options.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-[#071f14] text-white">
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>

      {/* Action buttons (e.g. Export, Add) */}
      {actions && <div className="flex items-center gap-2 self-start sm:self-auto">{actions}</div>}
    </div>
  );
};
