
import React from 'react';

interface NoLitterSelectedProps {
  isLoadingLitters: boolean;
}

const NoLitterSelected: React.FC<NoLitterSelectedProps> = ({ isLoadingLitters }) => {
  return (
    <div className="text-center py-12 border border-dashed rounded-lg">
      {isLoadingLitters ? (
        <p className="text-muted-foreground">Loading litter data...</p>
      ) : (
        <div className="space-y-2">
          <p className="text-muted-foreground">No litter selected or available.</p>
          <p className="text-sm text-muted-foreground">
            Please add litters and puppy data to see breeding analytics.
          </p>
        </div>
      )}
    </div>
  );
};

export default NoLitterSelected;
