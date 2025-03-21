
import React from 'react';
import { TabsList as ShadcnTabsList, TabsTrigger } from '@/components/ui/tabs';

interface TabsListProps {
  activeTab: string;
  onTabChange: (value: string) => void;
}

const TabsList: React.FC<TabsListProps> = ({
  activeTab,
  onTabChange
}) => {
  return (
    <div className="mb-4">
      <ShadcnTabsList>
        <TabsTrigger value="overview" onClick={() => onTabChange('overview')}>
          Overview
        </TabsTrigger>
        <TabsTrigger value="dailycare" onClick={() => onTabChange('dailycare')}>
          Daily Care
        </TabsTrigger>
        <TabsTrigger value="grooming" onClick={() => onTabChange('grooming')}>
          Grooming
        </TabsTrigger>
      </ShadcnTabsList>
    </div>
  );
};

export default TabsList;
