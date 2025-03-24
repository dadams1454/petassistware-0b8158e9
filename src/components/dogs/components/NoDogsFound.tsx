
import React from 'react';

interface NoDogsFoundProps {
  hasSearch: boolean;
}

const NoDogsFound = ({ hasSearch }: NoDogsFoundProps) => {
  return (
    <div className="text-center p-8 bg-muted rounded-lg">
      <h3 className="font-medium text-lg mb-2">No dogs found</h3>
      {hasSearch ? (
        <p className="text-muted-foreground">
          No dogs found matching your search criteria. Try adjusting your filters.
        </p>
      ) : (
        <p className="text-muted-foreground">
          You haven't added any dogs yet. Click the "Add Dog" button to get started.
        </p>
      )}
    </div>
  );
};

export default NoDogsFound;
