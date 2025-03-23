
import React from 'react';
import { Info } from 'lucide-react';
import { CardContent } from '@/components/ui/card';

const EmptyState: React.FC = () => {
  return (
    <CardContent>
      <div className="flex items-center justify-center h-64 border border-dashed rounded-md">
        <div className="text-center">
          <Info className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-muted-foreground">
            No puppy data available to display gender distribution.
          </p>
        </div>
      </div>
    </CardContent>
  );
};

export default EmptyState;
