
import React, { useState } from 'react';
import { useDogsData } from './hooks/useDogsData';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import DogCard from './components/cards/DogCard';
import NoDogsFound from './components/NoDogsFound';
import SearchFilters from './components/SearchFilters';
import DogFormDialog from './components/dialogs/DogFormDialog';
import { useDogsFiltering } from './hooks/useDogsFiltering';

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
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-semibold mb-2 text-destructive">Error Loading Dogs</h2>
        <p className="text-muted-foreground mb-4">There was a problem loading your dog data.</p>
        <Button onClick={() => refetch()}>Try Again</Button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dogs</h1>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Dog
        </Button>
      </div>
      
      <SearchFilters 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        genderFilter={genderFilter}
        setGenderFilter={setGenderFilter}
      />
      
      {(!dogs || dogs.length === 0) ? (
        <NoDogsFound onAddClick={() => setIsAddDialogOpen(true)} />
      ) : filteredDogs?.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No dogs match your search criteria.</p>
          <Button variant="outline" className="mt-4" onClick={() => {
            setSearchTerm('');
            setStatusFilter('all');
            setGenderFilter('all');
          }}>
            Clear Filters
          </Button>
        </div>
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
