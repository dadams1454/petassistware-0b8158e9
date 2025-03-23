
export interface RefreshTimestampContextType {
  lastRefresh: Date;
  refresh: () => void;
}

export interface RefreshTimestampProviderProps {
  children: React.ReactNode;
}
