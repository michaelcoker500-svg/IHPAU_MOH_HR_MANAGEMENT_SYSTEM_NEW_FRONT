import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/app/auth-context'
import type { Permission } from '@/types'
import { EmptyState } from '@/components/ui/EmptyState'
import { ShieldAlert } from 'lucide-react'

export function ProtectedRoute({ requires }: { requires?: Permission }) {
  const { user, can } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (requires && !can(requires)) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <EmptyState icon={ShieldAlert} title="You don't have permission to view this page" description="Contact your HR administrator if you believe this is a mistake." />
      </div>
    )
  }
  return <Outlet />
}
