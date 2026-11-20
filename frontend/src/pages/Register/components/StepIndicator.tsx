interface StepIndicatorProps {
  currentStep: 1 | 2 | 3
}

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  const steps = [
    { number: 1, label: 'Details' },
    { number: 2, label: 'Verify' },
    { number: 3, label: 'Role' },
  ]

  return (
    <div className="w-full mb-6" aria-label={`Step ${currentStep} of 3`}>
      <div className="flex items-center justify-between relative">
        {/* Background track */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[2px] bg-white/10 z-0" />
        {/* Active progress fill */}
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 h-[2px] bg-[var(--green-400,#34d399)] transition-all duration-300 z-0"
          style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
        />

        {steps.map((s) => {
          const isCompleted = currentStep > s.number
          const isCurrent = currentStep === s.number

          return (
            <div key={s.number} className="relative z-10 flex flex-col items-center">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 border ${
                  isCurrent
                    ? 'bg-[var(--green-500,#1f9d62)] text-[var(--bg-deep,#04140c)] border-[var(--green-300,#6ee7b7)] shadow-[0_0_12px_rgba(52,211,153,0.4)] scale-110'
                    : isCompleted
                    ? 'bg-[var(--green-400,#34d399)] text-[var(--bg-deep,#04140c)] border-[var(--green-400,#34d399)]'
                    : 'bg-[#0a2a1a] text-[var(--text-muted,#9bc9b0)] border-white/20'
                }`}
              >
                {isCompleted ? '✓' : s.number}
              </div>
              <span
                className={`text-[10px] tracking-wide mt-1 font-medium transition-colors ${
                  isCurrent ? 'text-[var(--green-300,#6ee7b7)] font-semibold' : 'text-[var(--text-muted,#9bc9b0)]'
                }`}
              >
                {s.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
