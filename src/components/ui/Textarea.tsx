import { forwardRef, type TextareaHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, id, required, ...props }, ref) => {
    const taId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={taId} className="mb-1.5 block text-sm font-medium text-ink-700">
            {label} {required && <span className="text-danger-500">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={taId}
          className={cn(
            'w-full rounded-lg border border-ink-300 bg-white px-3.5 py-2.5 text-sm text-ink-900 placeholder:text-ink-400',
            'focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20',
            error && 'border-danger-500',
            className,
          )}
          {...props}
        />
        {error && <p className="mt-1 text-xs text-danger-600">{error}</p>}
      </div>
    )
  },
)
Textarea.displayName = 'Textarea'
