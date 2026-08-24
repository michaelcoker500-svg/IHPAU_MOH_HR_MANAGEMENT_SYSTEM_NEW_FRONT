import { useState } from 'react'
import { PageHeader } from '@/components/shared/PageHeader'
import { Card } from '@/components/ui/Card'
import { DataTable, type Column } from '@/components/ui/DataTable'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { Select } from '@/components/ui/Select'
import { FilterBar } from '@/components/ui/FilterBar'
import { Drawer } from '@/components/ui/Drawer'
import { auditEvents } from '@/data/seed'
import { formatDateTime } from '@/lib/utils'
import type { AuditEvent } from '@/types'

export default function AuditPage() {
  const [resourceFilter, setResourceFilter] = useState('')
  const [selected, setSelected] = useState<AuditEvent | null>(null)
  const resources = Array.from(new Set(auditEvents.map((a) => a.resource)))

  const rows = auditEvents.filter((a) => !resourceFilter || a.resource === resourceFilter)

  const columns: Column<AuditEvent>[] = [
    { key: 'timestamp', header: 'Timestamp', sortValue: (a) => a.timestamp, render: (a) => formatDateTime(a.timestamp) },
    { key: 'actor', header: 'Actor', render: (a) => a.actor },
    { key: 'action', header: 'Action', render: (a) => a.action },
    { key: 'resource', header: 'Resource', render: (a) => a.resource, hideOnMobile: true },
    { key: 'status', header: 'Status', render: (a) => <StatusBadge status={a.status} /> },
  ]

  return (
    <div>
      <PageHeader title="Audit Log" subtitle="Read-only record of system activity" />
      <Card>
        <DataTable
          columns={columns}
          rows={rows}
          keyField={(a) => a.id}
          searchPlaceholder="Search by actor or action..."
          searchFn={(a, q) => `${a.actor} ${a.action}`.toLowerCase().includes(q)}
          toolbar={
            <FilterBar activeCount={resourceFilter ? 1 : 0} onClear={() => setResourceFilter('')}>
              <Select value={resourceFilter} onChange={(e) => setResourceFilter(e.target.value)} aria-label="Filter by resource" className="sm:w-48">
                <option value="">All Resources</option>
                {resources.map((r) => <option key={r} value={r}>{r}</option>)}
              </Select>
            </FilterBar>
          }
          rowActions={(a) => <button onClick={() => setSelected(a)} className="text-xs font-medium text-brand-600 hover:underline">Inspect</button>}
        />
      </Card>

      <Drawer open={!!selected} onClose={() => setSelected(null)} title="Audit Record">
        {selected && (
          <dl className="space-y-4 text-sm">
            <div><dt className="text-xs text-ink-500">Timestamp</dt><dd className="font-medium text-ink-800">{formatDateTime(selected.timestamp)}</dd></div>
            <div><dt className="text-xs text-ink-500">Actor</dt><dd className="font-medium text-ink-800">{selected.actor}</dd></div>
            <div><dt className="text-xs text-ink-500">Action</dt><dd className="font-medium text-ink-800">{selected.action}</dd></div>
            <div><dt className="text-xs text-ink-500">Resource</dt><dd className="font-medium text-ink-800">{selected.resource}</dd></div>
            <div><dt className="text-xs text-ink-500">Status</dt><dd><StatusBadge status={selected.status} /></dd></div>
            <div><dt className="text-xs text-ink-500">Organization</dt><dd className="font-medium text-ink-800">IHPAU</dd></div>
          </dl>
        )}
      </Drawer>
    </div>
  )
}
