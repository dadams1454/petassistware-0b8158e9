
import React from 'react';
import { Card } from '@/components/ui/card';
import { WelpingPuppiesTable } from './WelpingPuppiesTable'; // Use named import
import { Puppy } from '@/components/litters/puppies/types';
import EmptyState from './EmptyState';

interface WelpingPuppiesListProps {
  puppies: Puppy[];
  onRefresh?: () => Promise<void>;
}

const WelpingPuppiesList: React.FC<WelpingPuppiesListProps> = ({ 
  puppies,
  onRefresh = async () => Promise.resolve() // Default implementation
}) => {
  if (!puppies || puppies.length === 0) {
    return (
      <EmptyState
        title="No puppies recorded yet"
        description="Record the birth of puppies to track them here"
      />
    );
  }

  return (
    <Card className="overflow-hidden">
      <WelpingPuppiesTable 
        puppies={puppies} 
        onRefresh={onRefresh} 
      />
    </Card>
  );
};

export default WelpingPuppiesList;
