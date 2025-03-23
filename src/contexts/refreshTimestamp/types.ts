
export interface RefreshTimestampContextType {
  lastRefresh: Date;
  refresh: () => void;
  refreshInterval: number;
  setRefreshInterval: (interval: number) => void;
}

export interface RefreshTimestampProviderProps {
  children: React.ReactNode;
  initialInterval?: number;
}
