
// UI-related types for the application

// Status color types
export type StatusColor = 
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'default'
  | 'primary'
  | 'secondary';

// Button size types
export type ButtonSize = 'sm' | 'md' | 'lg';

// Theme types
export type ThemeMode = 'light' | 'dark' | 'system';

// Page layout types
export type PageLayout = 'default' | 'wide' | 'narrow' | 'fullWidth';

// Navigation item interface
export interface NavItem {
  title: string;
  href: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  external?: boolean;
  children?: NavItem[];
}

// Dropdown option interface
export interface DropdownOption {
  label: string;
  value: string;
  disabled?: boolean;
  description?: string;
}

// Modal size types
export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

// Toast position types
export type ToastPosition = 
  | 'top-right'
  | 'top-center'
  | 'top-left'
  | 'bottom-right'
  | 'bottom-center'
  | 'bottom-left';

// Animation types
export type AnimationType = 'fade' | 'slide' | 'scale' | 'none';
