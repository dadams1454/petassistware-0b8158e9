
import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { DogCareStatus } from '@/types/dailyCare';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

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
  const [searchTerm, setSearchTerm] = useState('');
  const [assignedDogIds, setAssignedDogIds] = useState<string[]>([]);
  
  // Filter dogs based on search term
  const filteredDogs = dogs.filter(dog => 
    dog.dog_name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Fetch currently assigned dogs
  useEffect(() => {
    const fetchAssignedDogs = async () => {
      try {
        // In a real implementation, fetch the currently assigned dogs for this group
        // For now, we'll just use a mock empty array
        setAssignedDogIds([]);
      } catch (error) {
        console.error('Error fetching assigned dogs:', error);
      }
    };
    
    if (open) {
      fetchAssignedDogs();
    }
  }, [open, groupId]);
  
  // Update selected dogs when assigned dogs change
  useEffect(() => {
    setSelectedDogs(assignedDogIds);
  }, [assignedDogIds]);
  
  const handleToggleDog = (dogId: string) => {
    setSelectedDogs(prev => 
      prev.includes(dogId) 
        ? prev.filter(id => id !== dogId)
        : [...prev, dogId]
    );
  };
  
  const handleSave = async () => {
    try {
      // In a real implementation, save the selected dogs to the group
      console.log('Saving dogs to group:', { groupId, dogs: selectedDogs });
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving dog assignments:', error);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Assign Dogs to {groupName}</DialogTitle>
        </DialogHeader>
        
        <div className="relative my-4">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search dogs..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="max-h-[300px] overflow-y-auto space-y-2 py-2">
          {filteredDogs.length === 0 ? (
            <p className="text-center text-muted-foreground">No dogs found matching your search</p>
          ) : (
            filteredDogs.map(dog => (
              <div key={dog.dog_id} className="flex items-center space-x-2 p-2 hover:bg-muted/50 rounded-md">
                <Checkbox 
                  id={`dog-${dog.dog_id}`}
                  checked={selectedDogs.includes(dog.dog_id)}
                  onCheckedChange={() => handleToggleDog(dog.dog_id)}
                />
                <Label 
                  htmlFor={`dog-${dog.dog_id}`}
                  className="flex items-center cursor-pointer flex-1"
                >
                  <div className="w-8 h-8 rounded-full bg-muted mr-2 flex items-center justify-center overflow-hidden">
                    {dog.dog_photo ? (
                      <img 
                        src={dog.dog_photo} 
                        alt={dog.dog_name} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-xs text-muted-foreground">
                        {dog.dog_name.charAt(0)}
                      </span>
                    )}
                  </div>
                  <span>{dog.dog_name}</span>
                </Label>
              </div>
            ))
          )}
        </div>
        
        <DialogFooter className="mt-4">
          <div className="flex justify-between w-full">
            <span className="text-sm text-muted-foreground">
              {selectedDogs.length} dogs selected
            </span>
            <div className="space-x-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                Save Assignments
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DogAssignmentDialog;
