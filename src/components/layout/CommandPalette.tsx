import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createPortal } from 'react-dom'
import { Search, ArrowRight, User, Building2, LayoutDashboard, PlusCircle } from 'lucide-react'
import { employees, departments } from '@/data/seed'
import { useAuth } from '@/app/auth-context'
import { NAV_GROUPS } from '@/app/nav-config'

interface ResultItem {
  id: string
  label: string
  sublabel?: string
  icon: typeof Search
  onSelect: () => void
  group: string
}

export function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()
  const { can } = useAuth()

  useEffect(() => {
    if (!open) setQuery('')
  }, [open])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    if (open) document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  const results = useMemo<ResultItem[]>(() => {
    const q = query.toLowerCase().trim()
    const items: ResultItem[] = []

    const navItems = NAV_GROUPS.flatMap((g) => g.items).filter((i) => !i.requires || can(i.requires))
    for (const item of navItems) {
      if (!q || item.label.toLowerCase().includes(q)) {
        items.push({ id: `nav-${item.href}`, label: `Go to ${item.label}`, icon: LayoutDashboard, onSelect: () => navigate(item.href), group: 'Navigation' })
      }
    }

    if (can('employee.create')) {
      if (!q || 'create employee'.includes(q)) {
        items.push({ id: 'create-emp', label: 'Create Employee', icon: PlusCircle, onSelect: () => navigate('/employees?new=1'), group: 'Actions' })
      }
    }
    if (can('leave.create')) {
      if (!q || 'create leave request'.includes(q)) {
        items.push({ id: 'create-leave', label: 'Create Leave Request', icon: PlusCircle, onSelect: () => navigate('/my-leave?new=1'), group: 'Actions' })
      }
    }

    if (q.length >= 2) {
      for (const emp of employees.slice(0, 200)) {
        const full = `${emp.firstName} ${emp.lastName}`.toLowerCase()
        if (full.includes(q) || emp.employeeCode.toLowerCase().includes(q)) {
          items.push({ id: `emp-${emp.id}`, label: `${emp.firstName} ${emp.lastName}`, sublabel: emp.employeeCode, icon: User, onSelect: () => navigate(`/employees/${emp.id}`), group: 'Employees' })
        }
        if (items.filter((i) => i.group === 'Employees').length >= 6) break
      }
      for (const dept of departments) {
        if (dept.name.toLowerCase().includes(q)) {
          items.push({ id: `dept-${dept.id}`, label: dept.name, icon: Building2, onSelect: () => navigate(`/departments/${dept.id}`), group: 'Departments' })
        }
      }
    }

    return items.slice(0, 20)
  }, [query, can, navigate])

  if (!open) return null

  const grouped = results.reduce<Record<string, ResultItem[]>>((acc, r) => {
    acc[r.group] = acc[r.group] ?? []
    acc[r.group].push(r)
    return acc
  }, {})

  return createPortal(
    <div className="fixed inset-0 z-[70] flex items-start justify-center px-4 pt-[10vh] sm:pt-[15vh]">
      <div className="absolute inset-0 bg-ink-950/50" onClick={onClose} aria-hidden="true" />
      <div role="dialog" aria-modal="true" aria-label="Command palette" className="relative z-10 flex max-h-[70vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl bg-white shadow-overlay">
        <div className="flex items-center gap-2.5 border-b border-ink-100 px-4 py-3.5">
          <Search size={18} className="text-ink-400" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search employees, departments, or type a command..."
            className="flex-1 bg-transparent text-sm text-ink-900 placeholder:text-ink-400 focus:outline-none"
          />
          <kbd className="hidden rounded border border-ink-200 px-1.5 py-0.5 text-[10px] text-ink-400 sm:block">Esc</kbd>
        </div>
        <div className="scrollbar-thin overflow-y-auto py-2">
          {results.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-ink-400">No results found.</p>
          ) : (
            Object.entries(grouped).map(([group, items]) => (
              <div key={group} className="px-2 py-1.5">
                <p className="px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-ink-400">{group}</p>
                {items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      item.onSelect()
                      onClose()
                    }}
                    className="flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left text-sm text-ink-800 hover:bg-ink-50"
                  >
                    <item.icon size={16} className="shrink-0 text-ink-400" />
                    <span className="min-w-0 flex-1 truncate">{item.label}</span>
                    {item.sublabel && <span className="shrink-0 text-xs text-ink-400">{item.sublabel}</span>}
                    <ArrowRight size={14} className="shrink-0 text-ink-300" />
                  </button>
                ))}
              </div>
            ))
          )}
        </div>
      </div>
    </div>,
    document.body,
  )
}
