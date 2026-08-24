import { Fragment } from 'react'
import { PageHeader } from '@/components/shared/PageHeader'
import { Card, CardBody } from '@/components/ui/Card'
import { Check, X } from 'lucide-react'
import { ROLE_LABELS, ROLE_PERMISSIONS } from '@/permissions'
import type { Permission, RoleKey } from '@/types'

const GROUPS: { label: string; perms: Permission[] }[] = [
  { label: 'Employee', perms: ['employee.view', 'employee.create', 'employee.update', 'employee.delete'] },
  { label: 'Department', perms: ['department.view', 'department.manage'] },
  { label: 'Attendance', perms: ['attendance.view', 'attendance.manage'] },
  { label: 'Leave', perms: ['leave.view', 'leave.create', 'leave.approve', 'leave.reject'] },
  { label: 'Recruitment', perms: ['recruitment.view', 'recruitment.manage'] },
  { label: 'Performance', perms: ['performance.view', 'performance.manage'] },
  { label: 'Training', perms: ['training.view', 'training.manage'] },
  { label: 'Documents', perms: ['document.view', 'document.manage'] },
  { label: 'Workflows', perms: ['workflow.view', 'workflow.approve'] },
  { label: 'Audit', perms: ['audit.view', 'audit.manage'] },
  { label: 'Reports', perms: ['report.view'] },
]

export default function PermissionsPage() {
  const roles = Object.keys(ROLE_LABELS) as RoleKey[]
  return (
    <div>
      <PageHeader title="Permissions" subtitle="Capabilities grouped by resource" />

      {/* Desktop matrix */}
      <Card className="hidden overflow-x-auto lg:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-ink-100 bg-ink-50/60 text-left text-xs font-medium uppercase text-ink-500">
              <th className="px-4 py-2.5">Permission</th>
              {roles.map((r) => <th key={r} className="px-3 py-2.5 text-center">{ROLE_LABELS[r].split(' ')[0]}</th>)}
            </tr>
          </thead>
          <tbody>
            {GROUPS.map((group) => (
              <Fragment key={group.label}>
                <tr className="bg-ink-50/40"><td colSpan={roles.length + 1} className="px-4 py-1.5 text-xs font-semibold text-ink-600">{group.label}</td></tr>
                {group.perms.map((perm) => (
                  <tr key={perm} className="border-b border-ink-50">
                    <td className="px-4 py-2 text-ink-700">{perm.split('.')[1]}</td>
                    {roles.map((r) => (
                      <td key={r} className="px-3 py-2 text-center">
                        {ROLE_PERMISSIONS[r].includes(perm) ? <Check size={14} className="mx-auto text-success-600" /> : <X size={14} className="mx-auto text-ink-300" />}
                      </td>
                    ))}
                  </tr>
                ))}
              </Fragment>
            ))}
          </tbody>
        </table>
      </Card>

      {/* Mobile: expandable groups per role selection is complex; show simplified per-group cards */}
      <div className="space-y-3 lg:hidden">
        {GROUPS.map((group) => (
          <Card key={group.label}>
            <CardBody>
              <p className="mb-2 text-sm font-semibold text-ink-900">{group.label}</p>
              {group.perms.map((perm) => (
                <div key={perm} className="flex items-center justify-between border-t border-ink-50 py-1.5 text-sm first:border-0">
                  <span className="text-ink-600">{perm.split('.')[1]}</span>
                  <span className="text-xs text-ink-400">{roles.filter((r) => ROLE_PERMISSIONS[r].includes(perm)).length} roles</span>
                </div>
              ))}
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  )
}
