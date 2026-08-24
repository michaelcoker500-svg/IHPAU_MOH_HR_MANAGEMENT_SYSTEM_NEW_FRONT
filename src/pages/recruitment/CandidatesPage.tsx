import { Card } from '@/components/ui/Card'
import { DataTable, type Column } from '@/components/ui/DataTable'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { candidates, applications, jobOpenings } from '@/data/seed'
import { initials } from '@/lib/utils'
import type { Candidate } from '@/types'

export default function CandidatesPage() {
  const columns: Column<Candidate>[] = [
    {
      key: 'name', header: 'Candidate', sortValue: (c) => `${c.firstName} ${c.lastName}`,
      render: (c) => (
        <div className="flex items-center gap-2.5">
          <Avatar name={initials(c.firstName, c.lastName)} size="sm" />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-ink-900">{c.firstName} {c.lastName}</p>
            <p className="truncate text-xs text-ink-500">{c.email}</p>
          </div>
        </div>
      ),
    },
    { key: 'source', header: 'Source', render: (c) => <Badge tone="neutral">{c.source}</Badge> },
    {
      key: 'applications', header: 'Applications',
      render: (c) => {
        const apps = applications.filter((a) => a.candidateId === c.id)
        return apps.length === 0 ? '—' : apps.map((a) => jobOpenings.find((j) => j.id === a.jobId)?.title).join(', ')
      },
    },
    { key: 'phone', header: 'Phone', render: (c) => c.phone, hideOnMobile: true },
  ]

  return (
    <Card>
      <DataTable columns={columns} rows={candidates} keyField={(c) => c.id} searchPlaceholder="Search candidates..." searchFn={(c, q) => `${c.firstName} ${c.lastName} ${c.email}`.toLowerCase().includes(q)} />
    </Card>
  )
}
