
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
      const { data: newLog, error } = await supabase
        .from('daily_care_logs')
        .insert({
          dog_id: data.dog_id,
          created_by: user.id,
          category: data.category,
          task_name: data.task_name,
          timestamp: data.timestamp.toISOString(),
          notes: data.notes || null,
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
