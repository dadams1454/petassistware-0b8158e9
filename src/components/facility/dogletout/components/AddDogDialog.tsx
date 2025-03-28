
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';
import { DogCareStatus } from '@/types/dailyCare';
import { DogGroup } from '../hooks/useDogGroups';
import { ScrollArea } from '@/components/ui/scroll-area';

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
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Add Dogs to Group</DialogTitle>
        </DialogHeader>
        {selectedGroup && (
          <div className="py-2">
            <h3 className="text-sm font-medium mb-2">
              Select dogs to add to <span className="font-bold">{selectedGroup.name}</span>
            </h3>
            
            {availableDogs.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                All dogs are already in this group.
              </p>
            ) : (
              <ScrollArea className="h-48 pr-4">
                <div className="flex flex-wrap gap-2 mt-3">
                  {availableDogs.map(dog => (
                    <Badge 
                      key={dog.dog_id} 
                      variant="outline"
                      className="cursor-pointer hover:bg-primary/10 transition-colors text-xs"
                      onClick={() => onAddDogToGroup(dog.dog_id)}
                    >
                      <Plus className="h-2.5 w-2.5 mr-1" />
                      {dog.dog_name}
                    </Badge>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>
        )}
        <DialogFooter>
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddDogDialog;
