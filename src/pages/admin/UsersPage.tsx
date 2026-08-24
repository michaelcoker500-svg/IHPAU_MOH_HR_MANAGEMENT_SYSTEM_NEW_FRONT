import { PageHeader } from '@/components/shared/PageHeader'
import { Card } from '@/components/ui/Card'
import { DataTable, type Column } from '@/components/ui/DataTable'
import { Badge } from '@/components/ui/Badge'
import { DEMO_ACCOUNTS } from '@/app/auth-context'
import { ROLE_LABELS } from '@/permissions'
import type { RoleKey } from '@/types'

interface Row { email: string; name: string; role: RoleKey }

export default function UsersPage() {
  const rows: Row[] = DEMO_ACCOUNTS
  const columns: Column<Row>[] = [
    { key: 'name', header: 'Name', sortValue: (r) => r.name, render: (r) => <span className="font-medium text-ink-900">{r.name}</span> },
    { key: 'email', header: 'Email', render: (r) => r.email },
    { key: 'org', header: 'Organization', render: () => 'IHPAU', hideOnMobile: true },
    { key: 'role', header: 'Role', render: (r) => <Badge tone="brand">{ROLE_LABELS[r.role]}</Badge> },
    { key: 'status', header: 'Status', render: () => <Badge tone="success">Active</Badge> },
  ]
  return (
    <div>
      <PageHeader title="Users" subtitle="Demo accounts available in this environment" />
      <Card>
        <DataTable columns={columns} rows={rows} keyField={(r) => r.email} searchPlaceholder="Search users..." searchFn={(r, q) => `${r.name} ${r.email}`.toLowerCase().includes(q)} />
      </Card>
    </div>
  )
}
