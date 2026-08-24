import type { LucideIcon } from 'lucide-react'
import { ArrowDown, ArrowUp } from 'lucide-react'
import { Card } from './Card'
import { cn } from '@/lib/utils'

interface StatCardProps {
  label: string
  value: string | number
  icon: LucideIcon
  trend?: { value: string; direction: 'up' | 'down' }
  tone?: 'brand' | 'success' | 'warning' | 'danger' | 'info'
  onClick?: () => void
}

const toneClasses = {
  brand: 'bg-brand-50 text-brand-600',
  success: 'bg-success-50 text-success-600',
  warning: 'bg-warning-50 text-warning-600',
  danger: 'bg-danger-50 text-danger-600',
  info: 'bg-info-50 text-info-600',
}

export function StatCard({ label, value, icon: Icon, trend, tone = 'brand', onClick }: StatCardProps) {
  const Wrapper = onClick ? 'button' : 'div'
  return (
    <Card className={cn('p-4 text-left sm:p-5', onClick && 'cursor-pointer transition hover:-translate-y-0.5 hover:shadow-elevated')}>
      <Wrapper onClick={onClick} className="flex w-full items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-xs font-medium text-ink-500">{label}</p>
          <p className="mt-1.5 text-2xl font-semibold tracking-tight text-ink-900 sm:text-[26px]">{value}</p>
          {trend && (
            <p className={cn('mt-1.5 inline-flex items-center gap-0.5 text-xs font-medium', trend.direction === 'up' ? 'text-success-600' : 'text-danger-600')}>
              {trend.direction === 'up' ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
              {trend.value}
            </p>
          )}
        </div>
        <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-lg', toneClasses[tone])}>
          <Icon size={20} />
        </div>
      </Wrapper>
    </Card>
  )
}
