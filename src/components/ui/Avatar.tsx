import { cn } from '@/lib/utils'

const PALETTE = ['bg-brand-100 text-brand-700', 'bg-accent-500/15 text-accent-600', 'bg-info-50 text-info-600', 'bg-success-50 text-success-600']

function paletteFor(seedStr: string) {
  let sum = 0
  for (let i = 0; i < seedStr.length; i++) sum += seedStr.charCodeAt(i)
  return PALETTE[sum % PALETTE.length]
}

export function Avatar({ name, size = 'md', className }: { name: string; size?: 'sm' | 'md' | 'lg'; className?: string }) {
  const sizeClasses = { sm: 'h-7 w-7 text-[11px]', md: 'h-9 w-9 text-xs', lg: 'h-14 w-14 text-lg' }
  return (
    <div className={cn('flex shrink-0 items-center justify-center rounded-full font-semibold', sizeClasses[size], paletteFor(name), className)}>
      {name}
    </div>
  )
}
