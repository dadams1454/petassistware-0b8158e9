
import React from 'react';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyLitterStateProps {
  onCreateLitter: () => void;
}

const EmptyLitterState: React.FC<EmptyLitterStateProps> = ({ onCreateLitter }) => {
  return (
    <div className="text-center py-8">
      <p className="text-muted-foreground mb-4">No litters found</p>
      <Button variant="outline" onClick={onCreateLitter}>
        <PlusCircle className="mr-2 h-4 w-4" />
        Create your first litter
      </Button>
    </div>
  );
};

export default EmptyLitterState;
