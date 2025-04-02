
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useDogData } from '../hooks/useDogData';
import { useWeightTracking } from '../hooks/useWeightTracking';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader, LoadingState, ErrorState } from '@/components/ui/standardized';
import PageContainer from '@/components/common/PageContainer';
import WeightTrackingSection from '../components/weight/WeightTrackingSection';
import WeightEntryDialog from '../components/dialogs/WeightEntryDialog';

const DogWeightPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [weightDialogOpen, setWeightDialogOpen] = useState(false);
  
  const { dog, isLoading: isDogLoading, error: dogError } = useDogData(id);
  const { 
    weightHistory, 
    isLoading: isWeightLoading, 
    error: weightError,
    addWeightRecord,
    growthStats
  } = useWeightTracking(id || '');
  
  const isLoading = isDogLoading || isWeightLoading;
  
  const handleAddWeight = () => {
    setWeightDialogOpen(true);
  };
  
  const handleSaveWeight = (data: any) => {
    addWeightRecord(data);
    setWeightDialogOpen(false);
  };

  const handleBackClick = () => {
    navigate(`/dogs/${id}`);
  };
  
  if (isLoading) {
    return (
      <PageContainer>
        <LoadingState message="Loading weight data..." />
      </PageContainer>
    );
  }
  
  if (dogError || !dog) {
    return (
      <PageContainer>
        <ErrorState 
          title="Error" 
          message="Could not load dog information" 
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="container mx-auto py-6">
        <Button variant="ghost" onClick={handleBackClick} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dog Details
        </Button>
        
        <PageHeader 
          title={`Weight Tracking: ${dog.name}`}
          subtitle={`Track and analyze ${dog.name}'s weight over time`}
        />
        
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Weight History</CardTitle>
          </CardHeader>
          <CardContent>
            <WeightTrackingSection 
              dogId={id || ''} 
              weightHistory={weightHistory || []}
              growthStats={growthStats}
              onAddWeight={handleAddWeight}
              isLoading={isWeightLoading}
            />
          </CardContent>
        </Card>
        
        <WeightEntryDialog
          open={weightDialogOpen}
          onOpenChange={setWeightDialogOpen}
          onSave={handleSaveWeight}
          dogId={id || ''}
        />
      </div>
    </PageContainer>
  );
};

export default DogWeightPage;
