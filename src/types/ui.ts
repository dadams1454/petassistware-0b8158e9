
// Status color type for UI components
export type StatusColor = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';

// Card size type
export type CardSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

// Button variant type
export type ButtonVariant = 'default' | 'primary' | 'secondary' | 'outline' | 'ghost' | 'link' | 'destructive';

// Form field size type
export type FormFieldSize = 'default' | 'sm' | 'lg';

// Tab orientation type
export type TabOrientation = 'horizontal' | 'vertical';

// Toast variant type
export type ToastVariant = 'default' | 'destructive' | 'success' | 'warning' | 'info';

// Avatar size type
export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

// Badge variant type
export type BadgeVariant = 
  | 'default'
  | 'secondary'
  | 'destructive'
  | 'outline'
  | 'success'
  | 'warning'
  | 'info';

// Calendar view type
export type CalendarView = 'day' | 'week' | 'month' | 'agenda';

// Alert variant type
export type AlertVariant = 'default' | 'destructive' | 'success' | 'warning' | 'info';

// Table sorting direction
export type SortDirection = 'asc' | 'desc';

// Dashboard view type
export type DashboardView = 'list' | 'grid' | 'table' | 'calendar' | 'timeline';

// Modal size type
export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

// Spacing size
export type SpacingSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

// Card component interface
export interface CardProps {
  title?: string;
  description?: string;
  size?: CardSize;
  className?: string;
  onClick?: () => void;
  href?: string;
  children?: React.ReactNode;
}

// Button component props
export interface ButtonProps {
  variant?: ButtonVariant;
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  children?: React.ReactNode;
}

// Dropdown option
export interface DropdownOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
  description?: string;
  disabled?: boolean;
}

// Form field props
export interface FormFieldProps {
  label?: string;
  description?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  size?: FormFieldSize;
  className?: string;
  children?: React.ReactNode;
}

// Pagination state
export interface PaginationState {
  pageIndex: number;
  pageSize: number;
  pageCount: number;
  total: number;
}
