
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader, LoadingState, ErrorState } from '@/components/ui/standardized';
import PageContainer from '@/components/common/PageContainer';
import { useWelping } from './hooks/useWelping';
import { WelpingEditForm } from './components';

const WelpingEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { litter, isLoading, error, updateWelping } = useWelping(id);
  
  const handleBackClick = () => {
    navigate(`/welping/${id}`);
  };
  
  const handleSave = async (data: any) => {
    await updateWelping(data);
    navigate(`/welping/${id}`);
  };

  if (isLoading) {
    return (
      <PageContainer>
        <LoadingState message="Loading whelping details..." />
      </PageContainer>
    );
  }
  
  if (error || !litter) {
    return (
      <PageContainer>
        <ErrorState 
          title="Error" 
          message="Could not load whelping details. The litter may not exist." 
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="container mx-auto py-6 space-y-6">
        <Button variant="ghost" onClick={handleBackClick} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Whelping Details
        </Button>
        
        <PageHeader 
          title="Edit Whelping Record"
          subtitle="Update information about this whelping session"
        />
        
        <Card>
          <CardHeader>
            <CardTitle>Whelping Details</CardTitle>
          </CardHeader>
          <CardContent>
            <WelpingEditForm 
              litter={litter}
              onSave={handleSave}
            />
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};

export default WelpingEditPage;
