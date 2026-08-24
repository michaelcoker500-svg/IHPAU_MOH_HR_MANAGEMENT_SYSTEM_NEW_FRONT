import { forwardRef, type InputHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  icon?: React.ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, icon, id, required, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-ink-700">
            {label} {required && <span className="text-danger-500">*</span>}
          </label>
        )}
        <div className="relative">
          {icon && <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-400">{icon}</span>}
          <input
            ref={ref}
            id={inputId}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
            className={cn(
              'h-11 w-full rounded-lg border border-ink-300 bg-white px-3.5 text-sm text-ink-900 placeholder:text-ink-400',
              'focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20',
              'disabled:bg-ink-50 disabled:text-ink-400',
              icon && 'pl-9',
              error && 'border-danger-500 focus:border-danger-500 focus:ring-danger-500/20',
              className,
            )}
            {...props}
          />
        </div>
        {error && <p id={`${inputId}-error`} className="mt-1 text-xs text-danger-600">{error}</p>}
        {!error && hint && <p id={`${inputId}-hint`} className="mt-1 text-xs text-ink-500">{hint}</p>}
      </div>
    )
  },
)
Input.displayName = 'Input'
