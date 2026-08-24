import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Menu, Search, ChevronDown, LogOut, UserCircle, Settings as SettingsIcon, Building2 } from 'lucide-react'
import { useAuth } from '@/app/auth-context'
import { Avatar } from '@/components/ui/Avatar'
import { Dropdown } from '@/components/ui/Dropdown'
import { Badge } from '@/components/ui/Badge'
import { NotificationBell } from './NotificationPanel'
import { CommandPalette } from './CommandPalette'

export function Topbar({ onOpenMobileMenu }: { onOpenMobileMenu: () => void }) {
  const { user, organization, logout } = useAuth()
  const navigate = useNavigate()
  const [paletteOpen, setPaletteOpen] = useState(false)

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setPaletteOpen(true)
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  if (!user) return null

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-2 border-b border-ink-200 bg-white/90 px-3 backdrop-blur sm:gap-4 sm:px-5">
      <button onClick={onOpenMobileMenu} className="flex h-10 w-10 items-center justify-center rounded-lg text-ink-600 hover:bg-ink-100 lg:hidden" aria-label="Open menu">
        <Menu size={20} />
      </button>

      {/* Mobile brand (compact) */}
      <div className="flex items-center gap-2 lg:hidden">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-brand-700 text-accent-400">
          <Building2 size={16} />
        </div>
      </div>

      {/* Search trigger */}
      <button
        onClick={() => setPaletteOpen(true)}
        className="hidden flex-1 items-center gap-2.5 rounded-lg border border-ink-200 bg-ink-50 px-3.5 py-2 text-sm text-ink-400 hover:border-ink-300 sm:flex sm:max-w-md"
      >
        <Search size={16} />
        <span className="flex-1 text-left">Search employees, departments...</span>
        <kbd className="rounded border border-ink-200 bg-white px-1.5 py-0.5 text-[10px] text-ink-400">Ctrl K</kbd>
      </button>
      <button onClick={() => setPaletteOpen(true)} className="flex h-10 w-10 items-center justify-center rounded-lg text-ink-600 hover:bg-ink-100 sm:hidden" aria-label="Search">
        <Search size={19} />
      </button>

      <div className="ml-auto flex items-center gap-1 sm:gap-2">
        <Badge tone="warning" className="hidden md:inline-flex">DEMO MODE</Badge>

        <Dropdown
          align="right"
          trigger={
            <button className="hidden items-center gap-2 rounded-lg border border-ink-200 px-3 py-2 text-sm font-medium text-ink-700 hover:bg-ink-50 md:flex">
              <Building2 size={15} className="text-ink-400" />
              <span className="max-w-[10rem] truncate">{organization.shortName}</span>
              <ChevronDown size={14} className="text-ink-400" />
            </button>
          }
          items={[{ label: `${organization.name} (current)` }, 'divider', { label: 'Only one organization available in demo' }]}
        />

        <NotificationBell />

        <Dropdown
          align="right"
          trigger={
            <button className="flex items-center gap-2 rounded-lg py-1.5 pl-1.5 pr-2 hover:bg-ink-100">
              <Avatar name={user.avatarInitials} size="sm" />
              <span className="hidden text-left leading-tight sm:block">
                <span className="block text-sm font-medium text-ink-900">{user.name.split(' ')[0]}</span>
                <span className="block text-[11px] text-ink-500">{user.roleLabel}</span>
              </span>
              <ChevronDown size={14} className="hidden text-ink-400 sm:block" />
            </button>
          }
          items={[
            { label: 'My Profile', icon: <UserCircle size={15} />, onClick: () => navigate('/profile') },
            { label: 'Settings', icon: <SettingsIcon size={15} />, onClick: () => navigate('/settings') },
            { label: 'Switch Role (Demo)', icon: <Building2 size={15} />, onClick: () => { logout(); navigate('/login') } },
            'divider',
            { label: 'Sign Out', icon: <LogOut size={15} />, danger: true, onClick: () => { logout(); navigate('/login') } },
          ]}
        />
      </div>

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </header>
  )
}
