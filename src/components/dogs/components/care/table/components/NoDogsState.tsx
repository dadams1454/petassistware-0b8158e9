
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dog, RefreshCw } from 'lucide-react';

interface NoDogsStateProps {
  onRefresh: () => void;
}

const NoDogsState: React.FC<NoDogsStateProps> = ({ onRefresh }) => {
  return (
    <Card className="p-8">
      <div className="flex flex-col items-center justify-center text-center">
        <Dog className="h-16 w-16 text-muted-foreground mb-4" />
        <h3 className="text-xl font-semibold">No Dogs Found</h3>
        <p className="text-muted-foreground mt-2 mb-6">
          There are no dogs to display. Add dogs to your kennel to start tracking their care activities.
        </p>
        <Button onClick={onRefresh} className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>
    </Card>
  );
};

export default NoDogsState;
