import { useMemo, useState, type ReactNode } from 'react'
import { ArrowDown, ArrowUp, ArrowUpDown, Search } from 'lucide-react'
import { Pagination } from './Pagination'
import { EmptyState } from './EmptyState'
import { TableSkeleton } from './Skeleton'
import { Input } from './Input'
import { cn } from '@/lib/utils'

export interface Column<T> {
  key: string
  header: string
  render: (row: T) => ReactNode
  sortValue?: (row: T) => string | number
  className?: string
  hideOnMobile?: boolean
}

interface DataTableProps<T> {
  columns: Column<T>[]
  rows: T[]
  keyField: (row: T) => string
  loading?: boolean
  searchable?: boolean
  searchPlaceholder?: string
  searchFn?: (row: T, query: string) => boolean
  pageSize?: number
  emptyTitle?: string
  emptyDescription?: string
  renderMobileCard?: (row: T) => ReactNode
  rowActions?: (row: T) => ReactNode
  toolbar?: ReactNode
}

export function DataTable<T>({
  columns,
  rows,
  keyField,
  loading,
  searchable = true,
  searchPlaceholder = 'Search...',
  searchFn,
  pageSize = 10,
  emptyTitle = 'No records found',
  emptyDescription,
  renderMobileCard,
  rowActions,
  toolbar,
}: DataTableProps<T>) {
  const [query, setQuery] = useState('')
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    if (!query || !searchFn) return rows
    return rows.filter((r) => searchFn(r, query.toLowerCase()))
  }, [rows, query, searchFn])

  const sorted = useMemo(() => {
    if (!sortKey) return filtered
    const col = columns.find((c) => c.key === sortKey)
    if (!col?.sortValue) return filtered
    const copy = [...filtered].sort((a, b) => {
      const av = col.sortValue!(a)
      const bv = col.sortValue!(b)
      if (av === bv) return 0
      return av > bv ? 1 : -1
    })
    return sortDir === 'desc' ? copy.reverse() : copy
  }, [filtered, sortKey, sortDir, columns])

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const paged = sorted.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  function toggleSort(key: string) {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  return (
    <div>
      {(searchable || toolbar) && (
        <div className="flex flex-col gap-3 border-b border-ink-100 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          {searchable && (
            <div className="max-w-sm flex-1">
              <Input
                icon={<Search size={16} />}
                placeholder={searchPlaceholder}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value)
                  setPage(1)
                }}
                aria-label={searchPlaceholder}
              />
            </div>
          )}
          {toolbar}
        </div>
      )}

      {loading ? (
        <TableSkeleton cols={columns.length} />
      ) : sorted.length === 0 ? (
        <EmptyState title={emptyTitle} description={emptyDescription} />
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden overflow-x-auto sm:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-ink-100 bg-ink-50/60 text-left text-xs font-medium uppercase tracking-wide text-ink-500">
                  {columns.map((col) => (
                    <th key={col.key} className={cn('whitespace-nowrap px-4 py-2.5', col.className)}>
                      {col.sortValue ? (
                        <button className="inline-flex items-center gap-1 hover:text-ink-800" onClick={() => toggleSort(col.key)}>
                          {col.header}
                          {sortKey === col.key ? (sortDir === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />) : <ArrowUpDown size={12} className="text-ink-300" />}
                        </button>
                      ) : (
                        col.header
                      )}
                    </th>
                  ))}
                  {rowActions && <th className="px-4 py-2.5" />}
                </tr>
              </thead>
              <tbody>
                {paged.map((row) => (
                  <tr key={keyField(row)} className="border-b border-ink-50 last:border-0 hover:bg-ink-50/50">
                    {columns.map((col) => (
                      <td key={col.key} className={cn('px-4 py-3 align-middle', col.className)}>
                        {col.render(row)}
                      </td>
                    ))}
                    {rowActions && <td className="px-4 py-3 text-right">{rowActions(row)}</td>}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="divide-y divide-ink-100 sm:hidden">
            {paged.map((row) =>
              renderMobileCard ? (
                <div key={keyField(row)} className="p-4">
                  {renderMobileCard(row)}
                </div>
              ) : (
                <div key={keyField(row)} className="space-y-1.5 p-4">
                  {columns.filter((c) => !c.hideOnMobile).map((col) => (
                    <div key={col.key} className="flex items-center justify-between gap-3 text-sm">
                      <span className="text-xs font-medium text-ink-500">{col.header}</span>
                      <span className="text-right text-ink-800">{col.render(row)}</span>
                    </div>
                  ))}
                  {rowActions && <div className="pt-1.5 text-right">{rowActions(row)}</div>}
                </div>
              ),
            )}
          </div>

          <Pagination page={currentPage} totalPages={totalPages} total={sorted.length} pageSize={pageSize} onPageChange={setPage} />
        </>
      )}
    </div>
  )
}
