import { AlertOctagon, WifiOff } from 'lucide-react'
import { Button } from './Button'

export function ErrorState({ title = 'Something went wrong', description = 'Please try again.', onRetry, offline }: { title?: string; description?: string; onRetry?: () => void; offline?: boolean }) {
  const Icon = offline ? WifiOff : AlertOctagon
  return (
    <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-danger-50 text-danger-500">
        <Icon size={22} />
      </div>
      <p className="text-sm font-semibold text-ink-800">{title}</p>
      <p className="mt-1 max-w-sm text-sm text-ink-500">{description}</p>
      {onRetry && (
        <Button size="sm" variant="outline" className="mt-4" onClick={onRetry}>
          Try Again
        </Button>
      )}
    </div>
  )
}
