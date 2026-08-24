import { forwardRef, type SelectHTMLAttributes } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, id, required, children, ...props }, ref) => {
    const selectId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={selectId} className="mb-1.5 block text-sm font-medium text-ink-700">
            {label} {required && <span className="text-danger-500">*</span>}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={cn(
              'h-11 w-full appearance-none rounded-lg border border-ink-300 bg-white pl-3.5 pr-9 text-sm text-ink-900',
              'focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20',
              error && 'border-danger-500',
              className,
            )}
            {...props}
          >
            {children}
          </select>
          <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-400" />
        </div>
        {error && <p className="mt-1 text-xs text-danger-600">{error}</p>}
      </div>
    )
  },
)
Select.displayName = 'Select'
