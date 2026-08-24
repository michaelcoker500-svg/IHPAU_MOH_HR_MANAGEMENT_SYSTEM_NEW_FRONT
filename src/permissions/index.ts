import type { Permission, RoleKey } from '@/types'

export const ROLE_LABELS: Record<RoleKey, string> = {
  SUPER_ADMIN: 'Super Admin',
  HR_ADMIN: 'HR Administrator',
  HR_OFFICER: 'HR Officer',
  MANAGER: 'Department Manager',
  EMPLOYEE: 'Employee',
  RECRUITER: 'Recruiter',
  TRAINING_MANAGER: 'Training Manager',
  PERFORMANCE_MANAGER: 'Performance Manager',
  FINANCE: 'Finance',
}

const ALL: Permission[] = [
  'employee.view', 'employee.create', 'employee.update', 'employee.delete',
  'department.view', 'department.manage',
  'attendance.view', 'attendance.manage',
  'leave.view', 'leave.create', 'leave.approve', 'leave.reject',
  'recruitment.view', 'recruitment.manage',
  'performance.view', 'performance.manage',
  'training.view', 'training.manage',
  'document.view', 'document.manage',
  'workflow.view', 'workflow.approve',
  'audit.view', 'audit.manage',
  'report.view',
  'admin.manage',
  'compensation.view',
]

export const ROLE_PERMISSIONS: Record<RoleKey, Permission[]> = {
  SUPER_ADMIN: ALL,
  HR_ADMIN: [
    'employee.view', 'employee.create', 'employee.update', 'employee.delete',
    'department.view', 'department.manage',
    'attendance.view', 'attendance.manage',
    'leave.view', 'leave.create', 'leave.approve', 'leave.reject',
    'recruitment.view', 'recruitment.manage',
    'performance.view', 'performance.manage',
    'training.view', 'training.manage',
    'document.view', 'document.manage',
    'workflow.view', 'workflow.approve',
    'report.view',
  ],
  HR_OFFICER: [
    'employee.view', 'employee.create', 'employee.update',
    'department.view',
    'attendance.view', 'attendance.manage',
    'leave.view', 'leave.create', 'leave.approve',
    'recruitment.view',
    'document.view', 'document.manage',
    'workflow.view',
    'report.view',
  ],
  MANAGER: [
    'employee.view',
    'department.view',
    'attendance.view',
    'leave.view', 'leave.create', 'leave.approve',
    'performance.view', 'performance.manage',
    'training.view',
    'workflow.view', 'workflow.approve',
    'report.view',
  ],
  EMPLOYEE: [
    'attendance.view',
    'leave.view', 'leave.create',
    'performance.view',
    'training.view',
    'document.view',
    'workflow.view',
  ],
  RECRUITER: [
    'recruitment.view', 'recruitment.manage',
    'employee.view',
    'report.view',
  ],
  TRAINING_MANAGER: [
    'training.view', 'training.manage',
    'employee.view',
    'report.view',
  ],
  PERFORMANCE_MANAGER: [
    'performance.view', 'performance.manage',
    'employee.view',
    'report.view',
  ],
  FINANCE: [
    'employee.view',
    'compensation.view',
    'report.view',
  ],
}

export function hasPermission(role: RoleKey, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false
}

export function hasAnyPermission(role: RoleKey, perms: Permission[]): boolean {
  return perms.some((p) => hasPermission(role, p))
}
