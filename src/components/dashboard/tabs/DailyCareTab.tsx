
import React, { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { useDogCareDashboard } from '@/hooks/useDogCareDashboard';
import { DogCareStatus } from '@/types/dailyCare';
import { SectionHeader } from '@/components/ui/standardized';
import CareCategoryTabs from './components/CareCategoryTabs';
import CareTabContent from './components/CareTabContent';
import LoadingState from './components/LoadingState';
import NoDogsCareState from './components/NoDogsCareState';

interface DailyCareTabProps {
  onRefreshDogs: () => void;
  isRefreshing?: boolean;
  currentDate?: Date;
  dogStatuses?: DogCareStatus[];
}

const DailyCareTab: React.FC<DailyCareTabProps> = ({ 
  onRefreshDogs,
  isRefreshing = false,
  currentDate = new Date(),
  dogStatuses = []
}) => {
  const [careCategory, setCareCategory] = useState<string>('feeding'); // Default to feeding
  
  const {
    effectiveDogStatuses,
    showLoading,
    noDogs,
    handleRefresh
  } = useDogCareDashboard(onRefreshDogs, dogStatuses, currentDate);
  
  return (
    <div className="space-y-6">
      <SectionHeader
        title="Daily Care"
        description="Track all care activities for your dogs"
        action={{
          label: "Refresh",
          onClick: handleRefresh,
          icon: <RefreshCw className={`h-4 w-4 ${showLoading || isRefreshing ? "animate-spin" : ""}`} />
        }}
      />
      
      {/* Main category tabs */}
      <CareCategoryTabs 
        activeCategory={careCategory} 
        onCategoryChange={setCareCategory} 
      />
      
      {/* Render appropriate content based on state */}
      {(showLoading || isRefreshing) ? (
        <LoadingState />
      ) : noDogs ? (
        <NoDogsCareState />
      ) : (
        <CareTabContent 
          category={careCategory} 
          dogStatuses={effectiveDogStatuses} 
          onRefresh={handleRefresh} 
        />
      )}
    </div>
  );
};

export default DailyCareTab;
