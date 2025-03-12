
import React from 'react';
import { Button } from '@/components/ui/button';
import { TreeDeciduous } from 'lucide-react';

interface EmptyRelationshipStateProps {
  entityName: string;
  dogName: string;
  relationshipType: 'parent' | 'offspring';
  onAddClick: () => void;
}

const EmptyRelationshipState = ({ 
  entityName, 
  dogName, 
  relationshipType, 
  onAddClick 
}: EmptyRelationshipStateProps) => {
  return (
    <div className="py-8 flex flex-col items-center justify-center text-center text-muted-foreground">
      <div className="mb-2 rounded-full bg-muted/50 p-3">
        <TreeDeciduous className="h-6 w-6 text-muted-foreground" />
      </div>
      <p>No {entityName} have been added yet</p>
      <Button 
        variant="link" 
        onClick={onAddClick}
        className="mt-2"
      >
        Add {relationshipType === 'parent' ? 'a parent' : 'offspring'}
      </Button>
    </div>
  );
};

export default EmptyRelationshipState;
