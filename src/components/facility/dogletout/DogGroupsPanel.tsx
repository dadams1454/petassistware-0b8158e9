
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogTrigger
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { Plus, Trash, Edit, Dog, MoreHorizontal, Check, X } from 'lucide-react';
import { DogCareStatus } from '@/types/dailyCare';
import { useDogGroups } from './hooks/useDogGroups';

interface DogGroupsPanelProps {
  dogsData: DogCareStatus[];
  onGroupsUpdated?: () => void;
}

const DogGroupsPanel: React.FC<DogGroupsPanelProps> = ({ 
  dogsData,
  onGroupsUpdated
}) => {
  const { toast } = useToast();
  const [openDialog, setOpenDialog] = useState(false);
  const [editingGroup, setEditingGroup] = useState<string | null>(null);
  const [groupName, setGroupName] = useState('');
  const [groupColor, setGroupColor] = useState('#4CAF50');
  const [selectedDogs, setSelectedDogs] = useState<string[]>([]);
  
  // Use our custom hook to manage dog groups
  const { 
    groups, 
    addGroup, 
    updateGroup, 
    removeGroup,
    isLoading 
  } = useDogGroups();
  
  const handleOpenDialog = (groupId?: string) => {
    if (groupId) {
      // We're editing an existing group
      const group = groups.find(g => g.id === groupId);
      if (group) {
        setEditingGroup(groupId);
        setGroupName(group.name);
        setGroupColor(group.color);
        setSelectedDogs(group.dogIds);
      }
    } else {
      // Creating a new group
      setEditingGroup(null);
      setGroupName('');
      setGroupColor('#4CAF50');
      setSelectedDogs([]);
    }
    setOpenDialog(true);
  };
  
  const handleSave = async () => {
    if (!groupName.trim()) {
      toast({
        title: "Group name required",
        description: "Please enter a name for this group",
        variant: "destructive"
      });
      return;
    }
    
    try {
      if (editingGroup) {
        // Update existing group
        await updateGroup(editingGroup, {
          name: groupName,
          color: groupColor,
          dogIds: selectedDogs
        });
        toast({
          title: "Group updated",
          description: `The group "${groupName}" has been updated`
        });
      } else {
        // Create new group
        await addGroup({
          name: groupName,
          color: groupColor,
          dogIds: selectedDogs
        });
        toast({
          title: "Group created",
          description: `New group "${groupName}" has been created`
        });
      }
      
      setOpenDialog(false);
      if (onGroupsUpdated) onGroupsUpdated();
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem saving the group",
        variant: "destructive"
      });
      console.error("Error saving group:", error);
    }
  };
  
  const handleDelete = async (groupId: string) => {
    if (confirm("Are you sure you want to delete this group?")) {
      try {
        await removeGroup(groupId);
        toast({
          title: "Group deleted",
          description: "The group has been deleted"
        });
        if (onGroupsUpdated) onGroupsUpdated();
      } catch (error) {
        toast({
          title: "Error",
          description: "There was a problem deleting the group",
          variant: "destructive"
        });
        console.error("Error deleting group:", error);
      }
    }
  };
  
  const toggleDogSelection = (dogId: string) => {
    setSelectedDogs(prev => 
      prev.includes(dogId)
        ? prev.filter(id => id !== dogId)
        : [...prev, dogId]
    );
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Dog Groups</h3>
          <p className="text-muted-foreground">Create and manage groups for potty breaks</p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Group
        </Button>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : groups.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6 text-center">
            <Dog className="h-10 w-10 text-muted-foreground mb-2" />
            <h3 className="text-lg font-medium">No Groups Created</h3>
            <p className="text-muted-foreground mb-4">Create dog groups to manage potty breaks efficiently</p>
            <Button onClick={() => handleOpenDialog()} className="gap-2">
              <Plus className="h-4 w-4" />
              Create First Group
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {groups.map(group => {
            const groupDogs = dogsData.filter(dog => group.dogIds.includes(dog.dog_id));
            
            return (
              <Card key={group.id} className="overflow-hidden">
                <div 
                  className="p-4 flex justify-between items-center" 
                  style={{ backgroundColor: `${group.color}30` }}
                >
                  <div className="flex items-center">
                    <Badge 
                      className="mr-2" 
                      style={{ backgroundColor: group.color }}
                    >
                      {groupDogs.length}
                    </Badge>
                    <h3 className="font-medium">{group.name}</h3>
                  </div>
                  <div className="flex space-x-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleOpenDialog(group.id)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleDelete(group.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <CardContent className="p-4">
                  {groupDogs.length === 0 ? (
                    <p className="text-muted-foreground text-sm">No dogs in this group</p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {groupDogs.map(dog => (
                        <Badge key={dog.dog_id} variant="outline" className="flex items-center gap-1">
                          <Dog className="h-3 w-3" />
                          {dog.dog_name}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
      
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingGroup ? 'Edit Group' : 'Create New Group'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="group-name" className="text-right">Name</Label>
              <Input 
                id="group-name" 
                value={groupName} 
                onChange={e => setGroupName(e.target.value)} 
                className="col-span-3"
                placeholder="Enter group name"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="group-color" className="text-right">Color</Label>
              <div className="col-span-3 flex items-center gap-2">
                <input 
                  type="color" 
                  id="group-color"
                  value={groupColor} 
                  onChange={e => setGroupColor(e.target.value)} 
                  className="w-10 h-10 rounded"
                />
                <div 
                  className="w-full h-10 rounded" 
                  style={{ backgroundColor: `${groupColor}30` }}
                />
              </div>
            </div>
            
            <Separator className="my-2" />
            
            <div className="space-y-2">
              <Label>Select Dogs</Label>
              <div className="border rounded-md p-4 max-h-60 overflow-y-auto">
                {dogsData.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">No dogs available</p>
                ) : (
                  <div className="space-y-2">
                    {dogsData.map(dog => (
                      <div 
                        key={dog.dog_id} 
                        className={`flex items-center justify-between p-2 rounded-md cursor-pointer ${
                          selectedDogs.includes(dog.dog_id) 
                            ? 'bg-primary/10' 
                            : 'hover:bg-muted'
                        }`}
                        onClick={() => toggleDogSelection(dog.dog_id)}
                      >
                        <div className="flex items-center">
                          <Dog className="h-4 w-4 mr-2" />
                          <span>{dog.dog_name}</span>
                        </div>
                        <Badge variant={selectedDogs.includes(dog.dog_id) ? "default" : "outline"}>
                          {selectedDogs.includes(dog.dog_id) ? (
                            <Check className="h-3 w-3" />
                          ) : (
                            <Plus className="h-3 w-3" />
                          )}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="text-sm text-muted-foreground">
                {selectedDogs.length} dog(s) selected
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {editingGroup ? 'Save Changes' : 'Create Group'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DogGroupsPanel;
