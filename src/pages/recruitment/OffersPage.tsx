import { Card } from '@/components/ui/Card'
import { DataTable, type Column } from '@/components/ui/DataTable'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { PermissionGate } from '@/components/shared/PermissionGate'
import { offers, candidates, jobOpenings } from '@/data/seed'
import { formatCurrency, formatDate } from '@/lib/utils'
import type { Offer } from '@/types'

export default function OffersPage() {
  const columns: Column<Offer>[] = [
    { key: 'candidate', header: 'Candidate', render: (o) => { const c = candidates.find((c) => c.id === o.candidateId); return c ? `${c.firstName} ${c.lastName}` : '—' } },
    { key: 'job', header: 'Position', render: (o) => jobOpenings.find((j) => j.id === o.jobId)?.title },
    {
      key: 'salary', header: 'Salary',
      render: (o) => (
        <PermissionGate permission="compensation.view" fallback={<span className="text-ink-400">Restricted</span>}>
          {formatCurrency(o.salary)}
        </PermissionGate>
      ),
    },
    { key: 'sentAt', header: 'Sent', render: (o) => (o.sentAt ? formatDate(o.sentAt) : '—'), hideOnMobile: true },
    { key: 'status', header: 'Status', render: (o) => <StatusBadge status={o.status} /> },
  ]
  return (
    <Card>
      <DataTable columns={columns} rows={offers} keyField={(o) => o.id} searchable={false} emptyTitle="No offers extended yet" />
    </Card>
  )
}
