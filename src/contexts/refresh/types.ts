
import { RefObject } from 'react';

export type RefreshableArea = 'dailyCare' | 'dashboard' | 'dogs' | 'puppies' | 'all';

export interface RefreshCallbacks {
  onRefresh?: (date?: Date, force?: boolean) => Promise<any>;
  onDateChange?: (newDate: Date) => void;
}

export interface RefreshContextType {
  // Refresh states
  isRefreshing: Record<RefreshableArea, boolean>;
  lastRefreshTime: Record<RefreshableArea, Date>;
  currentDate: Date;
  
  // Refresh actions
  handleRefresh: (area: RefreshableArea, showToast?: boolean) => Promise<void>;
  
  // Utility functions
  getTimeUntilNextRefresh: (area: RefreshableArea) => number;
  formatTimeRemaining: (area?: RefreshableArea) => string;
  
  // Configuration
  refreshInterval: Record<RefreshableArea, number>;
  setRefreshInterval: (area: RefreshableArea, interval: number) => void;
  
  // Registration
  registerCallback: (area: RefreshableArea, callbacks: RefreshCallbacks) => () => void;
}

export interface RefreshProviderProps {
  children: React.ReactNode;
  initialRefreshInterval?: number; // in milliseconds
  enableToasts?: boolean;
}

export interface UseRefreshResult {
  isRefreshing: boolean;
  lastRefreshTime: Date;
  currentDate: Date;
  handleRefresh: (showToast?: boolean) => Promise<void>;
  refreshAll: (showToast?: boolean) => Promise<void>;
  timeUntilNextRefresh: number;
  formatTimeRemaining: () => string;
  setRefreshInterval: (interval: number) => void;
}
