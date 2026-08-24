import { useState, type ReactNode } from 'react'
import { SlidersHorizontal, X } from 'lucide-react'
import { Button } from './Button'
import { Drawer } from './Drawer'

export function FilterBar({ children, onClear, activeCount = 0 }: { children: ReactNode; onClear?: () => void; activeCount?: number }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  return (
    <>
      {/* Desktop inline filters */}
      <div className="hidden flex-wrap items-center gap-2 lg:flex">
        {children}
        {activeCount > 0 && onClear && (
          <Button variant="ghost" size="sm" onClick={onClear}>
            <X size={14} /> Clear
          </Button>
        )}
      </div>
      {/* Mobile filter button + drawer */}
      <div className="lg:hidden">
        <Button variant="outline" size="sm" onClick={() => setMobileOpen(true)}>
          <SlidersHorizontal size={14} /> Filters {activeCount > 0 && `(${activeCount})`}
        </Button>
        <Drawer open={mobileOpen} onClose={() => setMobileOpen(false)} title="Filters">
          <div className="flex flex-col gap-4">{children}</div>
          <div className="mt-6 flex gap-2">
            <Button className="flex-1" onClick={() => setMobileOpen(false)}>Apply</Button>
            {onClear && <Button variant="outline" onClick={onClear}>Clear</Button>}
          </div>
        </Drawer>
      </div>
    </>
  )
}
