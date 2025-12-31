'use client'

import { useState, useRef, useEffect } from 'react'
import { Calendar, ChevronLeft, ChevronRight, X } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

export interface DateRange {
  start: Date | null
  end: Date | null
}

export interface DateRangePickerProps {
  value?: DateRange
  onChange?: (range: DateRange) => void
  placeholder?: string
  className?: string
  // Presets
  presets?: {
    label: string
    getValue: () => DateRange
  }[]
  // Localization
  dictionary?: {
    today: string
    yesterday: string
    last7Days: string
    last30Days: string
    thisMonth: string
    lastMonth: string
    custom: string
    apply: string
    cancel: string
    startDate: string
    endDate: string
  }
  // Constraints
  minDate?: Date
  maxDate?: Date
  // Format
  dateFormat?: string
  locale?: string
}

// Default dictionary
const defaultDictionary = {
  today: 'Today',
  yesterday: 'Yesterday',
  last7Days: 'Last 7 days',
  last30Days: 'Last 30 days',
  thisMonth: 'This month',
  lastMonth: 'Last month',
  custom: 'Custom',
  apply: 'Apply',
  cancel: 'Cancel',
  startDate: 'Start date',
  endDate: 'End date',
}

// Default presets
const getDefaultPresets = (t: typeof defaultDictionary) => [
  {
    label: t.today,
    getValue: () => {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const end = new Date(today)
      end.setHours(23, 59, 59, 999)
      return { start: today, end }
    },
  },
  {
    label: t.yesterday,
    getValue: () => {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      yesterday.setHours(0, 0, 0, 0)
      const end = new Date(yesterday)
      end.setHours(23, 59, 59, 999)
      return { start: yesterday, end }
    },
  },
  {
    label: t.last7Days,
    getValue: () => {
      const end = new Date()
      end.setHours(23, 59, 59, 999)
      const start = new Date()
      start.setDate(start.getDate() - 6)
      start.setHours(0, 0, 0, 0)
      return { start, end }
    },
  },
  {
    label: t.last30Days,
    getValue: () => {
      const end = new Date()
      end.setHours(23, 59, 59, 999)
      const start = new Date()
      start.setDate(start.getDate() - 29)
      start.setHours(0, 0, 0, 0)
      return { start, end }
    },
  },
  {
    label: t.thisMonth,
    getValue: () => {
      const now = new Date()
      const start = new Date(now.getFullYear(), now.getMonth(), 1)
      const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999)
      return { start, end }
    },
  },
  {
    label: t.lastMonth,
    getValue: () => {
      const now = new Date()
      const start = new Date(now.getFullYear(), now.getMonth() - 1, 1)
      const end = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999)
      return { start, end }
    },
  },
]

// Month names (English)
const monthNamesEn = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

// Month names (Arabic)
const monthNamesAr = [
  'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
  'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر',
]

// Day names (English)
const dayNamesEn = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

// Day names (Arabic)
const dayNamesAr = ['أحد', 'إثن', 'ثلا', 'أرب', 'خمي', 'جمع', 'سبت']

// Get localized names
const getMonthNames = (locale: string) => locale === 'ar' ? monthNamesAr : monthNamesEn
const getDayNames = (locale: string) => locale === 'ar' ? dayNamesAr : dayNamesEn

