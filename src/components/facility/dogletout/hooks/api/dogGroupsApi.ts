
import { supabase } from '@/integrations/supabase/client';
import { DogGroup } from '../types/dogGroupTypes';
import { useToast } from '@/components/ui/use-toast';

/**
 * Fetches all dog groups with their members
 */
export const fetchDogGroups = async () => {
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

    return transformedGroups;
  } catch (error) {
    console.error('Error fetching dog groups:', error);
    throw error;
  }
};

/**
 * Adds a new dog group
 */
export const addDogGroup = async (
  name: string,
  color: string = 'blue',
  description?: string
) => {
  try {
    const { data, error } = await supabase
      .from('dog_groups')
      .insert([{ name, color, description }])
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      name: data.name,
      description: data.description,
      color: data.color,
      created_at: data.created_at,
      dogIds: [], // Initialize with empty dogIds array
      members: []
    };
  } catch (error) {
    console.error('Error adding dog group:', error);
    throw error;
  }
};

/**
 * Updates an existing dog group
 */
export const updateDogGroup = async (
  id: string,
  name: string,
  color: string = 'blue',
  description?: string
) => {
  try {
    const { data, error } = await supabase
      .from('dog_groups')
      .update({ name, color, description })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.error('Error updating dog group:', error);
    throw error;
  }
};

/**
 * Deletes a dog group and its members
 */
export const deleteDogGroup = async (id: string) => {
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

    return true;
  } catch (error) {
    console.error('Error deleting dog group:', error);
    throw error;
  }
};

/**
 * Adds a dog to a group
 */
export const addDogToGroup = async (groupId: string, dogId: string) => {
  try {
    const { error } = await supabase
      .from('dog_group_members')
      .insert({ group_id: groupId, dog_id: dogId });

    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error adding dog to group:', error);
    throw error;
  }
};

/**
 * Removes a dog from a group
 */
export const removeDogFromGroup = async (groupId: string, dogId: string) => {
  try {
    const { error } = await supabase
      .from('dog_group_members')
      .delete()
      .eq('group_id', groupId)
      .eq('dog_id', dogId);

    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error removing dog from group:', error);
    throw error;
  }
};
