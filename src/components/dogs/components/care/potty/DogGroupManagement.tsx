
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  fetchDogGroups, 
  createDogGroup, 
  updateDogGroup, 
  deleteDogGroup 
} from '@/services/dailyCare/dogGroupsService';
import { Users, Plus } from 'lucide-react';
import { DogCareStatus } from '@/types/dailyCare';
import DogGroupFormDialog from './components/DogGroupFormDialog';
import DogGroupCard from './components/DogGroupCard';

interface DogGroupManagementProps {
  dogs: DogCareStatus[];
  onGroupsUpdated: () => void;
}

const DogGroupManagement: React.FC<DogGroupManagementProps> = ({ dogs, onGroupsUpdated }) => {
  const [groups, setGroups] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<any | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>('blue');
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');

  // Load groups on component mount
  useEffect(() => {
    loadGroups();
  }, []);

  // Load dog groups
  const loadGroups = async () => {
    try {
      setIsLoading(true);
      const dogGroups = await fetchDogGroups();
      setGroups(dogGroups);
    } catch (error) {
      console.error('Error loading dog groups:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle creating or updating a group
  const handleSaveGroup = async () => {
    if (!groupName.trim()) return;

    try {
      setIsLoading(true);
      
      if (editingGroup) {
        // Update existing group
        await updateDogGroup(editingGroup.id, {
          name: groupName,
          description: groupDescription,
          color: selectedColor
        });
      } else {
        // Create new group
        await createDogGroup({
          name: groupName,
          description: groupDescription,
          color: selectedColor
        });
      }
      
      // Refresh groups
      await loadGroups();
      onGroupsUpdated();
      
      // Reset form
      resetForm();
      setDialogOpen(false);
    } catch (error) {
      console.error('Error saving dog group:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle deleting a group
  const handleDeleteGroup = async (groupId: string) => {
    if (!confirm('Are you sure you want to delete this group?')) return;

    try {
      setIsLoading(true);
      await deleteDogGroup(groupId);
      
      // Refresh groups
      await loadGroups();
      onGroupsUpdated();
    } catch (error) {
      console.error('Error deleting dog group:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Open dialog for creating a new group
  const openCreateDialog = () => {
    resetForm();
    setDialogOpen(true);
  };

  // Open dialog for editing a group
  const openEditDialog = (group: any) => {
    setEditingGroup(group);
    setGroupName(group.name);
    setGroupDescription(group.description || '');
    setSelectedColor(group.color || 'blue');
    setDialogOpen(true);
  };

  // Reset form fields
  const resetForm = () => {
    setEditingGroup(null);
    setGroupName('');
    setGroupDescription('');
    setSelectedColor('blue');
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl">
          <Users className="inline mr-2 h-5 w-5" />
          Dog Groups
        </CardTitle>
        <Button onClick={openCreateDialog} size="sm">
          <Plus className="mr-1 h-4 w-4" />
          New Group
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading && groups.length === 0 ? (
          <div className="text-center py-6">Loading groups...</div>
        ) : groups.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <p>No dog groups created yet.</p>
            <p className="mt-2">Create groups to organize dogs that can be let out together for potty breaks.</p>
            <Button onClick={openCreateDialog} className="mt-4">
              <Plus className="mr-1 h-4 w-4" />
              Create First Group
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {groups.map(group => (
              <DogGroupCard 
                key={group.id}
                group={group}
                onEdit={openEditDialog}
                onDelete={handleDeleteGroup}
              />
            ))}
          </div>
        )}

        {/* Form Dialog Component */}
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
      </CardContent>
    </Card>
  );
};

export default DogGroupManagement;
