
import React from 'react';
import PuppyTableView from './table/PuppyTableView';
import PuppyCardView from './card/PuppyCardView';

interface PuppiesTableProps {
  puppies: Puppy[];
  onEditPuppy: (puppy: Puppy) => void;
  onDeletePuppy: (puppy: Puppy) => void;
}

const PuppiesTable: React.FC<PuppiesTableProps> = ({ 
  puppies, 
  onEditPuppy, 
  onDeletePuppy 
}) => {
  if (puppies.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          No puppies have been added to this litter yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Desktop View - Table */}
      <div className="hidden md:block overflow-x-auto rounded-lg border">
        <PuppyTableView 
          puppies={puppies} 
          onEditPuppy={onEditPuppy} 
          onDeletePuppy={onDeletePuppy} 
        />
      </div>
      
      {/* Mobile View - Cards */}
      <div className="md:hidden space-y-4">
        <PuppyCardView 
          puppies={puppies} 
          onEditPuppy={onEditPuppy} 
          onDeletePuppy={onDeletePuppy} 
        />
      </div>
    </div>
  );
};

export default PuppiesTable;
