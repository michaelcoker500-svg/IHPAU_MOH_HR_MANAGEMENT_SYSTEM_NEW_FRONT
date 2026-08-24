import { PageHeader } from '@/components/shared/PageHeader'
import { Card, CardBody } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { ROLE_LABELS, ROLE_PERMISSIONS } from '@/permissions'
import { DEMO_ACCOUNTS } from '@/app/auth-context'
import type { RoleKey } from '@/types'

export default function RolesPage() {
  const roles = Object.keys(ROLE_LABELS) as RoleKey[]
  return (
    <div>
      <PageHeader title="Roles" subtitle="Roles and their assigned capabilities" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {roles.map((role) => (
          <Card key={role}>
            <CardBody>
              <p className="text-sm font-semibold text-ink-900">{ROLE_LABELS[role]}</p>
              <p className="mt-0.5 text-xs text-ink-500">{DEMO_ACCOUNTS.filter((a) => a.role === role).length} user(s)</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {ROLE_PERMISSIONS[role].slice(0, 6).map((p) => <Badge key={p} tone="neutral">{p}</Badge>)}
                {ROLE_PERMISSIONS[role].length > 6 && <Badge tone="neutral">+{ROLE_PERMISSIONS[role].length - 6} more</Badge>}
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  )
}
