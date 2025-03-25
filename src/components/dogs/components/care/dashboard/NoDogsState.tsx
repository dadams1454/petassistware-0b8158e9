
import React from 'react';
import { Dog } from 'lucide-react';
import { EmptyState } from '@/components/ui/standardized';

interface NoDogsStateProps {
  onRefresh: () => void;
}

const NoDogsState: React.FC<NoDogsStateProps> = ({ onRefresh }) => {
  return (
    <EmptyState
      icon={<Dog className="h-12 w-12 text-muted-foreground" />}
      title="No dogs found"
      description="No dogs found in the system. Please add dogs to start tracking their care."
      action={{
        label: "Refresh",
        onClick: onRefresh
      }}
    />
  );
};

export default NoDogsState;
