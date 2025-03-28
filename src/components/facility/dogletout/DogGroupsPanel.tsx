
import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { DogCareStatus } from '@/types/dailyCare';
import { useDogGroups, DogGroup } from './hooks/useDogGroups';
import { useToast } from '@/components/ui/use-toast';
import DogGroupCard from './components/DogGroupCard';
import AddGroupDialog from './components/AddGroupDialog';
import AddDogDialog from './components/AddDogDialog';

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
  const getAvailableDogs = useCallback(() => {
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
  const handleRemoveDogFromGroup = useCallback(async (groupId: string, dogId: string) => {
    await removeDogFromGroup(groupId, dogId);
    if (onGroupsUpdated) onGroupsUpdated();
  }, [removeDogFromGroup, onGroupsUpdated]);

  const handleSelectGroup = useCallback((group: DogGroup) => {
    setSelectedGroup(group);
  }, []);

  const handleAddDogToGroupClick = useCallback((group: DogGroup) => {
    setSelectedGroup(group);
    setShowAddDogDialog(true);
  }, []);
  
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
        <div className="p-8 text-center border rounded-lg">
          <p className="text-muted-foreground mb-4">No dog groups found. Create your first group to organize your dogs.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {groups.map(group => (
            <DogGroupCard 
              key={group.id}
              group={group}
              isSelected={selectedGroup?.id === group.id}
              dogsData={dogsData}
              onSelect={handleSelectGroup}
              onClose={() => setSelectedGroup(null)}
              onAddDog={handleAddDogToGroupClick}
              onRemoveDog={handleRemoveDogFromGroup}
            />
          ))}
        </div>
      )}
      
      {/* Add Group Dialog */}
      <AddGroupDialog 
        open={showAddGroupDialog}
        onOpenChange={setShowAddGroupDialog}
        newGroupName={newGroupName}
        onGroupNameChange={setNewGroupName}
        newGroupColor={newGroupColor}
        onGroupColorChange={setNewGroupColor}
        onAddGroup={handleAddGroup}
      />
      
      {/* Add Dog to Group Dialog */}
      <AddDogDialog
        open={showAddDogDialog}
        onOpenChange={setShowAddDogDialog}
        selectedGroup={selectedGroup}
        availableDogs={getAvailableDogs()}
        onAddDogToGroup={handleAddDogToGroup}
      />
    </div>
  );
};

export default DogGroupsPanel;