export function DateRangePicker({
  value,
  onChange,
  placeholder = 'Select date range',
  className,
  presets,
  dictionary = defaultDictionary,
  minDate,
  maxDate,
  locale = 'en',
}: DateRangePickerProps) {
  const t = { ...defaultDictionary, ...dictionary }
  const [isOpen, setIsOpen] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [hoverDate, setHoverDate] = useState<Date | null>(null)
  const [selecting, setSelecting] = useState<'start' | 'end'>('start')
  const [tempRange, setTempRange] = useState<DateRange>({
    start: value?.start || null,
    end: value?.end || null,
  })
  const containerRef = useRef<HTMLDivElement>(null)

  const effectivePresets = presets || getDefaultPresets(t)
  const monthNames = getMonthNames(locale)
  const dayNames = getDayNames(locale)

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

  // Format date
  const formatDate = (date: Date | null): string => {
    if (!date) return ''
    return date.toLocaleDateString(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  // Get display value
  const displayValue = (): string => {
    if (!value?.start && !value?.end) return placeholder
    if (value.start && value.end) {
      return `${formatDate(value.start)} - ${formatDate(value.end)}`
    }
    if (value.start) return formatDate(value.start)
    return placeholder
  }

  // Get days in month
  const getDaysInMonth = (date: Date): Date[] => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const days: Date[] = []

    // Add days from previous month
    const firstDayOfWeek = firstDay.getDay()
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const d = new Date(year, month, -i)
      days.push(d)
    }

    // Add days of current month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i))
    }

    // Add days from next month to complete the grid
    const remainingDays = 42 - days.length
    for (let i = 1; i <= remainingDays; i++) {
      days.push(new Date(year, month + 1, i))
    }

    return days
  }

  // Check if date is in current month
  const isCurrentMonth = (date: Date): boolean => {
    return date.getMonth() === currentMonth.getMonth()
  }

  // Check if date is selected
  const isSelected = (date: Date): boolean => {
    if (!tempRange.start) return false
    const d = date.getTime()
    const start = tempRange.start.getTime()
    const end = tempRange.end?.getTime()

    return d === start || (end !== undefined && d === end)
  }

  // Check if date is in range
  const isInRange = (date: Date): boolean => {
    if (!tempRange.start) return false

    const d = date.getTime()
    const start = tempRange.start.getTime()
    let end = tempRange.end?.getTime()

    // If hovering while selecting end date
    if (!end && hoverDate && selecting === 'end') {
      end = hoverDate.getTime()
    }

    if (!end) return false

    return d > Math.min(start, end) && d < Math.max(start, end)
  }

  // Check if date is disabled
  const isDisabled = (date: Date): boolean => {
    if (minDate && date < minDate) return true
    if (maxDate && date > maxDate) return true
    return false
  }

  // Handle date click
  const handleDateClick = (date: Date) => {
    if (isDisabled(date)) return

    if (selecting === 'start') {
      setTempRange({ start: date, end: null })
      setSelecting('end')
    } else {
      const newRange = {
        start: tempRange.start,
        end: date < tempRange.start! ? tempRange.start : date,
      }
      if (date < tempRange.start!) {
        newRange.start = date
        newRange.end = tempRange.start
      }
      setTempRange(newRange)
      setSelecting('start')
    }
  }

  // Handle preset click
  const handlePresetClick = (preset: (typeof effectivePresets)[0]) => {
    const range = preset.getValue()
    setTempRange(range)
    onChange?.(range)
    setIsOpen(false)
  }

  // Handle apply
  const handleApply = () => {
    if (tempRange.start && tempRange.end) {
      onChange?.(tempRange)
    }
    setIsOpen(false)
  }

  // Handle cancel
  const handleCancel = () => {
    setTempRange({
      start: value?.start || null,
      end: value?.end || null,
    })
    setIsOpen(false)
  }

  // Clear selection
  const handleClear = () => {
    setTempRange({ start: null, end: null })
    onChange?.({ start: null, end: null })
    setSelecting('start')
  }

  // Navigate months
  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
  }

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
  }

  const days = getDaysInMonth(currentMonth)

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-2 w-full px-4 py-2 bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-600 rounded-lg text-sm',
          'hover:border-secondary-300 dark:hover:border-secondary-500 focus:outline-none focus:ring-2 focus:ring-primary-500',
          value?.start && 'text-secondary-900 dark:text-white',
          !value?.start && 'text-secondary-500 dark:text-secondary-400'
        )}
      >
        <Calendar className="w-4 h-4 flex-shrink-0" />
        <span className="flex-1 text-start truncate">{displayValue()}</span>
        {value?.start && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleClear()
            }}
            className="p-0.5 hover:bg-secondary-100 dark:hover:bg-secondary-700 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full mt-2 start-0 z-50 bg-white dark:bg-secondary-800 rounded-xl shadow-lg border border-secondary-200 dark:border-secondary-700 overflow-hidden">
          <div className="flex">
            {/* Presets */}
            <div className="w-40 border-e border-secondary-200 dark:border-secondary-700 p-2">
              {effectivePresets.map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => handlePresetClick(preset)}
                  className="w-full px-3 py-2 text-sm text-start text-secondary-700 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-700 rounded-lg"
                >
                  {preset.label}
                </button>
              ))}
            </div>

            {/* Calendar */}
            <div className="p-4">
              {/* Month navigation */}
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={prevMonth}
                  className="p-1.5 hover:bg-secondary-100 dark:hover:bg-secondary-700 rounded-lg"
                >
                  <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
                </button>
                <span className="text-sm font-semibold text-secondary-900 dark:text-white">
                  {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                </span>
                <button
                  onClick={nextMonth}
                  className="p-1.5 hover:bg-secondary-100 dark:hover:bg-secondary-700 rounded-lg"
                >
                  <ChevronRight className="w-4 h-4 rtl:rotate-180" />
                </button>
              </div>

              {/* Day headers */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {dayNames.map((day) => (
                  <div
                    key={day}
                    className="w-9 h-9 flex items-center justify-center text-xs font-medium text-secondary-500 dark:text-secondary-400"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Days grid */}
              <div className="grid grid-cols-7 gap-1">
                {days.map((date, i) => {
                  const inCurrentMonth = isCurrentMonth(date)
                  const selected = isSelected(date)
                  const inRange = isInRange(date)
                  const disabled = isDisabled(date)

                  return (
                    <button
                      key={i}
                      onClick={() => handleDateClick(date)}
                      onMouseEnter={() => setHoverDate(date)}
                      onMouseLeave={() => setHoverDate(null)}
                      disabled={disabled}
                      className={cn(
                        'w-9 h-9 flex items-center justify-center text-sm rounded-lg transition-colors',
                        !inCurrentMonth && 'text-secondary-400 dark:text-secondary-600',
                        inCurrentMonth && 'text-secondary-900 dark:text-white',
                        !selected && !inRange && inCurrentMonth && 'hover:bg-secondary-100 dark:hover:bg-secondary-700',
                        inRange && 'bg-primary-100 dark:bg-primary-900/30',
                        selected && 'bg-primary-600 text-white',
                        disabled && 'opacity-50 cursor-not-allowed'
                      )}
                    >
                      {date.getDate()}
                    </button>
                  )
                })}
              </div>

              {/* Selected range display */}
              <div className="mt-4 pt-4 border-t border-secondary-200 dark:border-secondary-700">
                <div className="flex items-center gap-4 text-sm">
                  <div>
                    <span className="text-secondary-500 dark:text-secondary-400">
                      {t.startDate}:
                    </span>{' '}
                    <span className="font-medium text-secondary-900 dark:text-white">
                      {formatDate(tempRange.start) || '-'}
                    </span>
                  </div>
                  <div>
                    <span className="text-secondary-500 dark:text-secondary-400">
                      {t.endDate}:
                    </span>{' '}
                    <span className="font-medium text-secondary-900 dark:text-white">
                      {formatDate(tempRange.end) || '-'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 text-sm text-secondary-700 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-700 rounded-lg"
                >
                  {t.cancel}
                </button>
                <button
                  onClick={handleApply}
                  disabled={!tempRange.start || !tempRange.end}
                  className="px-4 py-2 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t.apply}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DateRangePicker
