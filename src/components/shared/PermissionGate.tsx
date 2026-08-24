import type { ReactNode } from 'react'
import type { Permission } from '@/types'
import { useAuth } from '@/app/auth-context'

export function PermissionGate({ permission, any, children, fallback = null }: { permission?: Permission; any?: Permission[]; children: ReactNode; fallback?: ReactNode }) {
  const { can } = useAuth()
  const allowed = permission ? can(permission) : any ? any.some((p) => can(p)) : true
  return <>{allowed ? children : fallback}</>
}
