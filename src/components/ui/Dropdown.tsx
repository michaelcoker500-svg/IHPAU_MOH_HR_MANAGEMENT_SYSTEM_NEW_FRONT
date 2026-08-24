import { useEffect, useRef, useState, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface DropdownItem {
  label: string
  onClick?: () => void
  icon?: ReactNode
  danger?: boolean
  href?: string
}

export function Dropdown({ trigger, items, align = 'right' }: { trigger: ReactNode; items: (DropdownItem | 'divider')[]; align?: 'left' | 'right' }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [])

  return (
    <div className="relative inline-block" ref={ref}>
      <div onClick={() => setOpen((o) => !o)}>{trigger}</div>
      {open && (
        <div
          role="menu"
          className={cn(
            'absolute z-40 mt-2 min-w-[12rem] max-w-[90vw] overflow-hidden rounded-lg border border-ink-200 bg-white py-1 shadow-elevated',
            align === 'right' ? 'right-0' : 'left-0',
          )}
        >
          {items.map((item, i) =>
            item === 'divider' ? (
              <div key={i} className="my-1 h-px bg-ink-100" />
            ) : (
              <button
                key={item.label}
                role="menuitem"
                onClick={() => {
                  item.onClick?.()
                  setOpen(false)
                }}
                className={cn(
                  'flex w-full items-center gap-2 px-3.5 py-2 text-left text-sm hover:bg-ink-50',
                  item.danger ? 'text-danger-600' : 'text-ink-700',
                )}
              >
                {item.icon}
                {item.label}
              </button>
            ),
          )}
        </div>
      )}
    </div>
  )
}
