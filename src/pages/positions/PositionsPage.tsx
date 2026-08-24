import { PageHeader } from '@/components/shared/PageHeader'
import { Card } from '@/components/ui/Card'
import { DataTable, type Column } from '@/components/ui/DataTable'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { departments, employees, positions } from '@/data/seed'
import { formatCurrency } from '@/lib/utils'
import { useAuth } from '@/app/auth-context'
import type { Position } from '@/types'

export default function PositionsPage() {
  const { can } = useAuth()
  const columns: Column<Position>[] = [
    { key: 'title', header: 'Position', sortValue: (p) => p.title, render: (p) => <span className="font-medium text-ink-900">{p.title}</span> },
    { key: 'department', header: 'Department', render: (p) => departments.find((d) => d.id === p.departmentId)?.name ?? '—' },
    { key: 'level', header: 'Level', render: (p) => p.level },
    { key: 'headcount', header: 'Employees', sortValue: (p) => employees.filter((e) => e.positionId === p.id).length, render: (p) => employees.filter((e) => e.positionId === p.id).length },
    ...(can('compensation.view') ? [{ key: 'salary', header: 'Salary Range', render: (p: Position) => `${formatCurrency(p.salaryMin)} – ${formatCurrency(p.salaryMax)}` } as Column<Position>] : []),
    { key: 'status', header: 'Status', render: (p) => <StatusBadge status={p.status} /> },
  ]

  return (
    <div>
      <PageHeader title="Positions" subtitle="Job positions and salary bands across IHPAU" />
      <Card>
        <DataTable
          columns={columns}
          rows={positions}
          keyField={(p) => p.id}
          searchPlaceholder="Search positions..."
          searchFn={(p, q) => p.title.toLowerCase().includes(q)}
        />
      </Card>
    </div>
  )
}
