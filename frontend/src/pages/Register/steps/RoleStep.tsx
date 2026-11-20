import { useState } from 'react'
import { RoleCard } from '../components/RoleCard'
import { GraduationCap, Heart, Users, Loader2, AlertCircle } from 'lucide-react'

interface RoleStepProps {
  onCompleteRegistration: (role: 'internship' | 'donor' | 'volunteer') => Promise<void>
  isLoading: boolean
  errorMsg: string | null
  onClearError: () => void
}

export function RoleStep({
  onCompleteRegistration,
  isLoading,
  errorMsg,
  onClearError,
}: RoleStepProps) {
  const [selectedRole, setSelectedRole] = useState<'internship' | 'donor' | 'volunteer' | null>(null)
  const [validationError, setValidationError] = useState<string | null>(null)

  const roles = [
    {
      value: 'internship' as const,
      label: 'Internship',
      description: 'Learn and contribute through a structured internship program.',
      icon: <GraduationCap className="w-5 h-5" />,
    },
    {
      value: 'donor' as const,
      label: 'Donor',
      description: 'Support healthcare and welfare initiatives with contributions.',
      icon: <Heart className="w-5 h-5" />,
    },
    {
      value: 'volunteer' as const,
      label: 'Volunteer',
      description: 'Give your time and skills to impact communities across Odisha.',
      icon: <Users className="w-5 h-5" />,
    },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedRole) {
      setValidationError('Please choose a role to complete your registration.')
      return
    }
    setValidationError(null)
    await onCompleteRegistration(selectedRole)
  }

  const handleSelect = (role: 'internship' | 'donor' | 'volunteer') => {
    setSelectedRole(role)
    setValidationError(null)
    if (errorMsg) onClearError()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="text-center mb-4">
        <h2 className="text-xl sm:text-2xl font-bold font-heading text-[var(--text,#e8fff3)] tracking-tight">
          Choose your role
        </h2>
        <p className="text-xs sm:text-sm text-[var(--text-muted,#9bc9b0)] mt-1">
          Tell us how you would like to participate with SCNSWF
        </p>
      </div>

      {/* Error display */}
      {(errorMsg || validationError) && (
        <div
          role="alert"
          aria-live="polite"
          className="p-3 rounded-xl bg-red-950/60 border border-[var(--danger,#f87171)]/50 text-[var(--text,#e8fff3)] text-xs flex items-start gap-2.5 animate-fadeIn"
        >
          <AlertCircle className="w-4 h-4 shrink-0 text-[var(--danger,#f87171)] mt-0.5" />
          <span className="flex-1 leading-snug">{errorMsg || validationError}</span>
        </div>
      )}

      {/* Role cards radio group */}
      <div
        role="radiogroup"
        aria-label="Select your SCNSWF community role"
        className="space-y-2.5"
      >
        {roles.map((r) => (
          <RoleCard
            key={r.value}
            value={r.value}
            label={r.label}
            description={r.description}
            icon={r.icon}
            isSelected={selectedRole === r.value}
            onSelect={() => handleSelect(r.value)}
            disabled={isLoading}
          />
        ))}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!selectedRole || isLoading}
        className="w-full h-12 rounded-xl text-[var(--bg-deep,#04140c)] font-heading font-bold text-sm tracking-wide transition-all duration-200 mt-2 flex items-center justify-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_16px_rgba(31,157,98,0.3)] hover:shadow-[0_6px_22px_rgba(52,211,153,0.45)] hover:-translate-y-0.5 active:translate-y-0"
        style={{
          background: 'linear-gradient(135deg, var(--green-500, #1f9d62), var(--green-400, #34d399))',
        }}
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-[var(--bg-deep,#04140c)]" />
            <span>Creating account...</span>
          </div>
        ) : (
          <span>Create account &rarr;</span>
        )}
      </button>
    </form>
  )
}
