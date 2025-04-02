
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Pencil, Scale, ArrowLeft } from 'lucide-react';
import { useDogData } from '../hooks/useDogData';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { PageHeader, LoadingState, ErrorState } from '@/components/ui/standardized';
import PageContainer from '@/components/common/PageContainer';
import DogInfoPanel from '../components/DogInfoPanel';
import DogTabs from '../components/DogTabs';
import DogFormDialog from '../components/dialogs/DogFormDialog';

const DogDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  const { dog, isLoading, error, refetch } = useDogData(id);

  const handleEditSuccess = () => {
    setIsEditDialogOpen(false);
    refetch();
  };

  const handleBackClick = () => {
    navigate('/dogs');
  };

  const handleWeightClick = () => {
    navigate(`/dogs/${id}/weight`);
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
          message="The dog you're looking for doesn't exist or you don't have permission to view it." 
          onRetry={() => refetch()} 
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="container mx-auto py-6">
        <div className="mb-6">
          <Button variant="ghost" onClick={handleBackClick} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dogs
          </Button>
          
          <PageHeader 
            title={dog.name}
            subtitle={`${dog.breed} · ${dog.gender}`}
            action={
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={handleWeightClick}
                >
                  <Scale className="h-4 w-4 mr-2" />
                  Weight Tracking
                </Button>
                <Button 
                  onClick={() => setIsEditDialogOpen(true)}
                >
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit Dog
                </Button>
              </div>
            }
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <DogInfoPanel dog={dog} />
          </div>
          
          <div className="md:col-span-3">
            <DogTabs dog={dog} dogId={dog.id} />
          </div>
        </div>
        
        <DogFormDialog
          isOpen={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          onSuccess={handleEditSuccess}
          onCancel={() => setIsEditDialogOpen(false)}
          dog={dog}
          title="Edit Dog"
        />
      </div>
    </PageContainer>
  );
};

export default DogDetailPage;
