
import React, { createContext, useContext, useState, useCallback } from 'react';

interface RefreshContextType {
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
  refreshTrigger: number;
  triggerRefresh: () => void;
}

const RefreshContext = createContext<RefreshContextType>({
  currentDate: new Date(),
  setCurrentDate: () => {},
  refreshTrigger: 0,
  triggerRefresh: () => {},
});

export const useRefresh = () => useContext(RefreshContext);

export const RefreshProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const triggerRefresh = useCallback(() => {
    setRefreshTrigger(prev => prev + 1);
  }, []);

  return (
    <RefreshContext.Provider
      value={{
        currentDate,
        setCurrentDate,
        refreshTrigger,
        triggerRefresh,
      }}
    >
      {children}
    </RefreshContext.Provider>
  );
};
