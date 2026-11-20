import React from 'react'
import { Check } from 'lucide-react'

interface RoleCardProps {
  value: 'internship' | 'donor' | 'volunteer'
  label: string
  description: string
  icon: React.ReactNode
  isSelected: boolean
  onSelect: () => void
  disabled?: boolean
}

export function RoleCard({
  label,
  description,
  icon,
  isSelected,
  onSelect,
  disabled = false,
}: RoleCardProps) {
  return (
    <div
      role="radio"
      aria-checked={isSelected}
      tabIndex={0}
      onClick={() => !disabled && onSelect()}
      onKeyDown={(e) => {
        if (!disabled && (e.key === ' ' || e.key === 'Enter')) {
          e.preventDefault()
          onSelect()
        }
      }}
      className={`group relative p-4 rounded-xl border transition-all duration-200 cursor-pointer select-none flex items-start gap-3.5
        ${
          isSelected
            ? 'bg-[rgba(31,157,98,0.18)] border-[var(--green-400,#34d399)] shadow-[0_0_16px_rgba(52,211,153,0.22)] scale-[1.01]'
            : 'bg-[rgba(255,255,255,0.03)] border-[var(--glass-border,rgba(110,231,183,0.18))] hover:border-[var(--green-300,#6ee7b7)]/40 hover:bg-[rgba(255,255,255,0.06)] hover:scale-[1.01]'
        }
        focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--green-300,#6ee7b7)]
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
    >
      {/* Icon pill */}
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
          isSelected
            ? 'bg-[var(--green-400,#34d399)] text-[var(--bg-deep,#04140c)]'
            : 'bg-white/10 text-[var(--green-300,#6ee7b7)] group-hover:bg-white/15'
        }`}
      >
        {icon}
      </div>

      {/* Content */}
      <div className="flex-1 pr-6">
        <h3 className="font-heading font-bold text-sm sm:text-base text-[var(--text,#e8fff3)] leading-tight">
          {label}
        </h3>
        <p className="text-xs text-[var(--text-muted,#9bc9b0)] mt-1 leading-snug">
          {description}
        </p>
      </div>

      {/* Selection indicator badge */}
      <div
        className={`absolute top-4 right-4 w-5 h-5 rounded-full flex items-center justify-center transition-all ${
          isSelected
            ? 'bg-[var(--green-400,#34d399)] text-[var(--bg-deep,#04140c)] scale-100'
            : 'border border-white/20 bg-transparent scale-90 opacity-40 group-hover:opacity-70'
        }`}
      >
        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
      </div>
    </div>
  )
}
