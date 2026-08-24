import { useMemo, useState } from 'react'
import { PageHeader } from '@/components/shared/PageHeader'
import { Card } from '@/components/ui/Card'
import { DataTable, type Column } from '@/components/ui/DataTable'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { Select } from '@/components/ui/Select'
import { FilterBar } from '@/components/ui/FilterBar'
import { attendanceRecords, departments, employees } from '@/data/seed'
import { useLookups } from '@/hooks/useLookup'
import { formatDate } from '@/lib/utils'
import type { AttendanceRecord } from '@/types'

const TODAY = '2026-08-17'

export default function AttendancePage() {
  const { deptById, empById } = useLookups()
  const [dateFilter, setDateFilter] = useState(TODAY)
  const [deptFilter, setDeptFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const rows = useMemo(
    () => attendanceRecords.filter((a) => {
      const emp = empById[a.employeeId]
      if (!emp) return false
      if (dateFilter && a.date !== dateFilter) return false
      if (deptFilter && emp.departmentId !== deptFilter) return false
      if (statusFilter && a.status !== statusFilter) return false
      return true
    }),
    [dateFilter, deptFilter, statusFilter, empById],
  )

  const columns: Column<AttendanceRecord>[] = [
    { key: 'employee', header: 'Employee', render: (a) => { const e = empById[a.employeeId]; return e ? `${e.firstName} ${e.lastName}` : '—' } },
    { key: 'dept', header: 'Department', render: (a) => { const e = empById[a.employeeId]; return e ? deptById[e.departmentId]?.name : '—' } },
    { key: 'date', header: 'Date', sortValue: (a) => a.date, render: (a) => formatDate(a.date) },
    { key: 'checkin', header: 'Check In', render: (a) => a.checkIn ?? '—' },
    { key: 'checkout', header: 'Check Out', render: (a) => a.checkOut ?? '—' },
    { key: 'status', header: 'Status', render: (a) => <StatusBadge status={a.status} /> },
  ]

  const summary = {
    present: rows.filter((a) => a.status === 'PRESENT').length,
    late: rows.filter((a) => a.status === 'LATE').length,
    absent: rows.filter((a) => a.status === 'ABSENT').length,
    remote: rows.filter((a) => a.status === 'REMOTE').length,
  }

  return (
    <div>
      <PageHeader title="Attendance" subtitle="Organization-wide attendance records" />
      <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: 'Present', value: summary.present, tone: 'text-success-600' },
          { label: 'Late', value: summary.late, tone: 'text-warning-600' },
          { label: 'Absent', value: summary.absent, tone: 'text-danger-600' },
          { label: 'Remote', value: summary.remote, tone: 'text-info-600' },
        ].map((s) => (
          <Card key={s.label} className="p-4">
            <p className="text-xs text-ink-500">{s.label}</p>
            <p className={`mt-1 text-xl font-semibold ${s.tone}`}>{s.value}</p>
          </Card>
        ))}
      </div>
      <Card>
        <DataTable
          columns={columns}
          rows={rows}
          keyField={(a) => a.id}
          searchPlaceholder="Search by employee name..."
          searchFn={(a, q) => { const e = empById[a.employeeId]; return e ? `${e.firstName} ${e.lastName}`.toLowerCase().includes(q) : false }}
          toolbar={
            <FilterBar activeCount={(deptFilter ? 1 : 0) + (statusFilter ? 1 : 0)} onClear={() => { setDeptFilter(''); setStatusFilter('') }}>
              <input type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className="h-11 rounded-lg border border-ink-300 px-3 text-sm" aria-label="Filter by date" />
              <Select value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)} aria-label="Filter by department" className="sm:w-48">
                <option value="">All Departments</option>
                {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
              </Select>
              <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} aria-label="Filter by status" className="sm:w-40">
                <option value="">All Statuses</option>
                {['PRESENT', 'LATE', 'ABSENT', 'REMOTE', 'HALF_DAY', 'EXCUSED'].map((s) => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
              </Select>
            </FilterBar>
          }
          renderMobileCard={(a) => {
            const e = empById[a.employeeId]
            return (
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-ink-900">{e ? `${e.firstName} ${e.lastName}` : '—'}</p>
                  <p className="text-xs text-ink-500">{formatDate(a.date)} · {a.checkIn ?? '—'} → {a.checkOut ?? '—'}</p>
                </div>
                <StatusBadge status={a.status} />
              </div>
            )
          }}
        />
      </Card>
    </div>
  )
}
