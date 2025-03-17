
import { supabase } from '@/integrations/supabase/client';

export interface DogGroup {
  id: string;
  name: string;
  description: string | null;
  color: string | null;
  created_at: string;
}

export interface DogGroupMember {
  id: string;
  dog_id: string;
  group_id: string;
  created_at: string;
  dog?: {
    name: string;
    photo_url?: string;
  };
}

// Fetch all dog groups
export const fetchDogGroups = async (): Promise<DogGroup[]> => {
  const { data, error } = await supabase
    .from('dog_groups')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching dog groups:', error);
    throw error;
  }

  return data || [];
};

// Fetch members of a specific group
export const fetchGroupMembers = async (groupId: string): Promise<DogGroupMember[]> => {
  const { data, error } = await supabase
    .from('dog_group_members')
    .select(`
      *,
      dog:dog_id (
        name,
        photo_url
      )
    `)
    .eq('group_id', groupId);

  if (error) {
    console.error('Error fetching group members:', error);
    throw error;
  }

  return data || [];
};

// Add a dog to a group
export const addDogToGroup = async (dogId: string, groupId: string): Promise<DogGroupMember> => {
  const { data, error } = await supabase
    .from('dog_group_members')
    .insert([{ dog_id: dogId, group_id: groupId }])
    .select()
    .single();

  if (error) {
    console.error('Error adding dog to group:', error);
    throw error;
  }

  return data;
};

// Remove a dog from a group
export const removeDogFromGroup = async (dogId: string, groupId: string): Promise<void> => {
  const { error } = await supabase
    .from('dog_group_members')
    .delete()
    .match({ dog_id: dogId, group_id: groupId });

  if (error) {
    console.error('Error removing dog from group:', error);
    throw error;
  }
};

// Create a new dog group
export const createDogGroup = async (group: Omit<DogGroup, 'id' | 'created_at'>): Promise<DogGroup> => {
  const { data, error } = await supabase
    .from('dog_groups')
    .insert([group])
    .select()
    .single();

  if (error) {
    console.error('Error creating dog group:', error);
    throw error;
  }

  return data;
};

// Update an existing dog group
export const updateDogGroup = async (id: string, updates: Partial<DogGroup>): Promise<DogGroup> => {
  const { data, error } = await supabase
    .from('dog_groups')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating dog group:', error);
    throw error;
  }

  return data;
};

// Delete a dog group
export const deleteDogGroup = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('dog_groups')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting dog group:', error);
    throw error;
  }
};
