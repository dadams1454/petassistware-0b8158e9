import React from 'react';
import { DogCareStatus } from '@/types/dailyCare';
import DogCareGrid from '../grid/DogCareGrid';
import DogCareList from '../list/DogCareList';
import DogCareTable from '../table/DogCareTable';
import PuppiesTab from '../puppies/PuppiesTab';
import PottyObservationDialog from '../potty/PottyObservationDialog';

interface LoadedDogsContentProps {
  dogStatuses: DogCareStatus[];
  activeView: 'grid' | 'table' | 'list';
  selectedCategory: string;
  selectedDogId: string | null;
  dialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
  onLogCare: (dogId: string) => void;
  onCareLogSuccess: () => void;
}

const LoadedDogsContent: React.FC<LoadedDogsContentProps> = ({
  dogStatuses,
  activeView,
  selectedCategory,
  selectedDogId,
  dialogOpen,
  setDialogOpen,
  onLogCare,
  onCareLogSuccess
}) => {
  // If Puppies tab is selected, show the PuppiesTab component
  if (selectedCategory === 'puppies') {
    return <PuppiesTab onRefresh={onCareLogSuccess} />;
  }
  
  // Otherwise, filter dogs by category and show the appropriate view
  const filteredDogs = selectedCategory === 'all' 
    ? dogStatuses 
    : dogStatuses.filter(dog => {
        // Each category would have its own filtering logic
        switch (selectedCategory) {
          case 'potty':
            return true; // All dogs need potty breaks
          case 'feeding':
            return true; // All dogs need feeding
          case 'medications':
            return true; // For now, show all dogs in medications tab
          case 'health':
            return true; // For now, show all dogs in health tab
          case 'exercise':
            return true; // For now, show all dogs in exercise tab
          default:
            return true;
        }
      });
  
  // Render the selected view
  const renderContent = () => {
    switch (activeView) {
      case 'grid':
        return (
          <DogCareGrid 
            dogs={filteredDogs} 
            category={selectedCategory}
            onLogCare={onLogCare}
          />
        );
      case 'table':
        return (
          <DogCareTable 
            dogs={filteredDogs} 
            category={selectedCategory}
            onLogCare={onLogCare}
          />
        );
      case 'list':
        return (
          <DogCareList 
            dogs={filteredDogs} 
            category={selectedCategory}
            onLogCare={onLogCare}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div>
      {renderContent()}
      
      {/* Potty observation dialog */}
      <PottyObservationDialog
        open={dialogOpen && selectedCategory === 'potty'}
        onOpenChange={setDialogOpen}
        selectedDog={selectedDogId ? dogStatuses.find(d => d.dog_id === selectedDogId) : null}
        onSuccess={onCareLogSuccess}
      />
    </div>
  );
};

export default LoadedDogsContent;
