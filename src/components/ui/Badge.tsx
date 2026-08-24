import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type Tone = 'brand' | 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'accent'

const toneClasses: Record<Tone, string> = {
  brand: 'bg-brand-50 text-brand-700 border-brand-200',
  success: 'bg-success-50 text-success-600 border-success-500/30',
  warning: 'bg-warning-50 text-warning-600 border-warning-500/30',
  danger: 'bg-danger-50 text-danger-600 border-danger-500/30',
  info: 'bg-info-50 text-info-600 border-info-500/30',
  neutral: 'bg-ink-100 text-ink-700 border-ink-200',
  accent: 'bg-accent-500/10 text-accent-600 border-accent-500/30',
}

export function Badge({ children, tone = 'neutral', className }: { children: ReactNode; tone?: Tone; className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium whitespace-nowrap', toneClasses[tone], className)}>
      {children}
    </span>
  )
}
