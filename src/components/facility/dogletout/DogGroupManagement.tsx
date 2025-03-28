
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useDogGroups } from './hooks/useDogGroups';
import { DogCareStatus } from '@/types/dailyCare';
import DogGroupCard from './components/DogGroupCard';
import DogGroupFormDialog from './components/DogGroupFormDialog';

interface DogGroupManagementProps {
  dogs: DogCareStatus[];
  onGroupsUpdated?: () => void;
}

const DogGroupManagement: React.FC<DogGroupManagementProps> = ({ 
  dogs,
  onGroupsUpdated
}) => {
  const { groups, isLoading, fetchGroups, addGroup } = useDogGroups();
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [selectedColor, setSelectedColor] = useState('blue');
  const [editingGroup, setEditingGroup] = useState<any | null>(null);
  
  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);
  
  const handleOpenDialog = (group: any | null = null) => {
    if (group) {
      setEditingGroup(group);
      setGroupName(group.name);
      setGroupDescription(group.description || '');
      setSelectedColor(group.color || 'blue');
    } else {
      setEditingGroup(null);
      setGroupName('');
      setGroupDescription('');
      setSelectedColor('blue');
    }
    setDialogOpen(true);
  };
  
  const handleSaveGroup = async () => {
    if (!groupName.trim()) return;
    
    try {
      if (editingGroup) {
        // Update existing group (not implemented yet)
        console.log('Update group:', { id: editingGroup.id, name: groupName, description: groupDescription, color: selectedColor });
      } else {
        // Create new group
        await addGroup(groupName, selectedColor, groupDescription);
      }
      
      setDialogOpen(false);
      setGroupName('');
      setGroupDescription('');
      setSelectedColor('blue');
      setEditingGroup(null);
      
      if (onGroupsUpdated) {
        onGroupsUpdated();
      }
    } catch (error) {
      console.error('Error saving group:', error);
    }
  };
  
  const handleDeleteGroup = async (groupId: string) => {
    try {
      // Delete group (not implemented yet)
      console.log('Delete group:', groupId);
      
      if (onGroupsUpdated) {
        onGroupsUpdated();
      }
    } catch (error) {
      console.error('Error deleting group:', error);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Dog Groups</h3>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="h-4 w-4 mr-2" />
          New Group
        </Button>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {groups.map(group => (
            <DogGroupCard 
              key={group.id}
              group={group}
              onEdit={() => handleOpenDialog(group)}
              onDelete={handleDeleteGroup}
            />
          ))}
          
          {groups.length === 0 && (
            <div className="col-span-full p-8 border rounded-md text-center">
              <p className="text-muted-foreground">No dog groups found. Create your first group to organize your dogs.</p>
            </div>
          )}
        </div>
      )}
      
      <DogGroupFormDialog 
        dialogOpen={dialogOpen}
        setDialogOpen={setDialogOpen}
        groupName={groupName}
        setGroupName={setGroupName}
        groupDescription={groupDescription}
        setGroupDescription={setGroupDescription}
        selectedColor={selectedColor}
        setSelectedColor={setSelectedColor}
        handleSaveGroup={handleSaveGroup}
        isLoading={isLoading}
        editingGroup={editingGroup}
      />
    </div>
  );
};

export default DogGroupManagement;
