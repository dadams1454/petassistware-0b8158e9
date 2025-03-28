
import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export interface DogGroup {
  id: string;
  name: string;
  description?: string;
  color?: string;
  dogIds: string[]; // Changed from members to dogIds and made required
  members?: string[];
  created_at?: string;
}

export const useDogGroups = () => {
  const [groups, setGroups] = useState<DogGroup[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Fetch all dog groups
  const fetchGroups = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('dog_groups')
        .select(`
          id,
          name,
          description,
          color,
          created_at,
          dog_group_members(dog_id)
        `)
        .order('name');

      if (error) throw error;

      // Transform the data to include members
      const transformedGroups = data.map(group => ({
        id: group.id,
        name: group.name,
        description: group.description,
        color: group.color,
        created_at: group.created_at,
        dogIds: group.dog_group_members?.map((member: any) => member.dog_id) || [],
        members: group.dog_group_members?.map((member: any) => member.dog_id) || []
      }));

      setGroups(transformedGroups);
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
      const { data, error } = await supabase
        .from('dog_groups')
        .insert([{ name, color, description }])
        .select()
        .single();

      if (error) throw error;

      // Add the new group to the state
      setGroups(prev => [...prev, { 
        id: data.id, 
        name: data.name,
        description: data.description,
        color: data.color,
        created_at: data.created_at,
        dogIds: [], // Add empty dogIds array for new groups
        members: []
      }]);

      toast({
        title: 'Group Created',
        description: `Dog group "${name}" has been created`
      });

      return data;
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
      const { data, error } = await supabase
        .from('dog_groups')
        .update({ name, color, description })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      // Update the group in state
      setGroups(prev => prev.map(group => 
        group.id === id 
          ? { 
              ...group, 
              name: data.name, 
              description: data.description, 
              color: data.color 
            } 
          : group
      ));

      toast({
        title: 'Group Updated',
        description: `Dog group "${name}" has been updated`
      });

      return data;
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
      // First, delete all group members
      const { error: membersError } = await supabase
        .from('dog_group_members')
        .delete()
        .eq('group_id', id);

      if (membersError) throw membersError;

      // Then delete the group
      const { error } = await supabase
        .from('dog_groups')
        .delete()
        .eq('id', id);

      if (error) throw error;

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
      const { error } = await supabase
        .from('dog_group_members')
        .insert({ group_id: groupId, dog_id: dogId });

      if (error) throw error;

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
      const { error } = await supabase
        .from('dog_group_members')
        .delete()
        .eq('group_id', groupId)
        .eq('dog_id', dogId);

      if (error) throw error;

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
