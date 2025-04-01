
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Edit } from 'lucide-react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import EditDogDialog from '@/components/dogs/components/details/EditDogDialog';
import { Button } from '@/components/ui/button';
import { useDogProfileData } from '@/hooks/useDogProfileData';
import DogProfileTabs from '@/components/dogs/components/profile/DogProfileTabs';
import DogDeleteHandler from '@/components/dogs/components/profile/DogDeleteHandler';
import PageContainer from '@/components/common/PageContainer';

// Import standardized components
import {
  PageHeader,
  LoadingState,
  ErrorState
} from '@/components/ui/standardized';

const DogProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { dog, isLoading, error, refetch } = useDogProfileData(id);
  
  if (isLoading) {
    return (
      <PageContainer>
        <div className="container mx-auto py-8">
          <LoadingState message="Loading dog profile..." />
        </div>
      </PageContainer>
    );
  }

  if (error || !dog) {
    return (
      <PageContainer>
        <div className="container mx-auto py-8">
          <ErrorState
            title="Dog not found"
            message="The requested dog could not be found or you don't have permission to view it."
            onRetry={() => refetch()}
          />
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="container mx-auto py-8">
        <PageHeader
          title={dog.name}
          subtitle={`${dog.breed || 'Unknown Breed'} · ${dog.gender || 'Unknown Gender'}`}
          backLink="/dogs"
          action={
            <Button onClick={() => setIsEditDialogOpen(true)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Dog
            </Button>
          }
        />
        
        <DogDeleteHandler dogId={dog.id} dogName={dog.name} />
        
        <DogProfileTabs dog={dog} />
        
        {/* Edit Dialog */}
        <EditDogDialog 
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          dog={dog}
        />
      </div>
    </PageContainer>
  );
};

export default DogProfilePage;
