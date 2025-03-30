
import React from 'react';
import PageContainer from '@/components/common/PageContainer';
import { useParams } from 'react-router-dom';
import WeightTrackingSection from '@/components/dogs/components/health/WeightTrackingSection';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDogDetail } from '@/components/dogs/hooks/useDogDetail';
import { LoadingState, ErrorState } from '@/components/ui/standardized';

const WeightTracking: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dogId = id || '';
  
  const { dog, isLoading, error } = useDogDetail(dogId);
  
  if (isLoading) {
    return <LoadingState message="Loading dog details..." />;
  }
  
  if (error || !dog) {
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
            <WeightTrackingSection dogId={dogId} />
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};

export default WeightTracking;
