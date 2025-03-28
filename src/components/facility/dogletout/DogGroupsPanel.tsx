
import React, { useState, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Trash2, Edit2, Plus, X } from 'lucide-react';
import { DogCareStatus } from '@/types/dailyCare';
import { useDogGroups, DogGroup } from './hooks/useDogGroups';
import { useToast } from '@/components/ui/use-toast';

interface DogGroupsPanelProps {
  dogsData: DogCareStatus[];
  onGroupsUpdated?: () => void;
}

const DogGroupsPanel: React.FC<DogGroupsPanelProps> = ({ 
  dogsData,
  onGroupsUpdated 
}) => {
  const { toast } = useToast();
  const { 
    groups, 
    isLoading, 
    addGroup, 
    addDogToGroup, 
    removeDogFromGroup 
  } = useDogGroups();
  
  const [selectedGroup, setSelectedGroup] = useState<DogGroup | null>(null);
  const [showAddDogDialog, setShowAddDogDialog] = useState(false);
  const [showAddGroupDialog, setShowAddGroupDialog] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupColor, setNewGroupColor] = useState('#1890ff');
  
  // Handle creating a new group
  const handleAddGroup = useCallback(async () => {
    if (!newGroupName.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a group name',
        variant: 'destructive'
      });
      return;
    }
    
    const groupId = await addGroup(newGroupName, newGroupColor);
    if (groupId) {
      setShowAddGroupDialog(false);
      setNewGroupName('');
      setNewGroupColor('#1890ff');
      if (onGroupsUpdated) onGroupsUpdated();
    }
  }, [newGroupName, newGroupColor, addGroup, toast, onGroupsUpdated]);
  
  // Get list of dogs that are not in the selected group
  const availableDogs = useCallback(() => {
    if (!selectedGroup) return [];
    
    return dogsData.filter(
      dog => !selectedGroup.dogIds.includes(dog.dog_id)
    );
  }, [dogsData, selectedGroup]);
  
  // Add dog to selected group
  const handleAddDogToGroup = useCallback(async (dogId: string) => {
    if (!selectedGroup) return;
    
    await addDogToGroup(selectedGroup.id, dogId);
    setShowAddDogDialog(false);
    if (onGroupsUpdated) onGroupsUpdated();
  }, [selectedGroup, addDogToGroup, onGroupsUpdated]);
  
  // Remove dog from selected group
  const handleRemoveDogFromGroup = useCallback(async (dogId: string) => {
    if (!selectedGroup) return;
    
    await removeDogFromGroup(selectedGroup.id, dogId);
    if (onGroupsUpdated) onGroupsUpdated();
  }, [selectedGroup, removeDogFromGroup, onGroupsUpdated]);
  
  const renderGroupCard = (group: DogGroup) => {
    const isSelected = selectedGroup?.id === group.id;
    const groupDogs = dogsData.filter(dog => group.dogIds.includes(dog.dog_id));
    
    return (
      <Card 
        key={group.id} 
        className={`mb-4 overflow-hidden transition-all ${isSelected ? 'ring-2 ring-primary' : ''}`}
      >
        <div 
          className="h-2" 
          style={{ backgroundColor: group.color || '#1890ff' }}
        />
        <CardContent className="pt-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">{group.name}</h3>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  setSelectedGroup(group);
                  setShowAddDogDialog(true);
                }}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Dog
              </Button>
              
              {!isSelected ? (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setSelectedGroup(group)}
                >
                  <Edit2 className="h-4 w-4 mr-1" />
                  Manage
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedGroup(null)}
                >
                  <X className="h-4 w-4 mr-1" />
                  Close
                </Button>
              )}
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {group.dogIds.length === 0 ? (
              <p className="text-sm text-muted-foreground">No dogs in this group</p>
            ) : (
              groupDogs.map(dog => (
                <Badge 
                  key={dog.dog_id} 
                  variant="outline"
                  className="flex items-center"
                >
                  {dog.dog_name}
                  {isSelected && (
                    <X 
                      className="h-3 w-3 ml-1 cursor-pointer" 
                      onClick={() => handleRemoveDogFromGroup(dog.dog_id)}
                    />
                  )}
                </Badge>
              ))
            )}
          </div>
          
          {group.description && (
            <p className="text-sm text-muted-foreground">{group.description}</p>
          )}
        </CardContent>
      </Card>
    );
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Dog Groups</h2>
        <Button
          onClick={() => setShowAddGroupDialog(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          New Group
        </Button>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : groups.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground mb-4">No dog groups found. Create your first group to organize your dogs.</p>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {groups.map(renderGroupCard)}
        </div>
      )}
      
      {/* Add Group Dialog */}
      <Dialog open={showAddGroupDialog} onOpenChange={setShowAddGroupDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Dog Group</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="group-name" className="text-right">
                Group Name
              </label>
              <Input
                id="group-name"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="group-color" className="text-right">
                Group Color
              </label>
              <div className="col-span-3 flex items-center gap-2">
                <div 
                  className="w-6 h-6 rounded-full border" 
                  style={{ backgroundColor: newGroupColor }}
                />
                <input
                  id="group-color"
                  type="color"
                  value={newGroupColor}
                  onChange={(e) => setNewGroupColor(e.target.value)}
                  className="w-full h-10"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddGroupDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddGroup}>
              Create Group
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Add Dog to Group Dialog */}
      <Dialog open={showAddDogDialog} onOpenChange={setShowAddDogDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Dogs to Group</DialogTitle>
          </DialogHeader>
          {selectedGroup && (
            <div className="py-4">
              <h3 className="font-medium mb-2">
                Select dogs to add to <span className="font-bold">{selectedGroup.name}</span>
              </h3>
              
              {availableDogs().length === 0 ? (
                <p className="text-muted-foreground">
                  All dogs are already in this group.
                </p>
              ) : (
                <div className="flex flex-wrap gap-2 mt-4">
                  {availableDogs().map(dog => (
                    <Badge 
                      key={dog.dog_id} 
                      variant="outline"
                      className="cursor-pointer hover:bg-primary/10 transition-colors"
                      onClick={() => handleAddDogToGroup(dog.dog_id)}
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
            <Button variant="outline" onClick={() => setShowAddDogDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DogGroupsPanel;
