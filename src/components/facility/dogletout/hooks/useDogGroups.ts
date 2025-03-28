
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { nanoid } from 'nanoid';

export interface DogGroup {
  id: string;
  name: string;
  color: string;
  dogIds: string[];
}

export const useDogGroups = () => {
  const { toast } = useToast();
  const [groups, setGroups] = useState<DogGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch all dog groups from the database
  const fetchGroups = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('dog_groups')
        .select(`
          *,
          dog_group_members(*)
        `)
        .order('name');
      
      if (error) throw error;
      
      // Transform the data to our DogGroup format
      const transformedGroups: DogGroup[] = data.map(group => ({
        id: group.id,
        name: group.name,
        color: group.color || '#4CAF50',
        dogIds: group.dog_group_members.map((member: any) => member.dog_id)
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
  const addGroup = useCallback(async (group: Omit<DogGroup, 'id'>) => {
    try {
      // First create the group
      const { data: groupData, error: groupError } = await supabase
        .from('dog_groups')
        .insert({
          name: group.name,
          color: group.color,
          description: `Group for ${group.name}`
        })
        .select()
        .single();
      
      if (groupError) throw groupError;
      
      // Then add the dogs to the group
      if (group.dogIds.length > 0) {
        const groupMembers = group.dogIds.map(dogId => ({
          group_id: groupData.id,
          dog_id: dogId
        }));
        
        const { error: membersError } = await supabase
          .from('dog_group_members')
          .insert(groupMembers);
        
        if (membersError) throw membersError;
      }
      
      // Add to local state
      setGroups(prev => [...prev, {
        ...group,
        id: groupData.id
      }]);
      
      return groupData.id;
    } catch (error) {
      console.error('Error adding dog group:', error);
      toast({
        title: 'Error',
        description: 'Failed to create dog group',
        variant: 'destructive'
      });
      throw error;
    }
  }, [toast]);
  
  // Update an existing group
  const updateGroup = useCallback(async (
    groupId: string, 
    updates: Partial<Omit<DogGroup, 'id'>>
  ) => {
    try {
      // First update the group details
      if (updates.name || updates.color) {
        const { error: groupError } = await supabase
          .from('dog_groups')
          .update({
            name: updates.name,
            color: updates.color
          })
          .eq('id', groupId);
        
        if (groupError) throw groupError;
      }
      
      // Then update the group members if dogIds have changed
      if (updates.dogIds) {
        // First delete all existing members
        const { error: deleteError } = await supabase
          .from('dog_group_members')
          .delete()
          .eq('group_id', groupId);
        
        if (deleteError) throw deleteError;
        
        // Then add the new members
        if (updates.dogIds.length > 0) {
          const groupMembers = updates.dogIds.map(dogId => ({
            group_id: groupId,
            dog_id: dogId
          }));
          
          const { error: membersError } = await supabase
            .from('dog_group_members')
            .insert(groupMembers);
          
          if (membersError) throw membersError;
        }
      }
      
      // Update local state
      setGroups(prev => prev.map(group => 
        group.id === groupId
          ? { ...group, ...updates }
          : group
      ));
    } catch (error) {
      console.error('Error updating dog group:', error);
      toast({
        title: 'Error',
        description: 'Failed to update dog group',
        variant: 'destructive'
      });
      throw error;
    }
  }, [toast]);
  
  // Remove a group
  const removeGroup = useCallback(async (groupId: string) => {
    try {
      // First delete all group members
      const { error: membersError } = await supabase
        .from('dog_group_members')
        .delete()
        .eq('group_id', groupId);
      
      if (membersError) throw membersError;
      
      // Then delete the group
      const { error: groupError } = await supabase
        .from('dog_groups')
        .delete()
        .eq('id', groupId);
      
      if (groupError) throw groupError;
      
      // Update local state
      setGroups(prev => prev.filter(group => group.id !== groupId));
    } catch (error) {
      console.error('Error removing dog group:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete dog group',
        variant: 'destructive'
      });
      throw error;
    }
  }, [toast]);
  
  // Load groups on mount
  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);
  
  return {
    groups,
    addGroup,
    updateGroup,
    removeGroup,
    refreshGroups: fetchGroups,
    isLoading
  };
};
