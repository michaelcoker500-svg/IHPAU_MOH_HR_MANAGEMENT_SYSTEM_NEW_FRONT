import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { AuthUser, Organization, Permission, RoleKey } from '@/types'
import { hasPermission, ROLE_LABELS } from '@/permissions'
import { deptHeads, employees } from '@/data/seed'
import { initials } from '@/lib/utils'

export const ORGANIZATION: Organization = {
  id: 'org-ihpau',
  name: 'International Human Potential & Advancement Union',
  shortName: 'IHPAU',
  country: 'Sierra Leone',
  timezone: 'Africa/Freetown',
}

interface DemoAccount {
  role: RoleKey
  email: string
  name: string
  employeeId?: string
}

// Map demo accounts to real seeded employees so data is consistent
const hrAdminEmployee = employees.find((e) => e.positionId === 'pos-1')
const hrOfficerEmployee = employees.find((e) => e.positionId === 'pos-2')
const managerEmployee = employees.find((e) => e.id === deptHeads['dept-3'])
const genericEmployee = employees.find((e) => e.departmentId === 'dept-3' && e.positionId === 'pos-8')
const recruiterEmployee = employees.find((e) => e.positionId === 'pos-23')
const trainingEmployee = employees.find((e) => e.positionId === 'pos-24')
const performanceEmployee = employees.find((e) => e.positionId === 'pos-25')
const financeEmployee = employees.find((e) => e.positionId === 'pos-4')

export const DEMO_ACCOUNTS: DemoAccount[] = [
  { role: 'SUPER_ADMIN', email: 'superadmin@ihpau.demo', name: 'System Administrator' },
  { role: 'HR_ADMIN', email: 'hr.admin@ihpau.demo', name: hrAdminEmployee ? `${hrAdminEmployee.firstName} ${hrAdminEmployee.lastName}` : 'Sarah Kamara', employeeId: hrAdminEmployee?.id },
  { role: 'HR_OFFICER', email: 'hr.officer@ihpau.demo', name: hrOfficerEmployee ? `${hrOfficerEmployee.firstName} ${hrOfficerEmployee.lastName}` : 'Aminata Sesay', employeeId: hrOfficerEmployee?.id },
  { role: 'MANAGER', email: 'manager@ihpau.demo', name: managerEmployee ? `${managerEmployee.firstName} ${managerEmployee.lastName}` : 'David Bangura', employeeId: managerEmployee?.id },
  { role: 'EMPLOYEE', email: 'employee@ihpau.demo', name: genericEmployee ? `${genericEmployee.firstName} ${genericEmployee.lastName}` : 'Mohamed Koroma', employeeId: genericEmployee?.id },
  { role: 'RECRUITER', email: 'recruiter@ihpau.demo', name: recruiterEmployee ? `${recruiterEmployee.firstName} ${recruiterEmployee.lastName}` : 'Fatmata Turay', employeeId: recruiterEmployee?.id },
  { role: 'TRAINING_MANAGER', email: 'training@ihpau.demo', name: trainingEmployee ? `${trainingEmployee.firstName} ${trainingEmployee.lastName}` : 'Isata Kargbo', employeeId: trainingEmployee?.id },
  { role: 'PERFORMANCE_MANAGER', email: 'performance@ihpau.demo', name: performanceEmployee ? `${performanceEmployee.firstName} ${performanceEmployee.lastName}` : 'Osman Jalloh', employeeId: performanceEmployee?.id },
  { role: 'FINANCE', email: 'finance@ihpau.demo', name: financeEmployee ? `${financeEmployee.firstName} ${financeEmployee.lastName}` : 'Hawa Conteh', employeeId: financeEmployee?.id },
]

interface AuthContextValue {
  user: AuthUser | null
  organization: Organization
  isDemoMode: boolean
  loginAsDemo: (role: RoleKey) => void
  logout: () => void
  can: (permission: Permission) => boolean
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)

  const loginAsDemo = (role: RoleKey) => {
    const account = DEMO_ACCOUNTS.find((a) => a.role === role)!
    const [first, ...rest] = account.name.split(' ')
    setUser({
      id: `user-${role.toLowerCase()}`,
      name: account.name,
      email: account.email,
      role: account.role,
      roleLabel: ROLE_LABELS[account.role],
      organizationId: ORGANIZATION.id,
      employeeId: account.employeeId,
      avatarInitials: initials(first, rest.join(' ')),
      lastLogin: new Date().toISOString(),
    })
  }

  const logout = () => setUser(null)

  const can = (permission: Permission) => (user ? hasPermission(user.role, permission) : false)

  const value = useMemo<AuthContextValue>(
    () => ({ user, organization: ORGANIZATION, isDemoMode: true, loginAsDemo, logout, can }),
    [user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
