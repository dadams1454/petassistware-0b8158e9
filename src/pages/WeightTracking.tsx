
import React from 'react';
import PageContainer from '@/components/common/PageContainer';
import { useParams } from 'react-router-dom';
import WeightTrackingSection from '@/components/dogs/components/health/WeightTrackingSection';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDogDetail } from '@/components/dogs/hooks/useDogDetail';
import { LoadingState, ErrorState } from '@/components/ui/standardized';
import { useWeightTracking } from '@/components/dogs/hooks/useWeightTracking';
import { useState } from 'react';

const WeightTracking: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dogId = id || '';
  const [weightDialogOpen, setWeightDialogOpen] = useState(false);
  
  const { dog, isLoading: isDogLoading, error: dogError } = useDogDetail(dogId);
  const { 
    weightHistory, 
    isLoading: isWeightLoading, 
    growthStats,
    addWeightRecord
  } = useWeightTracking(dogId);
  
  const isLoading = isDogLoading || isWeightLoading;
  
  const handleAddWeight = () => {
    setWeightDialogOpen(true);
  };
  
  const handleSaveWeight = (data: any) => {
    addWeightRecord(data);
    setWeightDialogOpen(false);
  };
  
  if (isLoading) {
    return <LoadingState message="Loading dog details..." />;
  }
  
  if (dogError || !dog) {
    return <ErrorState title="Error" message="Could not load dog information" />;
  }

  return (
    <PageContainer>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Weight Tracking for {dog.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <WeightTrackingSection 
              dogId={dogId} 
              weightHistory={weightHistory || []}
              growthStats={growthStats}
              onAddWeight={handleAddWeight}
              isLoading={isWeightLoading}
            />
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};

export default WeightTracking;
