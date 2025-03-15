
import React, { createContext, useContext, useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

type DailyCareContextType = {
  fetchDogCareLogs: (dogId: string) => Promise<DailyCarelog[]>;
  fetchCareTaskPresets: () => Promise<CareTaskPreset[]>;
  addCareLog: (data: CareLogFormData) => Promise<DailyCarelog | null>;
  deleteCareLog: (id: string) => Promise<boolean>;
  addCareTaskPreset: (category: string, taskName: string) => Promise<CareTaskPreset | null>;
  deleteCareTaskPreset: (id: string) => Promise<boolean>;
  fetchAllDogsWithCareStatus: (date?: Date) => Promise<DogCareStatus[]>;
  loading: boolean;
};

const DailyCareContext = createContext<DailyCareContextType | undefined>(undefined);

export const DailyCareProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchDogCareLogs = useCallback(async (dogId: string): Promise<DailyCarelog[]> => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('daily_care_logs')
        .select('*')
        .eq('dog_id', dogId)
        .order('timestamp', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching care logs:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch care logs',
        variant: 'destructive',
      });
      return [];
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const fetchCareTaskPresets = useCallback(async (): Promise<CareTaskPreset[]> => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('care_task_presets')
        .select('*')
        .order('category', { ascending: true })
        .order('task_name', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching care task presets:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch care task presets',
        variant: 'destructive',
      });
      return [];
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const createMockDogFlags = useCallback((dogs: any[]): Record<string, DogFlag[]> => {
    // Mock flag data - in a real implementation, fetch this from a database table
    const mockDogFlags: Record<string, DogFlag[]> = {};

    // Add some mock flags for random dogs as an example
    if (dogs && dogs.length > 0) {
      // Add "in heat" flag to a random dog
      const randomIndex1 = Math.floor(Math.random() * dogs.length);
      mockDogFlags[dogs[randomIndex1].id] = [{ type: 'in_heat' }];
      
      // Add "incompatible" flags to two random dogs
      if (dogs.length > 2) {
        // Fixed: Use let instead of const for variables that will be reassigned
        let randomIndex2 = Math.floor(Math.random() * dogs.length);
        // Make sure randomIndex2 is different from randomIndex1
        if (randomIndex2 === randomIndex1) {
          // If it's the same, choose the next or first index
          randomIndex2 = (randomIndex1 + 1) % dogs.length;
        }
        
        let randomIndex3 = Math.floor(Math.random() * dogs.length);
        // Make sure randomIndex3 is different from both randomIndex1 and randomIndex2
        if (randomIndex3 === randomIndex1 || randomIndex3 === randomIndex2) {
          // If it's the same as either, choose the next available index
          randomIndex3 = (randomIndex2 + 1) % dogs.length;
          if (randomIndex3 === randomIndex1) {
            randomIndex3 = (randomIndex3 + 1) % dogs.length;
          }
        }
        
        mockDogFlags[dogs[randomIndex2].id] = [{ 
          type: 'incompatible', 
          incompatible_with: [dogs[randomIndex3].id] 
        }];
        
        mockDogFlags[dogs[randomIndex3].id] = [{ 
          type: 'incompatible', 
          incompatible_with: [dogs[randomIndex2].id] 
        }];
      }
      
      // Add "special attention" flag to another random dog
      if (dogs.length > 3) {
        let randomIndex4 = Math.floor(Math.random() * dogs.length);
        while (
          randomIndex4 === randomIndex1 || 
          randomIndex4 === (dogs.length > 2 ? randomIndex2 : -1) ||
          randomIndex4 === (dogs.length > 2 ? randomIndex3 : -1)
        ) {
          randomIndex4 = Math.floor(Math.random() * dogs.length);
        }
        
        mockDogFlags[dogs[randomIndex4].id] = [{ 
          type: 'special_attention',
          value: 'Needs medication'
        }];
      }
    }
    
    return mockDogFlags;
  }, []);

  const fetchAllDogsWithCareStatus = useCallback(async (date = new Date()): Promise<DogCareStatus[]> => {
    setLoading(true);
    try {
      // Fetch all dogs
      const { data: dogs, error: dogsError } = await supabase
        .from('dogs')
        .select('id, name, breed, color, photo_url')
        .order('name');

      if (dogsError) throw dogsError;

      // For each dog, fetch their most recent care log for the specified date
      const todayStart = new Date(date);
      todayStart.setHours(0, 0, 0, 0);
      
      const todayEnd = new Date(date);
      todayEnd.setHours(23, 59, 59, 999);

      // Generate mock flags for dogs
      const mockDogFlags = createMockDogFlags(dogs);

      const statusPromises = dogs.map(async (dog) => {
        const { data: logs, error: logsError } = await supabase
          .from('daily_care_logs')
          .select('*')
          .eq('dog_id', dog.id)
          .gte('timestamp', todayStart.toISOString())
          .lte('timestamp', todayEnd.toISOString())
          .order('timestamp', { ascending: false })
          .limit(1);

        if (logsError) throw logsError;

        return {
          dog_id: dog.id,
          dog_name: dog.name,
          dog_photo: dog.photo_url,
          breed: dog.breed,
          color: dog.color,
          last_care: logs && logs.length > 0 ? {
            category: logs[0].category,
            task_name: logs[0].task_name,
            timestamp: logs[0].timestamp,
          } : null,
          flags: mockDogFlags[dog.id] || []
        } as DogCareStatus;
      });

      const statuses = await Promise.all(statusPromises);
      return statuses;
    } catch (error) {
      console.error('Error fetching all dogs care status:', error);
      toast({
        title: 'Error',
        description: 'Failed to load dogs care status',
        variant: 'destructive',
      });
      return [];
    } finally {
      setLoading(false);
    }
  }, [toast, createMockDogFlags]);

  const addCareLog = useCallback(async (data: CareLogFormData): Promise<DailyCarelog | null> => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'You must be logged in to add care logs',
        variant: 'destructive',
      });
      return null;
    }

    setLoading(true);
    try {
      // We'll need to store flags in a separate table in a real implementation
      // For now, store them in the notes field as JSON for simplicity
      const notesWithFlags = data.flags && data.flags.length > 0
        ? `${data.notes || ''}\n\nFLAGS: ${JSON.stringify(data.flags)}`
        : data.notes;

      const { data: newLog, error } = await supabase
        .from('daily_care_logs')
        .insert({
          dog_id: data.dog_id,
          created_by: user.id,
          category: data.category,
          task_name: data.task_name,
          timestamp: data.timestamp.toISOString(),
          notes: notesWithFlags || null,
        })
        .select()
        .single();

      if (error) throw error;
      
      toast({
        title: 'Success',
        description: 'Care log added successfully',
      });
      
      return newLog;
    } catch (error) {
      console.error('Error adding care log:', error);
      toast({
        title: 'Error',
        description: 'Failed to add care log',
        variant: 'destructive',
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  const deleteCareLog = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('daily_care_logs')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: 'Success',
        description: 'Care log deleted successfully',
      });
      
      return true;
    } catch (error) {
      console.error('Error deleting care log:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete care log',
        variant: 'destructive',
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const addCareTaskPreset = useCallback(async (category: string, taskName: string): Promise<CareTaskPreset | null> => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'You must be logged in to add task presets',
        variant: 'destructive',
      });
      return null;
    }

    setLoading(true);
    try {
      const { data: newPreset, error } = await supabase
        .from('care_task_presets')
        .insert({
          category,
          task_name: taskName,
          is_default: false,
          breeder_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      
      toast({
        title: 'Success',
        description: 'Task preset added successfully',
      });
      
      return newPreset;
    } catch (error) {
      console.error('Error adding task preset:', error);
      toast({
        title: 'Error',
        description: 'Failed to add task preset',
        variant: 'destructive',
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  const deleteCareTaskPreset = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('care_task_presets')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: 'Success',
        description: 'Task preset deleted successfully',
      });
      
      return true;
    } catch (error) {
      console.error('Error deleting task preset:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete task preset',
        variant: 'destructive',
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  return (
    <DailyCareContext.Provider
      value={{
        fetchDogCareLogs,
        fetchCareTaskPresets,
        addCareLog,
        deleteCareLog,
        addCareTaskPreset,
        deleteCareTaskPreset,
        fetchAllDogsWithCareStatus,
        loading,
      }}
    >
      {children}
    </DailyCareContext.Provider>
  );
};

export const useDailyCare = () => {
  const context = useContext(DailyCareContext);
  if (context === undefined) {
    throw new Error('useDailyCare must be used within a DailyCareProvider');
  }
  return context;
};
