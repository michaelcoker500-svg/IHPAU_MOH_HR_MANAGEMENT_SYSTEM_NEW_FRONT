import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Building2, Edit3 } from 'lucide-react'
import { PageHeader } from '@/components/shared/PageHeader'
import { Breadcrumbs } from '@/components/shared/Breadcrumbs'
import { Card, CardHeader, CardBody } from '@/components/ui/Card'
import { DataTable, type Column } from '@/components/ui/DataTable'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { Tabs } from '@/components/ui/Tabs'
import { EmptyState } from '@/components/ui/EmptyState'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { PermissionGate } from '@/components/shared/PermissionGate'
import { useToast } from '@/app/toast-context'
import { departments as seedDepartments, employees, positions } from '@/data/seed'
import { employeeName } from '@/hooks/useLookup'
import type { Department } from '@/types'

export function DepartmentsPage() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [departments, setDepartments] = useState<Department[]>(seedDepartments)
  const [editTarget, setEditTarget] = useState<Department | null>(null)
  const [form, setForm] = useState({ name: '', code: '', managerId: '' })
  const [saving, setSaving] = useState(false)

  function openEdit(d: Department) {
    setForm({ name: d.name, code: d.code, managerId: d.managerId ?? '' })
    setEditTarget(d)
  }

  async function saveEdit() {
    if (!editTarget) return
    setSaving(true)
    await new Promise((r) => setTimeout(r, 400))
    setDepartments((prev) => prev.map((d) => (d.id === editTarget.id ? { ...d, name: form.name, code: form.code, managerId: form.managerId || null } : d)))
    setSaving(false)
    setEditTarget(null)
    toast({ title: 'Department updated successfully', variant: 'success' })
  }

  const columns: Column<Department>[] = [
    { key: 'name', header: 'Department', sortValue: (d) => d.name, render: (d) => <button onClick={() => navigate(`/departments/${d.id}`)} className="font-medium text-ink-900 hover:underline">{d.name}</button> },
    { key: 'code', header: 'Code', render: (d) => d.code },
    { key: 'manager', header: 'Manager', render: (d) => employeeName(d.managerId) },
    { key: 'count', header: 'Employees', sortValue: (d) => employees.filter((e) => e.departmentId === d.id).length, render: (d) => employees.filter((e) => e.departmentId === d.id).length },
    { key: 'status', header: 'Status', render: (d) => <StatusBadge status={d.status} /> },
  ]

  return (
    <div>
      <PageHeader title="Departments" subtitle="Organization structure across IHPAU" />
      <Card>
        <DataTable
          columns={columns}
          rows={departments}
          keyField={(d) => d.id}
          searchPlaceholder="Search departments..."
          searchFn={(d, q) => d.name.toLowerCase().includes(q) || d.code.toLowerCase().includes(q)}
          rowActions={(d) => (
            <PermissionGate permission="department.manage">
              <Button size="sm" variant="ghost" onClick={() => openEdit(d)}><Edit3 size={13} /> Edit</Button>
            </PermissionGate>
          )}
          renderMobileCard={(d) => (
            <div className="flex w-full items-center gap-3">
              <button onClick={() => navigate(`/departments/${d.id}`)} className="flex min-w-0 flex-1 items-center gap-3 text-left">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600"><Building2 size={18} /></div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-ink-900">{d.name}</p>
                  <p className="text-xs text-ink-500">{employees.filter((e) => e.departmentId === d.id).length} employees · {employeeName(d.managerId)}</p>
                </div>
              </button>
              <StatusBadge status={d.status} />
            </div>
          )}
        />
      </Card>

      <Modal
        open={!!editTarget}
        onClose={() => setEditTarget(null)}
        title="Edit Department"
        footer={<><Button variant="outline" onClick={() => setEditTarget(null)}>Cancel</Button><Button onClick={saveEdit} loading={saving}>Save Changes</Button></>}
      >
        <div className="space-y-4">
          <Input label="Department Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input label="Code" required value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} />
          <Select label="Manager" value={form.managerId} onChange={(e) => setForm({ ...form, managerId: e.target.value })}>
            <option value="">Unassigned</option>
            {employees.filter((e) => e.departmentId === editTarget?.id).map((e) => <option key={e.id} value={e.id}>{e.firstName} {e.lastName}</option>)}
          </Select>
        </div>
      </Modal>
    </div>
  )
}

export function DepartmentDetailPage() {
  const { id } = useParams()
  const [tab, setTab] = useState('employees')
  const department = seedDepartments.find((d) => d.id === id)
  if (!department) return <EmptyState title="Department not found" />

  const deptEmployees = employees.filter((e) => e.departmentId === department.id)
  const deptPositions = positions.filter((p) => p.departmentId === department.id)

  return (
    <div>
      <Breadcrumbs items={[{ label: 'Departments', href: '/departments' }, { label: department.name }]} />
      <PageHeader title={department.name} subtitle={`${department.code} · Managed by ${employeeName(department.managerId)}`} />
      <Card>
        <div className="px-2 pt-2 sm:px-3">
          <Tabs tabs={[{ key: 'employees', label: 'Employees', count: deptEmployees.length }, { key: 'positions', label: 'Positions', count: deptPositions.length }]} active={tab} onChange={setTab} />
        </div>
        <CardBody className="p-0">
          {tab === 'employees' && (
            <div className="divide-y divide-ink-100">
              {deptEmployees.map((e) => (
                <div key={e.id} className="flex items-center justify-between gap-3 px-5 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-ink-800">{e.firstName} {e.lastName}</p>
                    <p className="text-xs text-ink-500">{positions.find((p) => p.id === e.positionId)?.title}</p>
                  </div>
                  <StatusBadge status={e.employmentStatus} />
                </div>
              ))}
            </div>
          )}
          {tab === 'positions' && (
            <div className="divide-y divide-ink-100">
              {deptPositions.map((p) => (
                <div key={p.id} className="flex items-center justify-between gap-3 px-5 py-3">
                  <p className="text-sm font-medium text-ink-800">{p.title}</p>
                  <p className="text-xs text-ink-500">{employees.filter((e) => e.positionId === p.id).length} employees</p>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  )
}

export default DepartmentsPage
