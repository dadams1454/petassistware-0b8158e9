
import React from 'react';
import { Info } from 'lucide-react';

const EmptyState: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-32 border border-dashed rounded-md">
      <div className="text-center">
        <Info className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
        <p className="text-muted-foreground">
          No puppy data available for statistics.
        </p>
      </div>
    </div>
  );
};

export default EmptyState;
