
import React from 'react';
import { WelpingPuppiesTable } from './WelpingPuppiesTable';
import { Puppy } from '@/components/litters/puppies/types';

interface WelpingPuppiesListProps {
  puppies: Puppy[];
}

const WelpingPuppiesList: React.FC<WelpingPuppiesListProps> = ({ puppies }) => {
  // Add an onRefresh function to satisfy the WelpingPuppiesTable props requirements
  const handleRefresh = async (): Promise<any> => {
    return Promise.resolve();
  };

  return (
    <div className="space-y-4">
      <WelpingPuppiesTable 
        puppies={puppies}
        onRefresh={handleRefresh}
      />
    </div>
  );
};

export default WelpingPuppiesList;
