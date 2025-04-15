
import React, { useState } from 'react';
import { useDogsData } from './hooks/useDogsData';
import { Plus } from 'lucide-react';
import DogCard from './components/cards/DogCard';
import SearchFilters from './components/SearchFilters';
import DogFormDialog from './components/dialogs/DogFormDialog';
import { useDogsFiltering } from './hooks/useDogsFiltering';
import { 
  PageHeader, 
  LoadingState, 
  ErrorState, 
  EmptyState 
} from '@/components/ui/standardized';
import { Button } from '@/components/ui/button';

const DogsList = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [genderFilter, setGenderFilter] = useState('all');
  
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

  if (isLoading) {
    return <LoadingState message="Loading dogs..." size="large" fullPage />;
  }

  if (error) {
    return (
      <ErrorState 
        title="Error Loading Dogs" 
        description="There was a problem loading the dog data." 
        onRetry={() => refetch()} 
      />
    );
  }

  return (
    <div>
      <PageHeader 
        title="Dogs"
        description="Manage your kennel's dogs"
        action={
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Dog
          </Button>
        }
      />
      
      <SearchFilters 
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {filteredDogs?.map((dog) => (
            <DogCard 
              key={dog.id} 
              dog={dog} 
              appointmentCount={0} 
            />
          ))}
        </div>
      )}
      
      <DogFormDialog
        isOpen={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSuccess={handleAddDogSuccess}
        onCancel={() => setIsAddDialogOpen(false)}
        title="Add New Dog"
      />
    </div>
  );
};

export default DogsList;
