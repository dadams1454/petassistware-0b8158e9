
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, Dog } from 'lucide-react';
import NoDogsMessage from './NoDogsMessage';

interface NoDogsStateProps {
  onRefresh: () => void;
}

const NoDogsState: React.FC<NoDogsStateProps> = ({ onRefresh }) => {
  return (
    <div className="p-6 bg-white dark:bg-gray-900 rounded-lg border border-border">
      <NoDogsMessage
        title="No Dogs Found"
        description="Add dogs to your kennel to start tracking their care."
        icon={<Dog className="h-16 w-16 text-muted-foreground mb-4" />}
      >
        <Button
          variant="outline"
          className="mt-4"
          onClick={onRefresh}
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </NoDogsMessage>
    </div>
  );
};

export default NoDogsState;
