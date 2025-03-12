
import React from 'react';
import { File, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyDocumentStateProps {
  onAddDocument: () => void;
}

const EmptyDocumentState: React.FC<EmptyDocumentStateProps> = ({ onAddDocument }) => {
  return (
    <div className="text-center py-8">
      <File className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
      <h3 className="text-lg font-medium">No Documents Yet</h3>
      <p className="text-muted-foreground">
        Upload important documents like registration certificates, health records, and more.
      </p>
      <Button onClick={onAddDocument} className="mt-4">
        <Plus className="h-4 w-4 mr-2" />
        Add Document
      </Button>
    </div>
  );
};

export default EmptyDocumentState;
