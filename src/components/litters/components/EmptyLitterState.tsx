
import React from 'react';
import { PlusCircle } from 'lucide-react';
import { EmptyState } from '@/components/ui/standardized';

interface EmptyLitterStateProps {
  onCreateLitter: () => void;
}

const EmptyLitterState: React.FC<EmptyLitterStateProps> = ({ onCreateLitter }) => {
  return (
    <EmptyState
      icon={<PlusCircle className="h-12 w-12 text-muted-foreground" />}
      title="No litters found"
      description="You haven't added any litters yet. Click the button below to create your first litter."
      action={{
        label: "Create your first litter",
        onClick: onCreateLitter
      }}
    />
  );
};

export default EmptyLitterState;
