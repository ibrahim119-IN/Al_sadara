'use client'

import { useState, useMemo, useCallback } from 'react'
import {
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  ChevronLeft,
  ChevronRight,
  Search,
  Download,
  Filter,
  X,
  Check,
  MoreHorizontal,
} from 'lucide-react'
import { cn } from '@/lib/utils/cn'

// Column definition
export interface Column<T> {
  key: string
  header: string
  sortable?: boolean
  width?: string
  render?: (row: T, index: number) => React.ReactNode
  className?: string
}

// Sort state
export interface SortState {
  key: string
  direction: 'asc' | 'desc'
}

// Filter option
export interface FilterOption {
  label: string
  value: string
}

// Filter config
export interface FilterConfig {
  key: string
  label: string
  options: FilterOption[]
}

// DataTable props
export interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  // Pagination
  pageSize?: number
  currentPage?: number
  totalItems?: number
  onPageChange?: (page: number) => void
  pageSizeOptions?: number[]
  onPageSizeChange?: (size: number) => void
  // Sorting
  sortable?: boolean
  defaultSort?: SortState
  onSort?: (sort: SortState | null) => void
  // Selection
  selectable?: boolean
  selectedRows?: T[]
  onSelectionChange?: (rows: T[]) => void
  rowKey?: keyof T | ((row: T) => string | number)
  // Search
  searchable?: boolean
  searchPlaceholder?: string
  onSearch?: (query: string) => void
  // Filters
  filters?: FilterConfig[]
  activeFilters?: Record<string, string[]>
  onFilterChange?: (filters: Record<string, string[]>) => void
  // Actions
  bulkActions?: React.ReactNode
  rowActions?: (row: T) => React.ReactNode
  // Export
  exportable?: boolean
  onExport?: (format: 'csv' | 'excel') => void
  // Styling
  className?: string
  loading?: boolean
  emptyMessage?: string
  // Localization
  dictionary?: {
    search: string
    noData: string
    showing: string
    of: string
    entries: string
    page: string
    rowsPerPage: string
    selected: string
    export: string
    filters: string
    clearFilters: string
    apply: string
  }
}

// Default dictionary
const defaultDictionary = {
  search: 'Search...',
  noData: 'No data available',
  showing: 'Showing',
  of: 'of',
  entries: 'entries',
  page: 'Page',
  rowsPerPage: 'Rows per page',
  selected: 'selected',
  export: 'Export',
  filters: 'Filters',
  clearFilters: 'Clear filters',
  apply: 'Apply',
}

