
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DogCareStatus } from '@/types/dailyCare';
import { useToast } from '@/hooks/use-toast';
import { useDogGroups } from '../hooks/useDogGroups';

interface DogAssignmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  groupId: string;
  groupName: string;
  dogs: DogCareStatus[];
}

const DogAssignmentDialog: React.FC<DogAssignmentDialogProps> = ({
  open,
  onOpenChange,
  groupId,
  groupName,
  dogs
}) => {
  const [selectedDogs, setSelectedDogs] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { groups, addDogToGroup, removeDogFromGroup } = useDogGroups();
  
  // Find the current group to get its dog IDs
  const currentGroup = groups.find(group => group.id === groupId);
  
  // When the dialog opens, set the selectedDogs based on the current group
  useEffect(() => {
    if (open && currentGroup) {
      setSelectedDogs(currentGroup.dogIds || []);
    }
  }, [open, currentGroup]);
  
  const handleToggleDog = (dogId: string) => {
    setSelectedDogs(prev => 
      prev.includes(dogId)
        ? prev.filter(id => id !== dogId)
        : [...prev, dogId]
    );
  };
  
  const handleSave = async () => {
    try {
      setIsSubmitting(true);
      
      // Get current dogs in the group
      const currentDogIds = currentGroup?.dogIds || [];
      
      // Dogs to add (in selectedDogs but not in currentDogIds)
      const dogsToAdd = selectedDogs.filter(id => !currentDogIds.includes(id));
      
      // Dogs to remove (in currentDogIds but not in selectedDogs)
      const dogsToRemove = currentDogIds.filter(id => !selectedDogs.includes(id));
      
      // Add dogs to group
      for (const dogId of dogsToAdd) {
        await addDogToGroup(groupId, dogId);
      }
      
      // Remove dogs from group
      for (const dogId of dogsToRemove) {
        await removeDogFromGroup(groupId, dogId);
      }
      
      toast({
        title: 'Dogs Updated',
        description: `Successfully updated dogs in the ${groupName} group.`
      });
      
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating dogs in group:', error);
      toast({
        title: 'Error',
        description: 'Failed to update dogs in the group.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Assign Dogs to {groupName}</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <p className="text-sm text-muted-foreground mb-4">
            Select the dogs you want to include in this group.
          </p>
          
          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-2">
              {dogs.map(dog => (
                <div key={dog.dog_id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`dog-${dog.dog_id}`}
                    checked={selectedDogs.includes(dog.dog_id)}
                    onCheckedChange={() => handleToggleDog(dog.dog_id)}
                  />
                  <label 
                    htmlFor={`dog-${dog.dog_id}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {dog.dog_name}
                  </label>
                </div>
              ))}
              
              {dogs.length === 0 && (
                <p className="text-sm text-muted-foreground">No dogs available.</p>
              )}
            </div>
          </ScrollArea>
        </div>
        
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DogAssignmentDialog;
