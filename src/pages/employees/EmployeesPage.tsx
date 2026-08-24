import { useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { UserPlus, Users } from 'lucide-react'
import { PageHeader } from '@/components/shared/PageHeader'
import { PermissionGate } from '@/components/shared/PermissionGate'
import { Card } from '@/components/ui/Card'
import { DataTable, type Column } from '@/components/ui/DataTable'
import { Button } from '@/components/ui/Button'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { Avatar } from '@/components/ui/Avatar'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { FilterBar } from '@/components/ui/FilterBar'
import { useToast } from '@/app/toast-context'
import { employees as seedEmployees, departments, positions, locations } from '@/data/seed'
import { useLookups } from '@/hooks/useLookup'
import { initials, formatDate } from '@/lib/utils'
import type { Employee } from '@/types'

export default function EmployeesPage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const { deptById, posById } = useLookups()
  const { toast } = useToast()
  const [list, setList] = useState<Employee[]>(seedEmployees)
  const [deptFilter, setDeptFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [createOpen, setCreateOpen] = useState(searchParams.get('new') === '1')
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', departmentId: departments[0].id, positionId: positions[0].id })

  const filtered = useMemo(
    () => list.filter((e) => (!deptFilter || e.departmentId === deptFilter) && (!statusFilter || e.employmentStatus === statusFilter)),
    [list, deptFilter, statusFilter],
  )

  const columns: Column<Employee>[] = [
    {
      key: 'name', header: 'Employee', sortValue: (e) => `${e.firstName} ${e.lastName}`,
      render: (e) => (
        <button onClick={() => navigate(`/employees/${e.id}`)} className="flex items-center gap-2.5 text-left">
          <Avatar name={initials(e.firstName, e.lastName)} size="sm" />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-ink-900 hover:underline">{e.firstName} {e.lastName}</p>
            <p className="truncate text-xs text-ink-500">{e.employeeCode}</p>
          </div>
        </button>
      ),
    },
    { key: 'department', header: 'Department', sortValue: (e) => deptById[e.departmentId]?.name ?? '', render: (e) => deptById[e.departmentId]?.name ?? '—' },
    { key: 'position', header: 'Position', render: (e) => posById[e.positionId]?.title ?? '—' },
    { key: 'joinDate', header: 'Join Date', sortValue: (e) => e.joinDate, render: (e) => formatDate(e.joinDate), hideOnMobile: true },
    { key: 'status', header: 'Status', render: (e) => <StatusBadge status={e.employmentStatus} /> },
  ]

  function handleCreate() {
    if (!form.firstName || !form.lastName || !form.email) {
      toast({ title: 'Missing required fields', description: 'First name, last name, and email are required.', variant: 'error' })
      return
    }
    const newEmp: Employee = {
      id: `emp-live-${Date.now()}`,
      employeeCode: `EMP-${String(list.length + 1).padStart(4, '0')}`,
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      phone: '',
      gender: 'Male',
      dateOfBirth: '1995-01-01',
      departmentId: form.departmentId,
      positionId: form.positionId,
      locationId: locations[0].id,
      managerId: null,
      employmentStatus: 'ACTIVE',
      employmentType: 'FULL_TIME',
      joinDate: new Date().toISOString().slice(0, 10),
    }
    setList((prev) => [newEmp, ...prev])
    setCreateOpen(false)
    setSearchParams({})
    setForm({ firstName: '', lastName: '', email: '', departmentId: departments[0].id, positionId: positions[0].id })
    toast({ title: 'Employee created successfully', variant: 'success' })
  }

  return (
    <div>
      <PageHeader
        title="Employees"
        subtitle="Manage your workforce"
        actions={
          <PermissionGate permission="employee.create">
            <Button onClick={() => setCreateOpen(true)}><UserPlus size={16} /> Add Employee</Button>
          </PermissionGate>
        }
      />

      <Card>
        <DataTable
          columns={columns}
          rows={filtered}
          keyField={(e) => e.id}
          searchPlaceholder="Search by name or employee ID..."
          searchFn={(e, q) => `${e.firstName} ${e.lastName} ${e.employeeCode}`.toLowerCase().includes(q)}
          emptyTitle="No employees found"
          emptyDescription="Try adjusting your filters or search terms."
          toolbar={
            <FilterBar activeCount={(deptFilter ? 1 : 0) + (statusFilter ? 1 : 0)} onClear={() => { setDeptFilter(''); setStatusFilter('') }}>
              <Select value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)} aria-label="Filter by department" className="sm:w-48">
                <option value="">All Departments</option>
                {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
              </Select>
              <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} aria-label="Filter by status" className="sm:w-40">
                <option value="">All Statuses</option>
                {['ACTIVE', 'ON_LEAVE', 'SUSPENDED', 'TERMINATED'].map((s) => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
              </Select>
            </FilterBar>
          }
          renderMobileCard={(e) => (
            <button onClick={() => navigate(`/employees/${e.id}`)} className="flex w-full items-center gap-3 text-left">
              <Avatar name={initials(e.firstName, e.lastName)} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-ink-900">{e.firstName} {e.lastName}</p>
                <p className="truncate text-xs text-ink-500">{e.employeeCode} · {posById[e.positionId]?.title}</p>
                <p className="truncate text-xs text-ink-500">{deptById[e.departmentId]?.name}</p>
              </div>
              <StatusBadge status={e.employmentStatus} />
            </button>
          )}
        />
      </Card>

      {filtered.length === 0 && list.length > 0 && (
        <div className="mt-4"><Card><Users className="hidden" /></Card></div>
      )}

      <Modal
        open={createOpen}
        onClose={() => { setCreateOpen(false); setSearchParams({}) }}
        title="Add Employee"
        description="Create a new employee record."
        footer={<><Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button><Button onClick={handleCreate}>Save Employee</Button></>}
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input label="First Name" required value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
          <Input label="Last Name" required value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
          <Input label="Email" type="email" required className="sm:col-span-2" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <Select label="Department" value={form.departmentId} onChange={(e) => setForm({ ...form, departmentId: e.target.value })}>
            {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
          </Select>
          <Select label="Position" value={form.positionId} onChange={(e) => setForm({ ...form, positionId: e.target.value })}>
            {positions.filter((p) => p.departmentId === form.departmentId).map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}
          </Select>
        </div>
      </Modal>
    </div>
  )
}
