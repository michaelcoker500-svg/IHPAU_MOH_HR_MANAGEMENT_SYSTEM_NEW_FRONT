import {
  LayoutDashboard, Users, Building2, Briefcase, MapPin, Clock, CalendarDays,
  UserSearch, Target, GraduationCap, FileText, CheckSquare, Bell, ScrollText,
  BarChart3, Shield, UserCog, Settings, ClipboardList,
} from 'lucide-react'
import type { Permission } from '@/types'

export interface NavItem {
  label: string
  href: string
  icon: typeof LayoutDashboard
  requires?: Permission
}

export interface NavGroup {
  label?: string
  items: NavItem[]
}

export const NAV_GROUPS: NavGroup[] = [
  {
    items: [{ label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard }],
  },
  {
    label: 'Workforce',
    items: [
      { label: 'Employees', href: '/employees', icon: Users, requires: 'employee.view' },
      { label: 'Departments', href: '/departments', icon: Building2, requires: 'department.view' },
      { label: 'Positions', href: '/positions', icon: Briefcase, requires: 'department.view' },
      { label: 'Locations', href: '/locations', icon: MapPin, requires: 'department.view' },
    ],
  },
  {
    label: 'Time & Leave',
    items: [
      { label: 'Attendance', href: '/attendance', icon: Clock, requires: 'attendance.view' },
      { label: 'My Attendance', href: '/my-attendance', icon: Clock },
      { label: 'Leave', href: '/leave', icon: CalendarDays, requires: 'leave.view' },
      { label: 'My Leave', href: '/my-leave', icon: CalendarDays },
    ],
  },
  {
    label: 'Recruitment',
    items: [{ label: 'Recruitment', href: '/recruitment', icon: UserSearch, requires: 'recruitment.view' }],
  },
  {
    label: 'Growth',
    items: [
      { label: 'Performance', href: '/performance', icon: Target, requires: 'performance.view' },
      { label: 'Training', href: '/training', icon: GraduationCap, requires: 'training.view' },
    ],
  },
  {
    label: 'Records',
    items: [
      { label: 'Documents', href: '/documents', icon: FileText, requires: 'document.view' },
      { label: 'Approvals', href: '/approvals', icon: CheckSquare, requires: 'workflow.view' },
      { label: 'Notifications', href: '/notifications', icon: Bell },
      { label: 'Audit Log', href: '/audit', icon: ScrollText, requires: 'audit.view' },
    ],
  },
  {
    label: 'Insights',
    items: [{ label: 'Reports', href: '/reports', icon: BarChart3, requires: 'report.view' }],
  },
  {
    label: 'Administration',
    items: [
      { label: 'Users', href: '/admin/users', icon: UserCog, requires: 'admin.manage' },
      { label: 'Roles', href: '/admin/roles', icon: Shield, requires: 'admin.manage' },
      { label: 'Permissions', href: '/admin/permissions', icon: ClipboardList, requires: 'admin.manage' },
      { label: 'Settings', href: '/settings', icon: Settings },
    ],
  },
]
