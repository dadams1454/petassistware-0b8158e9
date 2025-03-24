
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

interface NoDogsFoundProps {
  hasSearch?: boolean;
  onAddClick?: () => void;
}

const NoDogsFound = ({ hasSearch = false, onAddClick }: NoDogsFoundProps) => {
  return (
    <div className="text-center p-8 bg-muted rounded-lg">
      <h3 className="font-medium text-lg mb-2">No dogs found</h3>
      {hasSearch ? (
        <p className="text-muted-foreground">
          No dogs found matching your search criteria. Try adjusting your filters.
        </p>
      ) : (
        <div>
          <p className="text-muted-foreground mb-4">
            You haven't added any dogs yet. Click the "Add Dog" button to get started.
          </p>
          {onAddClick && (
            <Button onClick={onAddClick} className="mt-2">
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Dog
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default NoDogsFound;
