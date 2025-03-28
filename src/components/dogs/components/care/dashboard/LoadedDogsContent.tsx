
import React from 'react';
import { DogCareStatus } from '@/types/dailyCare';
import { Card } from '@/components/ui/card';
import PuppiesTab from '../puppies/PuppiesTab';

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
  
  // For now, show a simple card with the view info until we implement the other views
  return (
    <Card className="p-6">
      <p className="text-center text-muted-foreground">
        {activeView === 'grid' && 'Grid view will be implemented here'}
        {activeView === 'table' && 'Table view will be implemented here'}
        {activeView === 'list' && 'List view will be implemented here'}
      </p>
      <p className="text-center mt-4">
        Showing {dogStatuses.length} dogs for category: {selectedCategory}
      </p>
    </Card>
  );
};

export default LoadedDogsContent;