export function DataTable<T extends Record<string, unknown>>({
  data,
  columns,
  pageSize = 10,
  currentPage = 1,
  totalItems,
  onPageChange,
  pageSizeOptions = [10, 25, 50, 100],
  onPageSizeChange,
  sortable = true,
  defaultSort,
  onSort,
  selectable = false,
  selectedRows = [],
  onSelectionChange,
  rowKey = 'id' as keyof T,
  searchable = true,
  searchPlaceholder,
  onSearch,
  filters = [],
  activeFilters = {},
  onFilterChange,
  bulkActions,
  rowActions,
  exportable = false,
  onExport,
  className,
  loading = false,
  emptyMessage,
  dictionary = defaultDictionary,
}: DataTableProps<T>) {
  const t = { ...defaultDictionary, ...dictionary }

  // Local state
  const [localSearchQuery, setLocalSearchQuery] = useState('')
  const [localSort, setLocalSort] = useState<SortState | null>(defaultSort || null)
  const [showFilters, setShowFilters] = useState(false)
  const [localFilters, setLocalFilters] = useState<Record<string, string[]>>(activeFilters)

  // Get row key value
  const getRowKey = useCallback(
    (row: T): string | number => {
      if (typeof rowKey === 'function') {
        return rowKey(row)
      }
      return row[rowKey] as string | number
    },
    [rowKey]
  )

  // Check if row is selected
  const isRowSelected = useCallback(
    (row: T): boolean => {
      const key = getRowKey(row)
      return selectedRows.some((r) => getRowKey(r) === key)
    },
    [selectedRows, getRowKey]
  )

  // Handle row selection
  const handleRowSelect = useCallback(
    (row: T) => {
      if (!onSelectionChange) return

      const key = getRowKey(row)
      const isSelected = isRowSelected(row)

      if (isSelected) {
        onSelectionChange(selectedRows.filter((r) => getRowKey(r) !== key))
      } else {
        onSelectionChange([...selectedRows, row])
      }
    },
    [selectedRows, onSelectionChange, getRowKey, isRowSelected]
  )

  // Handle select all
  const handleSelectAll = useCallback(() => {
    if (!onSelectionChange) return

    const allSelected = data.every((row) => isRowSelected(row))

    if (allSelected) {
      // Deselect all visible rows
      const visibleKeys = new Set(data.map(getRowKey))
      onSelectionChange(selectedRows.filter((r) => !visibleKeys.has(getRowKey(r))))
    } else {
      // Select all visible rows
      const newSelection = [...selectedRows]
      data.forEach((row) => {
        if (!isRowSelected(row)) {
          newSelection.push(row)
        }
      })
      onSelectionChange(newSelection)
    }
  }, [data, selectedRows, onSelectionChange, getRowKey, isRowSelected])

  // Handle sort
  const handleSort = useCallback(
    (key: string) => {
      let newSort: SortState | null

      if (localSort?.key === key) {
        if (localSort.direction === 'asc') {
          newSort = { key, direction: 'desc' }
        } else {
          newSort = null
        }
      } else {
        newSort = { key, direction: 'asc' }
      }

      setLocalSort(newSort)
      onSort?.(newSort)
    },
    [localSort, onSort]
  )

  // Handle search
  const handleSearch = useCallback(
    (query: string) => {
      setLocalSearchQuery(query)
      onSearch?.(query)
    },
    [onSearch]
  )

  // Handle filter change
  const handleFilterChange = useCallback(
    (key: string, value: string) => {
      setLocalFilters((prev) => {
        const current = prev[key] || []
        const updated = current.includes(value)
          ? current.filter((v) => v !== value)
          : [...current, value]

        return {
          ...prev,
          [key]: updated,
        }
      })
    },
    []
  )

  // Apply filters
  const applyFilters = useCallback(() => {
    onFilterChange?.(localFilters)
    setShowFilters(false)
  }, [localFilters, onFilterChange])

  // Clear filters
  const clearFilters = useCallback(() => {
    setLocalFilters({})
    onFilterChange?.({})
    setShowFilters(false)
  }, [onFilterChange])

  // Calculate pagination
  const total = totalItems ?? data.length
  const totalPages = Math.ceil(total / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = Math.min(startIndex + pageSize, total)

  // Sorted data (for client-side sorting)
  const sortedData = useMemo(() => {
    if (!localSort || onSort) return data

    return [...data].sort((a, b) => {
      const aValue = a[localSort.key]
      const bValue = b[localSort.key]

      if (aValue === bValue) return 0
      if (aValue === null || aValue === undefined) return 1
      if (bValue === null || bValue === undefined) return -1

      const comparison = aValue < bValue ? -1 : 1
      return localSort.direction === 'asc' ? comparison : -comparison
    })
  }, [data, localSort, onSort])

  // All visible rows selected
  const allSelected = data.length > 0 && data.every((row) => isRowSelected(row))
  const someSelected = selectedRows.length > 0 && !allSelected

  // Render sort icon
  const renderSortIcon = (key: string) => {
    if (localSort?.key !== key) {
      return <ChevronsUpDown className="w-4 h-4 text-secondary-400" />
    }
    return localSort.direction === 'asc' ? (
      <ChevronUp className="w-4 h-4 text-primary-600" />
    ) : (
      <ChevronDown className="w-4 h-4 text-primary-600" />
    )
  }

  return (
    <div className={cn('bg-white dark:bg-secondary-800 rounded-xl border border-secondary-200 dark:border-secondary-700', className)}>
      {/* Header */}
      <div className="p-4 border-b border-secondary-200 dark:border-secondary-700">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Search */}
          {searchable && (
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400" />
              <input
                type="text"
                value={localSearchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder={searchPlaceholder || t.search}
                className="w-full ps-10 pe-4 py-2 bg-secondary-50 dark:bg-secondary-900 border border-secondary-200 dark:border-secondary-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Bulk Actions */}
            {selectable && selectedRows.length > 0 && bulkActions && (
              <div className="flex items-center gap-2 pe-2 border-e border-secondary-200 dark:border-secondary-700">
                <span className="text-sm text-secondary-600 dark:text-secondary-400">
                  {selectedRows.length} {t.selected}
                </span>
                {bulkActions}
              </div>
            )}

            {/* Filters */}
            {filters.length > 0 && (
              <div className="relative">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 text-sm rounded-lg border transition-colors',
                    Object.values(localFilters).some((v) => v.length > 0)
                      ? 'border-primary-500 text-primary-600 bg-primary-50 dark:bg-primary-900/30'
                      : 'border-secondary-200 dark:border-secondary-600 text-secondary-700 dark:text-secondary-300 hover:bg-secondary-50 dark:hover:bg-secondary-700'
                  )}
                >
                  <Filter className="w-4 h-4" />
                  <span>{t.filters}</span>
                </button>

                {/* Filters dropdown */}
                {showFilters && (
                  <div className="absolute end-0 mt-2 w-72 bg-white dark:bg-secondary-800 rounded-xl shadow-lg border border-secondary-200 dark:border-secondary-700 z-10">
                    <div className="p-4 space-y-4">
                      {filters.map((filter) => (
                        <div key={filter.key}>
                          <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                            {filter.label}
                          </label>
                          <div className="space-y-1">
                            {filter.options.map((option) => (
                              <label
                                key={option.value}
                                className="flex items-center gap-2 p-2 rounded-lg hover:bg-secondary-50 dark:hover:bg-secondary-700 cursor-pointer"
                              >
                                <div
                                  className={cn(
                                    'w-4 h-4 rounded border flex items-center justify-center',
                                    (localFilters[filter.key] || []).includes(option.value)
                                      ? 'bg-primary-600 border-primary-600'
                                      : 'border-secondary-300 dark:border-secondary-600'
                                  )}
                                >
                                  {(localFilters[filter.key] || []).includes(option.value) && (
                                    <Check className="w-3 h-3 text-white" />
                                  )}
                                </div>
                                <span className="text-sm text-secondary-700 dark:text-secondary-300">
                                  {option.label}
                                </span>
                              </label>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-between p-3 border-t border-secondary-200 dark:border-secondary-700">
                      <button
                        onClick={clearFilters}
                        className="text-sm text-secondary-600 dark:text-secondary-400 hover:text-secondary-900 dark:hover:text-white"
                      >
                        {t.clearFilters}
                      </button>
                      <button
                        onClick={applyFilters}
                        className="px-4 py-1.5 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                      >
                        {t.apply}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Export */}
            {exportable && onExport && (
              <div className="relative group">
                <button className="flex items-center gap-2 px-3 py-2 text-sm border border-secondary-200 dark:border-secondary-600 text-secondary-700 dark:text-secondary-300 rounded-lg hover:bg-secondary-50 dark:hover:bg-secondary-700">
                  <Download className="w-4 h-4" />
                  <span>{t.export}</span>
                </button>
                <div className="absolute end-0 mt-1 w-32 bg-white dark:bg-secondary-800 rounded-lg shadow-lg border border-secondary-200 dark:border-secondary-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                  <button
                    onClick={() => onExport('csv')}
                    className="block w-full px-4 py-2 text-start text-sm text-secondary-700 dark:text-secondary-300 hover:bg-secondary-50 dark:hover:bg-secondary-700"
                  >
                    CSV
                  </button>
                  <button
                    onClick={() => onExport('excel')}
                    className="block w-full px-4 py-2 text-start text-sm text-secondary-700 dark:text-secondary-300 hover:bg-secondary-50 dark:hover:bg-secondary-700"
                  >
                    Excel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-secondary-50 dark:bg-secondary-900/50">
              {/* Selection checkbox */}
              {selectable && (
                <th className="w-12 px-4 py-3">
                  <button
                    onClick={handleSelectAll}
                    className={cn(
                      'w-5 h-5 rounded border flex items-center justify-center',
                      allSelected
                        ? 'bg-primary-600 border-primary-600'
                        : someSelected
                          ? 'bg-primary-300 border-primary-300'
                          : 'border-secondary-300 dark:border-secondary-600'
                    )}
                  >
                    {(allSelected || someSelected) && <Check className="w-3 h-3 text-white" />}
                  </button>
                </th>
              )}

              {/* Column headers */}
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={cn(
                    'px-4 py-3 text-start text-xs font-semibold text-secondary-600 dark:text-secondary-400 uppercase tracking-wider',
                    column.className
                  )}
                  style={{ width: column.width }}
                >
                  {sortable && column.sortable !== false ? (
                    <button
                      onClick={() => handleSort(column.key)}
                      className="flex items-center gap-1 hover:text-secondary-900 dark:hover:text-white"
                    >
                      <span>{column.header}</span>
                      {renderSortIcon(column.key)}
                    </button>
                  ) : (
                    column.header
                  )}
                </th>
              ))}

              {/* Actions column */}
              {rowActions && <th className="w-12 px-4 py-3"></th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-secondary-200 dark:divide-secondary-700">
            {loading ? (
              // Loading skeleton
              Array.from({ length: pageSize }).map((_, i) => (
                <tr key={i}>
                  {selectable && (
                    <td className="px-4 py-4">
                      <div className="w-5 h-5 bg-secondary-200 dark:bg-secondary-700 rounded animate-pulse" />
                    </td>
                  )}
                  {columns.map((column) => (
                    <td key={column.key} className="px-4 py-4">
                      <div className="h-4 bg-secondary-200 dark:bg-secondary-700 rounded animate-pulse" />
                    </td>
                  ))}
                  {rowActions && (
                    <td className="px-4 py-4">
                      <div className="w-8 h-8 bg-secondary-200 dark:bg-secondary-700 rounded animate-pulse" />
                    </td>
                  )}
                </tr>
              ))
            ) : sortedData.length === 0 ? (
              // Empty state
              <tr>
                <td
                  colSpan={columns.length + (selectable ? 1 : 0) + (rowActions ? 1 : 0)}
                  className="px-4 py-12 text-center text-secondary-500 dark:text-secondary-400"
                >
                  {emptyMessage || t.noData}
                </td>
              </tr>
            ) : (
              // Data rows
              sortedData.map((row, index) => (
                <tr
                  key={getRowKey(row)}
                  className={cn(
                    'hover:bg-secondary-50 dark:hover:bg-secondary-900/50 transition-colors',
                    isRowSelected(row) && 'bg-primary-50 dark:bg-primary-900/20'
                  )}
                >
                  {/* Selection checkbox */}
                  {selectable && (
                    <td className="px-4 py-4">
                      <button
                        onClick={() => handleRowSelect(row)}
                        className={cn(
                          'w-5 h-5 rounded border flex items-center justify-center',
                          isRowSelected(row)
                            ? 'bg-primary-600 border-primary-600'
                            : 'border-secondary-300 dark:border-secondary-600'
                        )}
                      >
                        {isRowSelected(row) && <Check className="w-3 h-3 text-white" />}
                      </button>
                    </td>
                  )}

                  {/* Data cells */}
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={cn(
                        'px-4 py-4 text-sm text-secondary-900 dark:text-white',
                        column.className
                      )}
                    >
                      {column.render
                        ? column.render(row, index)
                        : (row[column.key] as React.ReactNode)}
                    </td>
                  ))}

                  {/* Row actions */}
                  {rowActions && (
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end">
                        {rowActions(row)}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-secondary-200 dark:border-secondary-700">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Info */}
          <div className="text-sm text-secondary-600 dark:text-secondary-400">
            {t.showing} {startIndex + 1}-{endIndex} {t.of} {total} {t.entries}
          </div>

          {/* Pagination controls */}
          <div className="flex items-center gap-4">
            {/* Page size selector */}
            {onPageSizeChange && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-secondary-600 dark:text-secondary-400">
                  {t.rowsPerPage}
                </span>
                <select
                  value={pageSize}
                  onChange={(e) => onPageSizeChange(Number(e.target.value))}
                  className="px-2 py-1 text-sm border border-secondary-200 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {pageSizeOptions.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Page navigation */}
            {onPageChange && totalPages > 1 && (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onPageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
                </button>

                {/* Page numbers */}
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum: number
                  if (totalPages <= 5) {
                    pageNum = i + 1
                  } else if (currentPage <= 3) {
                    pageNum = i + 1
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i
                  } else {
                    pageNum = currentPage - 2 + i
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => onPageChange(pageNum)}
                      className={cn(
                        'w-8 h-8 text-sm rounded-lg',
                        currentPage === pageNum
                          ? 'bg-primary-600 text-white'
                          : 'hover:bg-secondary-100 dark:hover:bg-secondary-700 text-secondary-700 dark:text-secondary-300'
                      )}
                    >
                      {pageNum}
                    </button>
                  )
                })}

                <button
                  onClick={() => onPageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4 rtl:rotate-180" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DataTable
