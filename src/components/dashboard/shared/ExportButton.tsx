'use client'

import { useState, useRef, useEffect } from 'react'
import { Download, FileSpreadsheet, FileText, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

export type ExportFormat = 'csv' | 'excel' | 'pdf'

export interface ExportButtonProps {
  onExport: (format: ExportFormat) => Promise<void> | void
  formats?: ExportFormat[]
  disabled?: boolean
  loading?: boolean
  className?: string
  dictionary?: {
    export: string
    csv: string
    excel: string
    pdf: string
  }
}

const defaultDictionary = {
  export: 'Export',
  csv: 'CSV',
  excel: 'Excel',
  pdf: 'PDF',
}

const formatIcons = {
  csv: FileText,
  excel: FileSpreadsheet,
  pdf: FileText,
}

export function ExportButton({
  onExport,
  formats = ['csv', 'excel'],
  disabled = false,
  loading = false,
  className,
  dictionary = defaultDictionary,
}: ExportButtonProps) {
  const t = { ...defaultDictionary, ...dictionary }
  const [isOpen, setIsOpen] = useState(false)
  const [exportingFormat, setExportingFormat] = useState<ExportFormat | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleExport = async (format: ExportFormat) => {
    setExportingFormat(format)
    try {
      await onExport(format)
    } finally {
      setExportingFormat(null)
      setIsOpen(false)
    }
  }

  // If only one format, export directly
  if (formats.length === 1) {
    const format = formats[0]
    const Icon = formatIcons[format]

    return (
      <button
        onClick={() => handleExport(format)}
        disabled={disabled || loading || !!exportingFormat}
        className={cn(
          'flex items-center gap-2 px-4 py-2 text-sm border border-secondary-200 dark:border-secondary-600 rounded-lg',
          'text-secondary-700 dark:text-secondary-300',
          'hover:bg-secondary-50 dark:hover:bg-secondary-700',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'transition-colors',
          className
        )}
      >
        {(loading || exportingFormat === format) ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Icon className="w-4 h-4" />
        )}
        <span>{t[format]}</span>
      </button>
    )
  }

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled || loading}
        className={cn(
          'flex items-center gap-2 px-4 py-2 text-sm border border-secondary-200 dark:border-secondary-600 rounded-lg',
          'text-secondary-700 dark:text-secondary-300',
          'hover:bg-secondary-50 dark:hover:bg-secondary-700',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'transition-colors'
        )}
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Download className="w-4 h-4" />
        )}
        <span>{t.export}</span>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute end-0 mt-1 w-36 bg-white dark:bg-secondary-800 rounded-lg shadow-lg border border-secondary-200 dark:border-secondary-700 overflow-hidden z-10">
          {formats.map((format) => {
            const Icon = formatIcons[format]
            const isExporting = exportingFormat === format

            return (
              <button
                key={format}
                onClick={() => handleExport(format)}
                disabled={!!exportingFormat}
                className={cn(
                  'flex items-center gap-2 w-full px-4 py-2.5 text-sm text-secondary-700 dark:text-secondary-300',
                  'hover:bg-secondary-50 dark:hover:bg-secondary-700',
                  'disabled:opacity-50 disabled:cursor-not-allowed',
                  'transition-colors'
                )}
              >
                {isExporting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Icon className="w-4 h-4" />
                )}
                <span>{t[format]}</span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default ExportButton
