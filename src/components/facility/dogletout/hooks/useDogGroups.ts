
import { useState, useCallback, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { DogGroup } from './types/dogGroupTypes';
import * as dogGroupsApi from './api/dogGroupsApi';

export type { DogGroup } from './types/dogGroupTypes';

export const useDogGroups = () => {
  const [groups, setGroups] = useState<DogGroup[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Fetch all dog groups
  const fetchGroups = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await dogGroupsApi.fetchDogGroups();
      setGroups(data);
    } catch (error) {
      console.error('Error fetching dog groups:', error);
      toast({
        title: 'Error',
        description: 'Failed to load dog groups',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Add a new dog group
  const addGroup = useCallback(async (
    name: string, 
    color: string = 'blue', 
    description?: string
  ) => {
    setIsLoading(true);
    try {
      const newGroup = await dogGroupsApi.addDogGroup(name, color, description);
      
      // Add the new group to the state
      setGroups(prev => [...prev, newGroup]);

      toast({
        title: 'Group Created',
        description: `Dog group "${name}" has been created`
      });

      return newGroup.id;
    } catch (error) {
      console.error('Error adding dog group:', error);
      toast({
        title: 'Error',
        description: 'Failed to create dog group',
        variant: 'destructive'
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Update an existing dog group
  const updateGroup = useCallback(async (
    id: string,
    name: string,
    color: string = 'blue',
    description?: string
  ) => {
    setIsLoading(true);
    try {
      const updatedGroup = await dogGroupsApi.updateDogGroup(id, name, color, description);

      // Update the group in state
      setGroups(prev => prev.map(group => 
        group.id === id 
          ? { 
              ...group, 
              name: updatedGroup.name, 
              description: updatedGroup.description, 
              color: updatedGroup.color 
            } 
          : group
      ));

      toast({
        title: 'Group Updated',
        description: `Dog group "${name}" has been updated`
      });

      return updatedGroup;
    } catch (error) {
      console.error('Error updating dog group:', error);
      toast({
        title: 'Error',
        description: 'Failed to update dog group',
        variant: 'destructive'
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Delete a dog group
  const deleteGroup = useCallback(async (id: string) => {
    setIsLoading(true);
    try {
      await dogGroupsApi.deleteDogGroup(id);

      // Update the state
      setGroups(prev => prev.filter(group => group.id !== id));

      toast({
        title: 'Group Deleted',
        description: 'Dog group has been deleted'
      });
    } catch (error) {
      console.error('Error deleting dog group:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete dog group',
        variant: 'destructive'
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Add a dog to a group
  const addDogToGroup = useCallback(async (groupId: string, dogId: string) => {
    try {
      await dogGroupsApi.addDogToGroup(groupId, dogId);

      // Update the state
      setGroups(prev => prev.map(group => {
        if (group.id === groupId) {
          return {
            ...group,
            dogIds: [...(group.dogIds || []), dogId],
            members: [...(group.members || []), dogId]
          };
        }
        return group;
      }));

      toast({
        title: 'Dog Added',
        description: 'Dog has been added to the group'
      });
    } catch (error) {
      console.error('Error adding dog to group:', error);
      toast({
        title: 'Error',
        description: 'Failed to add dog to group',
        variant: 'destructive'
      });
      throw error;
    }
  }, [toast]);

  // Remove a dog from a group
  const removeDogFromGroup = useCallback(async (groupId: string, dogId: string) => {
    try {
      await dogGroupsApi.removeDogFromGroup(groupId, dogId);

      // Update the state
      setGroups(prev => prev.map(group => {
        if (group.id === groupId) {
          return {
            ...group,
            dogIds: (group.dogIds || []).filter(id => id !== dogId),
            members: (group.members || []).filter(id => id !== dogId)
          };
        }
        return group;
      }));

      toast({
        title: 'Dog Removed',
        description: 'Dog has been removed from the group'
      });
    } catch (error) {
      console.error('Error removing dog from group:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove dog from group',
        variant: 'destructive'
      });
      throw error;
    }
  }, [toast]);

  // Initial fetch of dog groups
  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  return {
    groups,
    isLoading,
    fetchGroups,
    addGroup,
    updateGroup,
    deleteGroup,
    addDogToGroup,
    removeDogFromGroup
  };
};
