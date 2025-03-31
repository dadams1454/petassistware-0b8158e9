
import React, { createContext, useContext, useState } from 'react';

interface DashboardContextType {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const DashboardContext = createContext<DashboardContextType>({
  activeTab: 'overview',
  setActiveTab: () => {},
});

export const useDashboard = () => useContext(DashboardContext);

export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <DashboardContext.Provider
      value={{
        activeTab,
        setActiveTab,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};
