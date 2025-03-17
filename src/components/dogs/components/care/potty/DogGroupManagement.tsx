
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Plus, Users, Pencil, Trash2, Save } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  fetchDogGroups,
  fetchGroupMembers,
  createDogGroup,
  updateDogGroup,
  deleteDogGroup,
  addDogToGroup,
  removeDogFromGroup,
  DogGroup,
  DogGroupMember
} from '@/services/dailyCare/dogGroupsService';
import { DogCareStatus } from '@/types/dailyCare';

interface DogGroupManagementProps {
  dogs: DogCareStatus[];
  onRefresh?: () => void;
}

const DogGroupManagement: React.FC<DogGroupManagementProps> = ({ dogs, onRefresh }) => {
  const [groups, setGroups] = useState<DogGroup[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [groupMembers, setGroupMembers] = useState<DogGroupMember[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingGroup, setEditingGroup] = useState<DogGroup | null>(null);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDescription, setNewGroupDescription] = useState('');
  const [newGroupColor, setNewGroupColor] = useState('blue');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const { toast } = useToast();

  // Load groups on component mount
  useEffect(() => {
    loadGroups();
  }, []);

  // Load group members when a group is selected
  useEffect(() => {
    if (selectedGroup) {
      loadGroupMembers(selectedGroup);
    }
  }, [selectedGroup]);

  // Load all dog groups
  const loadGroups = async () => {
    try {
      setIsLoading(true);
      const dogGroups = await fetchDogGroups();
      setGroups(dogGroups);
      
      // Select the first group by default if there is one
      if (dogGroups.length > 0 && !selectedGroup) {
        setSelectedGroup(dogGroups[0].id);
      }
    } catch (error) {
      console.error('Error loading dog groups:', error);
      toast({
        title: 'Error',
        description: 'Failed to load dog groups.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Load members of a specific group
  const loadGroupMembers = async (groupId: string) => {
    try {
      setIsLoading(true);
      const members = await fetchGroupMembers(groupId);
      setGroupMembers(members);
    } catch (error) {
      console.error('Error loading group members:', error);
      toast({
        title: 'Error',
        description: 'Failed to load group members.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle adding a new group
  const handleAddGroup = async () => {
    if (!newGroupName.trim()) {
      toast({
        title: 'Error',
        description: 'Group name is required.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsLoading(true);
      await createDogGroup({
        name: newGroupName,
        description: newGroupDescription,
        color: newGroupColor,
      });
      
      toast({
        title: 'Success',
        description: 'Group created successfully.',
      });
      
      // Reset form
      setNewGroupName('');
      setNewGroupDescription('');
      setNewGroupColor('blue');
      setDialogOpen(false);
      
      // Reload groups
      await loadGroups();
      
    } catch (error) {
      console.error('Error creating dog group:', error);
      toast({
        title: 'Error',
        description: 'Failed to create group.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle updating a group
  const handleUpdateGroup = async () => {
    if (!editingGroup || !newGroupName.trim()) {
      toast({
        title: 'Error',
        description: 'Group name is required.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsLoading(true);
      await updateDogGroup(editingGroup.id, {
        name: newGroupName,
        description: newGroupDescription,
        color: newGroupColor,
      });
      
      toast({
        title: 'Success',
        description: 'Group updated successfully.',
      });
      
      // Reset form and state
      setNewGroupName('');
      setNewGroupDescription('');
      setNewGroupColor('blue');
      setIsEditing(false);
      setEditingGroup(null);
      setDialogOpen(false);
      
      // Reload groups
      await loadGroups();
      
    } catch (error) {
      console.error('Error updating dog group:', error);
      toast({
        title: 'Error',
        description: 'Failed to update group.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle deleting a group
  const handleDeleteGroup = async () => {
    if (!selectedGroup) return;

    try {
      setIsLoading(true);
      await deleteDogGroup(selectedGroup);
      
      toast({
        title: 'Success',
        description: 'Group deleted successfully.',
      });
      
      // Reset state
      setSelectedGroup(null);
      setGroupMembers([]);
      setConfirmDeleteOpen(false);
      
      // Reload groups
      await loadGroups();
      
    } catch (error) {
      console.error('Error deleting dog group:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete group.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle adding a dog to the current group
  const handleAddDogToGroup = async (dogId: string) => {
    if (!selectedGroup) return;

    try {
      setIsLoading(true);
      await addDogToGroup(dogId, selectedGroup);
      
      // Reload group members
      await loadGroupMembers(selectedGroup);
      
      toast({
        title: 'Success',
        description: 'Dog added to group.',
      });
      
    } catch (error) {
      console.error('Error adding dog to group:', error);
      toast({
        title: 'Error',
        description: 'Failed to add dog to group.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle removing a dog from the current group
  const handleRemoveDogFromGroup = async (dogId: string) => {
    if (!selectedGroup) return;

    try {
      setIsLoading(true);
      await removeDogFromGroup(dogId, selectedGroup);
      
      // Reload group members
      await loadGroupMembers(selectedGroup);
      
      toast({
        title: 'Success',
        description: 'Dog removed from group.',
      });
      
    } catch (error) {
      console.error('Error removing dog from group:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove dog from group.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Set up editing a group
  const setupEditGroup = (group: DogGroup) => {
    setIsEditing(true);
    setEditingGroup(group);
    setNewGroupName(group.name);
    setNewGroupDescription(group.description || '');
    setNewGroupColor(group.color || 'blue');
    setDialogOpen(true);
  };

  // Reset the form for adding a new group
  const setupAddGroup = () => {
    setIsEditing(false);
    setEditingGroup(null);
    setNewGroupName('');
    setNewGroupDescription('');
    setNewGroupColor('blue');
    setDialogOpen(true);
  };

  // Check if a dog is a member of the current group
  const isDogInGroup = (dogId: string): boolean => {
    return groupMembers.some(member => member.dog_id === dogId);
  };

  // Get color class for a group
  const getGroupColorClass = (color: string | null): string => {
    switch (color) {
      case 'blue': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'teal': return 'bg-teal-100 text-teal-800 border-teal-300';
      case 'yellow': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'red': return 'bg-red-100 text-red-800 border-red-300';
      case 'green': return 'bg-green-100 text-green-800 border-green-300';
      case 'purple': return 'bg-purple-100 text-purple-800 border-purple-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center text-xl">
            <Users className="h-5 w-5 mr-2" />
            Dog Group Management
          </CardTitle>
          <Button 
            onClick={setupAddGroup} 
            size="sm"
            className="gap-1"
          >
            <Plus className="h-4 w-4" />
            New Group
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="groups">
          <TabsList className="mb-4">
            <TabsTrigger value="groups">Groups</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
          </TabsList>
          
          <TabsContent value="groups">
            {groups.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">No dog groups created yet.</p>
                <Button onClick={setupAddGroup}>Create First Group</Button>
              </div>
            ) : (
              <div className="space-y-4">
                {groups.map(group => (
                  <div 
                    key={group.id}
                    className={`p-4 rounded-md border flex justify-between items-center ${
                      selectedGroup === group.id ? 'ring-2 ring-primary ring-offset-2' : ''
                    } ${getGroupColorClass(group.color)}`}
                  >
                    <div>
                      <h3 className="font-medium">{group.name}</h3>
                      {group.description && (
                        <p className="text-sm mt-1">{group.description}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedGroup(group.id)}
                        className={selectedGroup === group.id ? 'bg-primary/20' : ''}
                      >
                        {selectedGroup === group.id ? 'Selected' : 'Select'}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setupEditGroup(group)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="members">
            {!selectedGroup ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Select a group first to manage its members</p>
              </div>
            ) : (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="font-medium text-lg">
                      {groups.find(g => g.id === selectedGroup)?.name || 'Group'} Members
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {groupMembers.length} dogs in this group
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setConfirmDeleteOpen(true)}
                      className="text-destructive hover:text-destructive gap-1"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete Group
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto p-1">
                  {dogs.map(dog => {
                    const inGroup = isDogInGroup(dog.dog_id);
                    return (
                      <div 
                        key={dog.dog_id}
                        className={`
                          flex items-center justify-between p-3 rounded-md border
                          ${inGroup ? 'bg-primary-50 border-primary-200' : 'bg-card border-muted'}
                          hover:bg-accent transition-colors
                        `}
                      >
                        <div className="flex items-center">
                          {dog.dog_photo ? (
                            <img 
                              src={dog.dog_photo} 
                              alt={dog.dog_name} 
                              className="h-8 w-8 rounded-full object-cover mr-2"
                            />
                          ) : (
                            <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center mr-2">
                              <span className="text-xs font-medium">{dog.dog_name.charAt(0)}</span>
                            </div>
                          )}
                          <span className="font-medium">{dog.dog_name}</span>
                        </div>
                        
                        <Button
                          variant={inGroup ? "outline" : "default"}
                          size="sm"
                          onClick={() => inGroup 
                            ? handleRemoveDogFromGroup(dog.dog_id) 
                            : handleAddDogToGroup(dog.dog_id)
                          }
                          disabled={isLoading}
                        >
                          {inGroup ? 'Remove' : 'Add'}
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        {/* Add/Edit Group Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{isEditing ? 'Edit Group' : 'Add New Group'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="name">Group Name</Label>
                <Input
                  id="name"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  placeholder="e.g., Blue Group"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description (optional)</Label>
                <Input
                  id="description"
                  value={newGroupDescription}
                  onChange={(e) => setNewGroupDescription(e.target.value)}
                  placeholder="e.g., Compatible dogs that can go out together"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="color">Color</Label>
                <Select
                  value={newGroupColor}
                  onValueChange={setNewGroupColor}
                >
                  <SelectTrigger id="color">
                    <SelectValue placeholder="Select a color" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="blue">Blue</SelectItem>
                    <SelectItem value="teal">Teal</SelectItem>
                    <SelectItem value="yellow">Yellow</SelectItem>
                    <SelectItem value="red">Red</SelectItem>
                    <SelectItem value="green">Green</SelectItem>
                    <SelectItem value="purple">Purple</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={isEditing ? handleUpdateGroup : handleAddGroup} disabled={isLoading} className="gap-1">
                <Save className="h-4 w-4" />
                {isEditing ? 'Update Group' : 'Add Group'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Delete Confirmation Dialog */}
        <Dialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Delete Group</DialogTitle>
            </DialogHeader>
            <div className="py-2">
              <p>Are you sure you want to delete this group? This action cannot be undone.</p>
              <p className="text-sm text-muted-foreground mt-2">
                Note: This will remove all dogs from the group but won't delete the dogs themselves.
              </p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setConfirmDeleteOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteGroup} disabled={isLoading}>
                Delete Group
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default DogGroupManagement;
