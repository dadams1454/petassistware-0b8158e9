
import React, { useState } from 'react';
import { useDogsData } from './hooks/useDogsData';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import DogCard from './components/cards/DogCard';
import NoDogsFound from './components/NoDogsFound';
import SearchFilters from './components/SearchFilters';
import DogFormDialog from './components/dialogs/DogFormDialog';

const DogsList = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  
  const { dogs, isLoading, error, refetch } = useDogsData();
  
  // Filter dogs based on search term and active filter
  const filteredDogs = dogs?.filter((dog) => {
    const matchesSearch = dog.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         (dog.breed && dog.breed.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (activeFilter === 'all') return matchesSearch;
    if (activeFilter === 'male') return matchesSearch && dog.gender === 'male';
    if (activeFilter === 'female') return matchesSearch && dog.gender === 'female';
    if (activeFilter === 'active') return matchesSearch && dog.status === 'active';
    
    return matchesSearch;
  });

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
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
      />
      
      {(!dogs || dogs.length === 0) ? (
        <NoDogsFound onAddClick={() => setIsAddDialogOpen(true)} />
      ) : filteredDogs?.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No dogs match your search criteria.</p>
          <Button variant="outline" className="mt-4" onClick={() => {
            setSearchTerm('');
            setActiveFilter('all');
          }}>
            Clear Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {filteredDogs?.map((dog) => (
            <DogCard key={dog.id} dog={dog} />
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
