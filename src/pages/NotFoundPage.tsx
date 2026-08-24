import { useNavigate } from 'react-router-dom'
import { Compass } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export default function NotFoundPage() {
  const navigate = useNavigate()
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-ink-100 text-ink-400">
        <Compass size={26} />
      </div>
      <div>
        <p className="text-base font-semibold text-ink-900">Page not found</p>
        <p className="mt-1 text-sm text-ink-500">The page you're looking for doesn't exist or has moved.</p>
      </div>
      <Button onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
    </div>
  )
}
