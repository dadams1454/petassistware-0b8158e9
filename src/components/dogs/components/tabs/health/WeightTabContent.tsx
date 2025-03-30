
import React from 'react';
import { EmptyState } from '@/components/ui/standardized';
import WeightTrackingSection from '../../health/WeightTrackingSection';
import { useHealthTabContext } from './HealthTabContext';

const WeightTabContent: React.FC = () => {
  const {
    dogId,
    weightHistory,
    growthStats,
    weightDialogOpen,
    setWeightDialogOpen,
    isLoading
  } = useHealthTabContext();

  if (!weightHistory || weightHistory.length === 0) {
    return (
      <EmptyState
        title="No weight history"
        description="Start tracking this dog's weight to monitor growth and health over time."
        action={{
          label: "Add Weight Record",
          onClick: () => setWeightDialogOpen(true)
        }}
      />
    );
  }

  return (
    <WeightTrackingSection 
      dogId={dogId}
      weightHistory={weightHistory}
      growthStats={growthStats}
      onAddWeight={() => setWeightDialogOpen(true)}
      isLoading={isLoading}
    />
  );
};

export default WeightTabContent;
