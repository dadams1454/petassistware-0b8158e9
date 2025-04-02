
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useDogData } from '../hooks/useDogData';
import { Button } from '@/components/ui/button';
import { PageHeader, LoadingState, ErrorState } from '@/components/ui/standardized';
import PageContainer from '@/components/common/PageContainer';
import DogForm from '../components/DogForm';

const DogEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { dog, isLoading, error, updateDog, isUpdating } = useDogData(id);
  
  const handleSubmit = async (dogData: any) => {
    try {
      await updateDog(dogData);
      navigate(`/dogs/${id}`);
    } catch (error) {
      console.error('Error updating dog:', error);
    }
  };
  
  const handleCancel = () => {
    navigate(`/dogs/${id}`);
  };

  if (isLoading) {
    return (
      <PageContainer>
        <LoadingState message="Loading dog details..." />
      </PageContainer>
    );
  }

  if (error || !dog) {
    return (
      <PageContainer>
        <ErrorState 
          title="Error Loading Dog" 
          message="The dog you're trying to edit doesn't exist or you don't have permission to edit it." 
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="container mx-auto py-6">
        <Button variant="ghost" onClick={handleCancel} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dog Details
        </Button>
        
        <PageHeader
          title={`Edit: ${dog.name}`}
          subtitle="Update dog information"
        />
        
        <div className="mt-6 bg-card rounded-lg border p-6">
          <DogForm 
            dog={dog}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isSubmitting={isUpdating}
          />
        </div>
      </div>
    </PageContainer>
  );
};

export default DogEditPage;
