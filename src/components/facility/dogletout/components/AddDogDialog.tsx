
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';
import { DogCareStatus } from '@/types/dailyCare';
import { DogGroup } from '../hooks/useDogGroups';

interface AddDogDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedGroup: DogGroup | null;
  availableDogs: DogCareStatus[];
  onAddDogToGroup: (dogId: string) => void;
}

const AddDogDialog: React.FC<AddDogDialogProps> = ({
  open,
  onOpenChange,
  selectedGroup,
  availableDogs,
  onAddDogToGroup
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Dogs to Group</DialogTitle>
        </DialogHeader>
        {selectedGroup && (
          <div className="py-4">
            <h3 className="font-medium mb-2">
              Select dogs to add to <span className="font-bold">{selectedGroup.name}</span>
            </h3>
            
            {availableDogs.length === 0 ? (
              <p className="text-muted-foreground">
                All dogs are already in this group.
              </p>
            ) : (
              <div className="flex flex-wrap gap-2 mt-4">
                {availableDogs.map(dog => (
                  <Badge 
                    key={dog.dog_id} 
                    variant="outline"
                    className="cursor-pointer hover:bg-primary/10 transition-colors"
                    onClick={() => onAddDogToGroup(dog.dog_id)}
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    {dog.dog_name}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddDogDialog;
