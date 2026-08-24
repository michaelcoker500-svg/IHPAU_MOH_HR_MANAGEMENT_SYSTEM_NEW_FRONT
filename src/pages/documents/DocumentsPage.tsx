import { FileText, Download, Eye } from 'lucide-react'
import { PageHeader } from '@/components/shared/PageHeader'
import { Card } from '@/components/ui/Card'
import { DataTable, type Column } from '@/components/ui/DataTable'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { Badge } from '@/components/ui/Badge'
import { Dropdown } from '@/components/ui/Dropdown'
import { useAuth } from '@/app/auth-context'
import { useToast } from '@/app/toast-context'
import { employeeDocuments } from '@/data/seed'
import { employeeName } from '@/hooks/useLookup'
import { formatDate } from '@/lib/utils'
import type { EmployeeDocument } from '@/types'

export default function DocumentsPage() {
  const { user, can } = useAuth()
  const { toast } = useToast()

  const visibleDocs = can('document.manage')
    ? employeeDocuments
    : employeeDocuments.filter((d) => d.employeeId === user?.employeeId && d.visibility !== 'CONFIDENTIAL')

  const columns: Column<EmployeeDocument>[] = [
    { key: 'name', header: 'Document', render: (d) => <span className="font-medium text-ink-900">{d.category}</span> },
    { key: 'employee', header: 'Employee', render: (d) => employeeName(d.employeeId) },
    { key: 'visibility', header: 'Visibility', render: (d) => <Badge tone="neutral">{d.visibility.replace(/_/g, ' ')}</Badge>, hideOnMobile: true },
    { key: 'uploaded', header: 'Uploaded', sortValue: (d) => d.uploadedAt, render: (d) => formatDate(d.uploadedAt) },
    { key: 'status', header: 'Status', render: (d) => <StatusBadge status={d.status} /> },
  ]

  return (
    <div>
      <PageHeader title="Documents" subtitle="Employee documents and compliance records" />
      <Card>
        <DataTable
          columns={columns}
          rows={visibleDocs}
          keyField={(d) => d.id}
          searchPlaceholder="Search documents..."
          searchFn={(d, q) => d.category.toLowerCase().includes(q) || employeeName(d.employeeId).toLowerCase().includes(q)}
          rowActions={(d) => (
            <Dropdown
              align="right"
              trigger={<button className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-500 hover:bg-ink-100"><FileText size={15} /></button>}
              items={[
                { label: 'View', icon: <Eye size={14} />, onClick: () => toast({ title: 'Document preview requires backend storage integration', variant: 'info' }) },
                { label: 'Download', icon: <Download size={14} />, onClick: () => toast({ title: 'Document download requires backend storage integration', variant: 'info' }) },
              ]}
            />
          )}
        />
      </Card>
    </div>
  )
}
