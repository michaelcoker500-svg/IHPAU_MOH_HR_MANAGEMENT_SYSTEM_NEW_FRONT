import { NavLink } from 'react-router-dom'
import { X, ChevronsLeft, ChevronsRight, Building2 } from 'lucide-react'
import { NAV_GROUPS } from '@/app/nav-config'
import { useAuth } from '@/app/auth-context'
import { cn } from '@/lib/utils'

interface SidebarProps {
  collapsed: boolean
  onToggleCollapse: () => void
  mobileOpen: boolean
  onCloseMobile: () => void
}

export function Sidebar({ collapsed, onToggleCollapse, mobileOpen, onCloseMobile }: SidebarProps) {
  const { can, organization } = useAuth()

  const content = (
    <>
      <div className={cn('flex h-16 items-center gap-2.5 border-b border-white/10 px-4', collapsed && 'justify-center px-2')}>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent-500 text-brand-950">
          <Building2 size={18} />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">IHPAU HR Cloud</p>
            <p className="truncate text-[11px] text-brand-200">{organization.shortName}</p>
          </div>
        )}
        <button onClick={onCloseMobile} className="ml-auto flex h-8 w-8 items-center justify-center rounded-lg text-brand-200 hover:bg-white/10 lg:hidden" aria-label="Close menu">
          <X size={18} />
        </button>
      </div>

      <nav className="scrollbar-thin flex-1 overflow-y-auto px-2.5 py-3">
        {NAV_GROUPS.map((group, gi) => {
          const items = group.items.filter((item) => !item.requires || can(item.requires))
          if (items.length === 0) return null
          return (
            <div key={gi} className="mb-4">
              {group.label && !collapsed && (
                <p className="mb-1.5 px-2.5 text-[10px] font-semibold uppercase tracking-wider text-brand-300/80">{group.label}</p>
              )}
              <div className="space-y-0.5">
                {items.map((item) => (
                  <NavLink
                    key={item.href}
                    to={item.href}
                    onClick={onCloseMobile}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors',
                        collapsed && 'justify-center px-0',
                        isActive ? 'bg-white/10 text-white' : 'text-brand-100 hover:bg-white/5 hover:text-white',
                      )
                    }
                    title={collapsed ? item.label : undefined}
                  >
                    <item.icon size={18} className="shrink-0" />
                    {!collapsed && <span className="truncate">{item.label}</span>}
                  </NavLink>
                ))}
              </div>
            </div>
          )
        })}
      </nav>

      <div className="hidden border-t border-white/10 p-2.5 lg:block">
        <button
          onClick={onToggleCollapse}
          className="flex w-full items-center justify-center gap-2 rounded-lg py-2 text-xs font-medium text-brand-200 hover:bg-white/5 hover:text-white"
        >
          {collapsed ? <ChevronsRight size={16} /> : <><ChevronsLeft size={16} /> Collapse</>}
        </button>
      </div>
    </>
  )

  return (
    <>
      {/* Desktop / tablet persistent sidebar */}
      <aside className={cn('hidden shrink-0 flex-col bg-brand-900 transition-all duration-200 lg:flex', collapsed ? 'w-[76px]' : 'w-64')}>
        {content}
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="absolute inset-0 bg-ink-950/50" onClick={onCloseMobile} aria-hidden="true" />
          <aside role="dialog" aria-modal="true" aria-label="Navigation menu" className="relative z-10 flex h-full w-72 max-w-[85vw] flex-col bg-brand-900 shadow-overlay animate-in slide-in-from-left">
            {content}
          </aside>
        </div>
      )}
    </>
  )
}
