
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useDogsData } from '../hooks/useDogsData';
import { useDogsFiltering } from '../hooks/useDogsFiltering';
import { Button } from '@/components/ui/button';
import { PageHeader, LoadingState, ErrorState, EmptyState } from '@/components/ui/standardized';
import PageContainer from '@/components/common/PageContainer';
import DogGrid from '../components/DogGrid';
import DogSearchFilters from '../components/DogSearchFilters';
import DogFormDialog from '../components/dialogs/DogFormDialog';

const DogListPage = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [genderFilter, setGenderFilter] = useState('all');
  const navigate = useNavigate();
  
  const { dogs, isLoading, error, refetch } = useDogsData();
  
  // Use the filtering hook to filter dogs based on search term and filters
  const { filteredDogs } = useDogsFiltering(
    dogs || [],
    searchTerm,
    statusFilter,
    genderFilter
  );

  const handleAddDogSuccess = () => {
    setIsAddDialogOpen(false);
    refetch();
  };

  const handleDogClick = (dogId: string) => {
    navigate(`/dogs/${dogId}`);
  };

  if (isLoading) {
    return (
      <PageContainer>
        <LoadingState message="Loading dogs..." size="large" />
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <ErrorState 
          title="Error Loading Dogs" 
          message="There was a problem loading the dog data." 
          onRetry={() => refetch()} 
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="container mx-auto py-6">
        <PageHeader 
          title="Dogs"
          subtitle="Manage your kennel's dogs"
          action={
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Dog
            </Button>
          }
        />
        
        <DogSearchFilters 
          searchTerm={searchTerm} 
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          genderFilter={genderFilter}
          setGenderFilter={setGenderFilter}
        />
        
        {(!dogs || dogs.length === 0) ? (
          <EmptyState
            title="No Dogs Found"
            description="You haven't added any dogs yet. Click the 'Add Dog' button to get started."
            action={{
              label: "Add Dog",
              onClick: () => setIsAddDialogOpen(true)
            }}
          />
        ) : filteredDogs?.length === 0 ? (
          <EmptyState
            title="No Matching Dogs"
            description="No dogs match your search criteria."
            action={{
              label: "Clear Filters",
              onClick: () => {
                setSearchTerm('');
                setStatusFilter('all');
                setGenderFilter('all');
              }
            }}
          />
        ) : (
          <DogGrid 
            dogs={filteredDogs} 
            onDogClick={handleDogClick} 
          />
        )}
        
        <DogFormDialog
          isOpen={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          onSuccess={handleAddDogSuccess}
          onCancel={() => setIsAddDialogOpen(false)}
          title="Add New Dog"
        />
      </div>
    </PageContainer>
  );
};

export default DogListPage;
