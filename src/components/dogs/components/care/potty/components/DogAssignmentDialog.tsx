
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DogCareStatus } from '@/types/dailyCare';
import { 
  addDogToGroup, 
  removeDogFromGroup, 
  fetchGroupMembers 
} from '@/services/dailyCare/dogGroupsService';
import { useToast } from '@/hooks/use-toast';
import { Users, Loader2 } from 'lucide-react';

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
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDogs, setSelectedDogs] = useState<Record<string, boolean>>({});
  const [saving, setSaving] = useState(false);

  // Load current group members when dialog opens
  useEffect(() => {
    if (open && groupId) {
      loadGroupMembers();
    }
  }, [open, groupId]);

  // Load current group members
  const loadGroupMembers = async () => {
    try {
      setIsLoading(true);
      const members = await fetchGroupMembers(groupId);
      
      // Create a record of which dogs are in the group
      const dogSelections: Record<string, boolean> = {};
      dogs.forEach(dog => {
        dogSelections[dog.dog_id] = members.some(member => member.dog_id === dog.dog_id);
      });
      
      setSelectedDogs(dogSelections);
    } catch (error) {
      console.error('Error loading group members:', error);
      toast({
        title: 'Error',
        description: 'Failed to load group members.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle checkbox change for a dog
  const handleDogToggle = (dogId: string) => {
    setSelectedDogs(prev => ({
      ...prev,
      [dogId]: !prev[dogId]
    }));
  };

  // Save changes to group membership
  const handleSave = async () => {
    try {
      setSaving(true);
      
      // Get the original group members to compare with selected dogs
      const members = await fetchGroupMembers(groupId);
      const currentMemberIds = members.map(m => m.dog_id);
      
      // Determine which dogs to add and which to remove
      const dogsToAdd: string[] = [];
      const dogsToRemove: string[] = [];
      
      // Check which dogs need to be added
      Object.entries(selectedDogs).forEach(([dogId, isSelected]) => {
        const isCurrentlyInGroup = currentMemberIds.includes(dogId);
        
        if (isSelected && !isCurrentlyInGroup) {
          dogsToAdd.push(dogId);
        } else if (!isSelected && isCurrentlyInGroup) {
          dogsToRemove.push(dogId);
        }
      });
      
      // Process additions
      const addPromises = dogsToAdd.map(dogId => addDogToGroup(dogId, groupId));
      await Promise.all(addPromises);
      
      // Process removals
      const removePromises = dogsToRemove.map(dogId => removeDogFromGroup(dogId, groupId));
      await Promise.all(removePromises);
      
      toast({
        title: 'Success',
        description: `Dogs assigned to ${groupName} successfully.`
      });
      
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving dog assignments:', error);
      toast({
        title: 'Error',
        description: 'Failed to save dog assignments.',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Users className="mr-2 h-5 w-5" />
            Assign Dogs to {groupName}
          </DialogTitle>
        </DialogHeader>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            <div className="py-4">
              <p className="text-sm text-muted-foreground mb-4">
                Select the dogs you want to include in this group.
              </p>
              
              <ScrollArea className="h-[300px] pr-4">
                <div className="space-y-4">
                  {dogs.map(dog => (
                    <div key={dog.dog_id} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`dog-${dog.dog_id}`}
                        checked={selectedDogs[dog.dog_id] || false}
                        onCheckedChange={() => handleDogToggle(dog.dog_id)}
                      />
                      <label 
                        htmlFor={`dog-${dog.dog_id}`}
                        className="flex items-center cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        <div className="h-8 w-8 rounded-full overflow-hidden bg-gray-200 mr-2">
                          {dog.dog_photo ? (
                            <img 
                              src={dog.dog_photo} 
                              alt={dog.dog_name} 
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center bg-primary/10 text-primary text-xs font-bold">
                              {dog.dog_name.charAt(0)}
                            </div>
                          )}
                        </div>
                        {dog.dog_name}
                      </label>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Assignments'
                )}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DogAssignmentDialog;
