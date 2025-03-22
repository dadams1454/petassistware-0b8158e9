
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  fetchDogGroups, 
  createDogGroup, 
  updateDogGroup, 
  deleteDogGroup 
} from '@/services/dailyCare/dogGroupsService';
import { Users, Plus, Edit, Trash2, X } from 'lucide-react';
import { DogCareStatus } from '@/types/dailyCare';
import PottyBreakDogSelection from './PottyBreakDogSelection';

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
        {isLoading ? (
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
            {groups.map(group => {
              const colorClass = getColorClass(group.color);
              return (
                <Card key={group.id} className={`border ${colorClass}`}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-lg">{group.name}</h3>
                        {group.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {group.description}
                          </p>
                        )}
                      </div>
                      <div className="flex space-x-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => openEditDialog(group)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-red-500 hover:text-red-700 hover:bg-red-100"
                          onClick={() => handleDeleteGroup(group.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Create/Edit Group Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {editingGroup ? 'Edit Dog Group' : 'Create Dog Group'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Group Name</Label>
                <Input
                  id="name"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="Small Dogs, Kennels 1-4, etc."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Input
                  id="description"
                  value={groupDescription}
                  onChange={(e) => setGroupDescription(e.target.value)}
                  placeholder="Dogs that can be let out together"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="color">Group Color</Label>
                <Select
                  value={selectedColor}
                  onValueChange={setSelectedColor}
                >
                  <SelectTrigger id="color">
                    <SelectValue placeholder="Select a color" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="blue">Blue</SelectItem>
                    <SelectItem value="green">Green</SelectItem>
                    <SelectItem value="teal">Teal</SelectItem>
                    <SelectItem value="purple">Purple</SelectItem>
                    <SelectItem value="yellow">Yellow</SelectItem>
                    <SelectItem value="red">Red</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveGroup}
                disabled={!groupName.trim() || isLoading}
              >
                {isLoading ? 'Saving...' : editingGroup ? 'Update Group' : 'Create Group'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

// Utility function to get color classes based on group color
function getColorClass(color: string | null): string {
  switch (color) {
    case 'blue': return 'border-blue-300';
    case 'green': return 'border-green-300';
    case 'teal': return 'border-teal-300';
    case 'purple': return 'border-purple-300';
    case 'yellow': return 'border-yellow-300';
    case 'red': return 'border-red-300';
    default: return 'border-gray-300';
  }
}

export default DogGroupManagement;
