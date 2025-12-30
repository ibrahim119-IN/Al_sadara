/**
 * Dashboard Components
 * Central export for all dashboard UI components
 */

// Layout
export { DashboardLayout, Sidebar, TopBar } from './layout'

// Auth
export { RoleGuard, ProtectedRoute } from './auth'

// Shared Components
export {
  // DataTable
  DataTable,
  // Modal
  Modal,
  ConfirmDialog,
  AlertDialog,
  // Toast
  ToastProvider,
  useToast,
  toast,
  // DateRangePicker
  DateRangePicker,
  // ExportButton
  ExportButton,
} from './shared'

export type {
  // DataTable types
  DataTableProps,
  Column,
  SortState,
  FilterOption,
  FilterConfig,
  // Modal types
  ModalProps,
  ConfirmDialogProps,
  AlertDialogProps,
  // Toast types
  Toast,
  ToastType,
  // DateRangePicker types
  DateRange,
  DateRangePickerProps,
  // ExportButton types
  ExportFormat,
  ExportButtonProps,
} from './shared'
