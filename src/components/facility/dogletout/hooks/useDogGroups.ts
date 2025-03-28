
import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export interface DogGroup {
  id: string;
  name: string;
  description: string | null;
  color: string | null;
  dogIds: string[];
}

export const useDogGroups = () => {
  const [groups, setGroups] = useState<DogGroup[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Fetch dog groups and their members
  const fetchGroups = useCallback(async () => {
    setIsLoading(true);
    try {
      // First, get all groups
      const { data: groupsData, error: groupsError } = await supabase
        .from('dog_groups')
        .select('*');
      
      if (groupsError) throw groupsError;
      
      // For each group, get its members
      const groupsWithDogs = await Promise.all(
        groupsData.map(async (group) => {
          const { data: membersData, error: membersError } = await supabase
            .from('dog_group_members')
            .select('dog_id')
            .eq('group_id', group.id);
          
          if (membersError) throw membersError;
          
          return {
            id: group.id,
            name: group.name,
            description: group.description,
            color: group.color || '#1890ff',
            dogIds: membersData.map(member => member.dog_id)
          };
        })
      );
      
      setGroups(groupsWithDogs);
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
  
  // Add a new group
  const addGroup = useCallback(async (name: string, color?: string, description?: string) => {
    try {
      // Insert new group
      const { data, error } = await supabase
        .from('dog_groups')
        .insert({
          name,
          color: color || '#1890ff',
          description: description || null
        })
        .select()
        .single();
      
      if (error) throw error;
      
      // Update local state
      setGroups(prev => [...prev, {
        id: data.id,
        name: data.name,
        description: data.description,
        color: data.color,
        dogIds: []
      }]);
      
      toast({
        title: 'Group Created',
        description: `Dog group "${name}" has been created`
      });
      
      return data.id;
    } catch (error) {
      console.error('Error creating dog group:', error);
      toast({
        title: 'Error',
        description: 'Failed to create dog group',
        variant: 'destructive'
      });
      return null;
    }
  }, [toast]);
  
  // Add a dog to a group
  const addDogToGroup = useCallback(async (groupId: string, dogId: string) => {
    try {
      // Check if the dog is already in the group
      const { data: existingMember, error: checkError } = await supabase
        .from('dog_group_members')
        .select('*')
        .eq('group_id', groupId)
        .eq('dog_id', dogId)
        .maybeSingle();
      
      if (checkError) throw checkError;
      
      // If the dog is already in the group, don't add it again
      if (existingMember) return;
      
      // Add dog to group
      const { error } = await supabase
        .from('dog_group_members')
        .insert({
          group_id: groupId,
          dog_id: dogId
        });
      
      if (error) throw error;
      
      // Update local state
      setGroups(prev => prev.map(group => {
        if (group.id === groupId) {
          return {
            ...group,
            dogIds: [...group.dogIds, dogId]
          };
        }
        return group;
      }));
    } catch (error) {
      console.error('Error adding dog to group:', error);
      toast({
        title: 'Error',
        description: 'Failed to add dog to group',
        variant: 'destructive'
      });
    }
  }, [toast]);
  
  // Remove a dog from a group
  const removeDogFromGroup = useCallback(async (groupId: string, dogId: string) => {
    try {
      // Remove dog from group
      const { error } = await supabase
        .from('dog_group_members')
        .delete()
        .eq('group_id', groupId)
        .eq('dog_id', dogId);
      
      if (error) throw error;
      
      // Update local state
      setGroups(prev => prev.map(group => {
        if (group.id === groupId) {
          return {
            ...group,
            dogIds: group.dogIds.filter(id => id !== dogId)
          };
        }
        return group;
      }));
    } catch (error) {
      console.error('Error removing dog from group:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove dog from group',
        variant: 'destructive'
      });
    }
  }, [toast]);
  
  // Load groups on component mount
  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);
  
  return {
    groups,
    isLoading,
    fetchGroups,
    addGroup,
    addDogToGroup,
    removeDogFromGroup
  };
};
