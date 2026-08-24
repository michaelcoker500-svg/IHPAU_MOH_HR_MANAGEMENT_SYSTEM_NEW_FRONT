/** Simulates network latency so loading states are real and visible. */
export function delay<T>(value: T, ms = 350): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms))
}

export function paginate<T>(items: T[], page: number, pageSize: number) {
  const start = (page - 1) * pageSize
  const pageItems = items.slice(start, start + pageSize)
  return {
    items: pageItems,
    total: items.length,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(items.length / pageSize)),
  }
}

export function sortBy<T>(items: T[], key: keyof T | ((item: T) => any), direction: 'asc' | 'desc'): T[] {
  const getter = typeof key === 'function' ? key : (item: T) => item[key]
  const sorted = [...items].sort((a, b) => {
    const av = getter(a)
    const bv = getter(b)
    if (av === bv) return 0
    return av > bv ? 1 : -1
  })
  return direction === 'desc' ? sorted.reverse() : sorted
}
