
import React from 'react';
import { WelpingPuppiesTable } from './WelpingPuppiesTable'; // Using named import since there's no default export
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
        onRefresh={handleRefresh} // Add the required onRefresh prop
      />
    </div>
  );
};

export default WelpingPuppiesList;
