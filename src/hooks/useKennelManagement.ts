
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { KennelUnit, KennelAssignment, KennelCleaning, KennelMaintenance, KennelCleaningSchedule } from '@/types/kennel';
import { toast } from 'sonner';

export const useKennelManagement = () => {
  const [kennelUnits, setKennelUnits] = useState<KennelUnit[]>([]);
  const [kennelAssignments, setKennelAssignments] = useState<KennelAssignment[]>([]);
  const [cleaningRecords, setCleaningRecords] = useState<KennelCleaning[]>([]);
  const [maintenanceRecords, setMaintenanceRecords] = useState<KennelMaintenance[]>([]);
  const [cleaningSchedules, setCleaningSchedules] = useState<KennelCleaningSchedule[]>([]);
  const [loading, setLoading] = useState({
    units: false,
    assignments: false,
    cleaning: false,
    maintenance: false,
    schedules: false
  });
  const [error, setError] = useState<string | null>(null);

  // Fetch kennel units
  const fetchKennelUnits = useCallback(async () => {
    setLoading(prev => ({ ...prev, units: true }));
    try {
      const { data, error } = await supabase
        .from('kennel_units')
        .select('*')
        .order('name');
      
      if (error) throw error;
      
      setKennelUnits(data || []);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching kennel units:', err);
      setError(err.message);
      toast.error('Failed to fetch kennel units');
    } finally {
      setLoading(prev => ({ ...prev, units: false }));
    }
  }, []);

  // Fetch kennel assignments with dog details
  const fetchKennelAssignments = useCallback(async () => {
    setLoading(prev => ({ ...prev, assignments: true }));
    try {
      const { data, error } = await supabase
        .from('kennel_assignments')
        .select(`
          *,
          dogs:dog_id (
            name, 
            breed, 
            gender
          ),
          kennel_unit:kennel_unit_id (
            name,
            unit_type,
            location
          )
        `)
        .order('start_date', { ascending: false });
      
      if (error) throw error;
      
      // Transform the data to match our KennelAssignment interface
      const formattedData = data?.map(item => ({
        ...item,
        dog: item.dogs,
        kennel_unit: item.kennel_unit
      })) || [];
      
      setKennelAssignments(formattedData);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching kennel assignments:', err);
      setError(err.message);
      toast.error('Failed to fetch kennel assignments');
    } finally {
      setLoading(prev => ({ ...prev, assignments: false }));
    }
  }, []);

  // Fetch cleaning records
  const fetchCleaningRecords = useCallback(async () => {
    setLoading(prev => ({ ...prev, cleaning: true }));
    try {
      const { data, error } = await supabase
        .from('kennel_cleaning')
        .select(`
          *,
          kennel_unit:kennel_unit_id (
            name
          )
        `)
        .order('cleaning_date', { ascending: false });
      
      if (error) throw error;
      
      setCleaningRecords(data || []);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching cleaning records:', err);
      setError(err.message);
      toast.error('Failed to fetch cleaning records');
    } finally {
      setLoading(prev => ({ ...prev, cleaning: false }));
    }
  }, []);

  // Fetch maintenance records
  const fetchMaintenanceRecords = useCallback(async () => {
    setLoading(prev => ({ ...prev, maintenance: true }));
    try {
      const { data, error } = await supabase
        .from('kennel_maintenance')
        .select(`
          *,
          kennel_unit:kennel_unit_id (
            name
          )
        `)
        .order('maintenance_date', { ascending: false });
      
      if (error) throw error;
      
      setMaintenanceRecords(data || []);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching maintenance records:', err);
      setError(err.message);
      toast.error('Failed to fetch maintenance records');
    } finally {
      setLoading(prev => ({ ...prev, maintenance: false }));
    }
  }, []);

  // Fetch cleaning schedules
  const fetchCleaningSchedules = useCallback(async () => {
    setLoading(prev => ({ ...prev, schedules: true }));
    try {
      const { data, error } = await supabase
        .from('kennel_cleaning_schedule')
        .select(`
          *,
          kennel_unit:kennel_unit_id (
            name
          )
        `)
        .order('created_at');
      
      if (error) throw error;
      
      setCleaningSchedules(data || []);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching cleaning schedules:', err);
      setError(err.message);
      toast.error('Failed to fetch cleaning schedules');
    } finally {
      setLoading(prev => ({ ...prev, schedules: false }));
    }
  }, []);

  // Add kennel unit
  const addKennelUnit = async (kennelUnit: Omit<KennelUnit, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('kennel_units')
        .insert(kennelUnit)
        .select()
        .single();
      
      if (error) throw error;
      
      setKennelUnits(prev => [...prev, data]);
      toast.success('Kennel unit added successfully');
      return data;
    } catch (err: any) {
      console.error('Error adding kennel unit:', err);
      toast.error('Failed to add kennel unit');
      throw err;
    }
  };

  // Update kennel unit
  const updateKennelUnit = async (id: string, updates: Partial<KennelUnit>) => {
    try {
      const { data, error } = await supabase
        .from('kennel_units')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      setKennelUnits(prev => 
        prev.map(unit => unit.id === id ? { ...unit, ...data } : unit)
      );
      toast.success('Kennel unit updated successfully');
      return data;
    } catch (err: any) {
      console.error('Error updating kennel unit:', err);
      toast.error('Failed to update kennel unit');
      throw err;
    }
  };

  // Delete kennel unit
  const deleteKennelUnit = async (id: string) => {
    try {
      const { error } = await supabase
        .from('kennel_units')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setKennelUnits(prev => prev.filter(unit => unit.id !== id));
      toast.success('Kennel unit deleted successfully');
    } catch (err: any) {
      console.error('Error deleting kennel unit:', err);
      toast.error('Failed to delete kennel unit');
      throw err;
    }
  };

  // Add kennel assignment
  const addKennelAssignment = async (assignment: Omit<KennelAssignment, 'id' | 'created_at'>) => {
    try {
      // First, check if the dog is already assigned to another unit
      const { data: existingAssignment, error: checkError } = await supabase
        .from('kennel_assignments')
        .select('*')
        .eq('dog_id', assignment.dog_id)
        .is('end_date', null)
        .maybeSingle();
      
      if (checkError) throw checkError;
      
      if (existingAssignment) {
        toast.error('This dog is already assigned to a kennel unit');
        throw new Error('Dog already has an active kennel assignment');
      }
      
      // Then, add the new assignment
      const { data, error } = await supabase
        .from('kennel_assignments')
        .insert(assignment)
        .select(`
          *,
          dogs:dog_id (
            name, 
            breed, 
            gender
          ),
          kennel_unit:kennel_unit_id (
            name,
            unit_type,
            location
          )
        `)
        .single();
      
      if (error) throw error;
      
      // Update kennel unit status to occupied
      await supabase
        .from('kennel_units')
        .update({ status: 'occupied' })
        .eq('id', assignment.kennel_unit_id);
      
      // Fetch kennel units again to refresh the status
      fetchKennelUnits();
      
      // Transform the data to match our KennelAssignment interface
      const formattedData = {
        ...data,
        dog: data.dogs,
        kennel_unit: data.kennel_unit
      };
      
      setKennelAssignments(prev => [formattedData, ...prev]);
      toast.success('Dog assigned to kennel successfully');
      return formattedData;
    } catch (err: any) {
      console.error('Error assigning dog to kennel:', err);
      toast.error('Failed to assign dog to kennel');
      throw err;
    }
  };

  // End kennel assignment
  const endKennelAssignment = async (id: string, kennelUnitId: string) => {
    try {
      const { data, error } = await supabase
        .from('kennel_assignments')
        .update({ end_date: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      // Update kennel unit status to available
      await supabase
        .from('kennel_units')
        .update({ status: 'available' })
        .eq('id', kennelUnitId);
      
      // Fetch kennel units again to refresh the status
      fetchKennelUnits();
      
      setKennelAssignments(prev => 
        prev.map(assignment => assignment.id === id ? { ...assignment, ...data } : assignment)
      );
      toast.success('Kennel assignment ended successfully');
      return data;
    } catch (err: any) {
      console.error('Error ending kennel assignment:', err);
      toast.error('Failed to end kennel assignment');
      throw err;
    }
  };

  // Add cleaning record
  const addCleaningRecord = async (cleaning: Omit<KennelCleaning, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('kennel_cleaning')
        .insert(cleaning)
        .select(`
          *,
          kennel_unit:kennel_unit_id (
            name
          )
        `)
        .single();
      
      if (error) throw error;
      
      setCleaningRecords(prev => [data, ...prev]);
      toast.success('Cleaning record added successfully');
      return data;
    } catch (err: any) {
      console.error('Error adding cleaning record:', err);
      toast.error('Failed to add cleaning record');
      throw err;
    }
  };

  // Add maintenance record
  const addMaintenanceRecord = async (maintenance: Omit<KennelMaintenance, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('kennel_maintenance')
        .insert(maintenance)
        .select(`
          *,
          kennel_unit:kennel_unit_id (
            name
          )
        `)
        .single();
      
      if (error) throw error;
      
      // If the status is 'in-progress', update the kennel unit status to 'maintenance'
      if (maintenance.status === 'in-progress' || maintenance.status === 'scheduled') {
        await supabase
          .from('kennel_units')
          .update({ status: 'maintenance' })
          .eq('id', maintenance.kennel_unit_id);
        
        // Fetch kennel units again to refresh the status
        fetchKennelUnits();
      }
      
      setMaintenanceRecords(prev => [data, ...prev]);
      toast.success('Maintenance record added successfully');
      return data;
    } catch (err: any) {
      console.error('Error adding maintenance record:', err);
      toast.error('Failed to add maintenance record');
      throw err;
    }
  };

  // Update maintenance record
  const updateMaintenanceRecord = async (id: string, updates: Partial<KennelMaintenance>) => {
    try {
      const { data, error } = await supabase
        .from('kennel_maintenance')
        .update(updates)
        .eq('id', id)
        .select(`
          *,
          kennel_unit:kennel_unit_id (
            name
          )
        `)
        .single();
      
      if (error) throw error;
      
      // If the status is 'completed', update the kennel unit status to 'available'
      if (updates.status === 'completed') {
        await supabase
          .from('kennel_units')
          .update({ status: 'available' })
          .eq('id', data.kennel_unit_id);
        
        // Fetch kennel units again to refresh the status
        fetchKennelUnits();
      }
      
      setMaintenanceRecords(prev => 
        prev.map(record => record.id === id ? { ...record, ...data } : record)
      );
      toast.success('Maintenance record updated successfully');
      return data;
    } catch (err: any) {
      console.error('Error updating maintenance record:', err);
      toast.error('Failed to update maintenance record');
      throw err;
    }
  };

  // Add cleaning schedule
  const addCleaningSchedule = async (schedule: Omit<KennelCleaningSchedule, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('kennel_cleaning_schedule')
        .insert(schedule)
        .select(`
          *,
          kennel_unit:kennel_unit_id (
            name
          )
        `)
        .single();
      
      if (error) throw error;
      
      setCleaningSchedules(prev => [...prev, data]);
      toast.success('Cleaning schedule added successfully');
      return data;
    } catch (err: any) {
      console.error('Error adding cleaning schedule:', err);
      toast.error('Failed to add cleaning schedule');
      throw err;
    }
  };

  // Update cleaning schedule
  const updateCleaningSchedule = async (id: string, updates: Partial<KennelCleaningSchedule>) => {
    try {
      const { data, error } = await supabase
        .from('kennel_cleaning_schedule')
        .update(updates)
        .eq('id', id)
        .select(`
          *,
          kennel_unit:kennel_unit_id (
            name
          )
        `)
        .single();
      
      if (error) throw error;
      
      setCleaningSchedules(prev => 
        prev.map(schedule => schedule.id === id ? { ...schedule, ...data } : schedule)
      );
      toast.success('Cleaning schedule updated successfully');
      return data;
    } catch (err: any) {
      console.error('Error updating cleaning schedule:', err);
      toast.error('Failed to update cleaning schedule');
      throw err;
    }
  };

  // Delete cleaning schedule
  const deleteCleaningSchedule = async (id: string) => {
    try {
      const { error } = await supabase
        .from('kennel_cleaning_schedule')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setCleaningSchedules(prev => prev.filter(schedule => schedule.id !== id));
      toast.success('Cleaning schedule deleted successfully');
    } catch (err: any) {
      console.error('Error deleting cleaning schedule:', err);
      toast.error('Failed to delete cleaning schedule');
      throw err;
    }
  };

  // Fetch all data
  const fetchAllData = useCallback(() => {
    fetchKennelUnits();
    fetchKennelAssignments();
    fetchCleaningRecords();
    fetchMaintenanceRecords();
    fetchCleaningSchedules();
  }, [
    fetchKennelUnits, 
    fetchKennelAssignments, 
    fetchCleaningRecords, 
    fetchMaintenanceRecords, 
    fetchCleaningSchedules
  ]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  return {
    kennelUnits,
    kennelAssignments,
    cleaningRecords,
    maintenanceRecords,
    cleaningSchedules,
    loading,
    error,
    fetchKennelUnits,
    fetchKennelAssignments,
    fetchCleaningRecords,
    fetchMaintenanceRecords,
    fetchCleaningSchedules,
    fetchAllData,
    addKennelUnit,
    updateKennelUnit,
    deleteKennelUnit,
    addKennelAssignment,
    endKennelAssignment,
    addCleaningRecord,
    addMaintenanceRecord,
    updateMaintenanceRecord,
    addCleaningSchedule,
    updateCleaningSchedule,
    deleteCleaningSchedule
  };
};
