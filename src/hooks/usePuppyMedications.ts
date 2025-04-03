
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Medication, MedicationAdministration } from '@/types/health';
import { addDays, format, isAfter, isBefore, isToday } from 'date-fns';

export const usePuppyMedications = (puppyId: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch medications
  const { 
    data: medications = [], 
    isLoading, 
    error,
    refetch
  } = useQuery({
    queryKey: ['medications', puppyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('puppy_medications')
        .select('*')
        .eq('puppy_id', puppyId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Medication[];
    },
    enabled: !!puppyId
  });

  // Fetch medication administrations for a specific medication
  const getMedicationAdministrations = async (medicationId: string) => {
    const { data, error } = await supabase
      .from('puppy_medication_administrations')
      .select('*')
      .eq('medication_id', medicationId)
      .order('administered_at', { ascending: false });
    
    if (error) throw error;
    return data as MedicationAdministration[];
  };

  // Add medication
  const addMedication = useMutation({
    mutationFn: async (medicationData: Omit<Medication, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('puppy_medications')
        .insert({
          puppy_id: puppyId,
          medication_name: medicationData.medication_name,
          dosage: medicationData.dosage,
          dosage_unit: medicationData.dosage_unit,
          frequency: medicationData.frequency,
          start_date: medicationData.start_date,
          end_date: medicationData.end_date,
          administration_route: medicationData.administration_route,
          notes: medicationData.notes,
          is_active: medicationData.is_active
        })
        .select();
        
      if (error) throw error;
      return data[0] as Medication;
    },
    onSuccess: () => {
      toast({
        title: "Medication Added",
        description: "Medication has been added successfully"
      });
      queryClient.invalidateQueries({ queryKey: ['medications', puppyId] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to add medication: ${(error as Error).message}`,
        variant: "destructive"
      });
    }
  });

  // Update medication
  const updateMedication = useMutation({
    mutationFn: async (
      { id, medicationData }: { id: string; medicationData: Partial<Medication> }
    ) => {
      const { data, error } = await supabase
        .from('puppy_medications')
        .update(medicationData)
        .eq('id', id)
        .select();
        
      if (error) throw error;
      return data[0] as Medication;
    },
    onSuccess: () => {
      toast({
        title: "Medication Updated",
        description: "Medication has been updated successfully"
      });
      queryClient.invalidateQueries({ queryKey: ['medications', puppyId] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update medication: ${(error as Error).message}`,
        variant: "destructive"
      });
    }
  });

  // Delete medication
  const deleteMedication = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('puppy_medications')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      toast({
        title: "Medication Deleted",
        description: "Medication has been deleted successfully"
      });
      queryClient.invalidateQueries({ queryKey: ['medications', puppyId] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete medication: ${(error as Error).message}`,
        variant: "destructive"
      });
    }
  });

  // Log medication administration
  const logMedicationAdministration = useMutation({
    mutationFn: async (
      { medicationId, administrationData }: { 
        medicationId: string; 
        administrationData: Omit<MedicationAdministration, 'id' | 'medication_id' | 'created_at'> 
      }
    ) => {
      // First, insert the administration record
      const { data: adminData, error: adminError } = await supabase
        .from('puppy_medication_administrations')
        .insert({
          medication_id: medicationId,
          administered_at: administrationData.administered_at,
          administered_by: administrationData.administered_by,
          notes: administrationData.notes
        })
        .select();
        
      if (adminError) throw adminError;
      
      // Then, update the medication's last_administered timestamp
      const { data: medData, error: medError } = await supabase
        .from('puppy_medications')
        .update({ 
          last_administered: administrationData.administered_at
        })
        .eq('id', medicationId)
        .select();
        
      if (medError) throw medError;
      
      return {
        administration: adminData[0] as MedicationAdministration,
        medication: medData[0] as Medication
      };
    },
    onSuccess: () => {
      toast({
        title: "Medication Administered",
        description: "Medication administration has been logged successfully"
      });
      queryClient.invalidateQueries({ queryKey: ['medications', puppyId] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to log administration: ${(error as Error).message}`,
        variant: "destructive"
      });
    }
  });

  // Calculate dosage based on weight
  const calculateDosage = (
    baselineDosage: number, 
    baselineWeight: number,
    currentWeight: number,
    unit: string
  ) => {
    if (!baselineDosage || !baselineWeight || !currentWeight) return 0;
    
    const calculatedDosage = (baselineDosage / baselineWeight) * currentWeight;
    return parseFloat(calculatedDosage.toFixed(2));
  };

  // Get medication status (for UI display)
  const getMedicationStatus = (medication: Medication) => {
    const now = new Date();
    const startDate = new Date(medication.start_date);
    const endDate = medication.end_date ? new Date(medication.end_date) : null;
    
    // Not started yet
    if (isAfter(startDate, now)) {
      return {
        status: 'pending',
        statusLabel: 'Pending',
        statusColor: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
      };
    }
    
    // Ended
    if (endDate && isBefore(endDate, now)) {
      return {
        status: 'completed',
        statusLabel: 'Completed',
        statusColor: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
      };
    }
    
    // Active but check if it's due today
    const lastAdministered = medication.last_administered 
      ? new Date(medication.last_administered) 
      : null;
    
    let nextDueDate = null;
    
    if (lastAdministered) {
      switch (medication.frequency) {
        case 'daily':
          nextDueDate = addDays(lastAdministered, 1);
          break;
        case 'twice-daily':
          nextDueDate = addDays(lastAdministered, 0.5);
          break;
        case 'weekly':
          nextDueDate = addDays(lastAdministered, 7);
          break;
        case 'monthly':
          nextDueDate = addDays(lastAdministered, 30);
          break;
        default:
          nextDueDate = null;
      }
    }
    
    // Due today
    if (nextDueDate && isToday(nextDueDate)) {
      return {
        status: 'due',
        statusLabel: 'Due Today',
        statusColor: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
      };
    }
    
    // Overdue
    if (nextDueDate && isBefore(nextDueDate, now)) {
      return {
        status: 'overdue',
        statusLabel: 'Overdue',
        statusColor: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
      };
    }
    
    // Active and on schedule
    return {
      status: 'active',
      statusLabel: 'Active',
      statusColor: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
    };
  };

  // Medicine frequency options for dropdown
  const frequencyOptions = [
    { value: 'daily', label: 'Once Daily' },
    { value: 'twice-daily', label: 'Twice Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'biweekly', label: 'Every 2 Weeks' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'as-needed', label: 'As Needed (PRN)' },
    { value: 'custom', label: 'Custom Schedule' }
  ];

  // Administration route options for dropdown
  const routeOptions = [
    { value: 'oral', label: 'Oral' },
    { value: 'topical', label: 'Topical' },
    { value: 'injection', label: 'Injection' },
    { value: 'subcutaneous', label: 'Subcutaneous' },
    { value: 'intramuscular', label: 'Intramuscular' },
    { value: 'intravenous', label: 'Intravenous' },
    { value: 'inhalation', label: 'Inhalation' },
    { value: 'otic', label: 'Otic (Ear)' },
    { value: 'ophthalmic', label: 'Ophthalmic (Eye)' },
    { value: 'rectal', label: 'Rectal' }
  ];

  return {
    medications,
    isLoading,
    error,
    refetch,
    frequencyOptions,
    routeOptions,
    getMedicationAdministrations,
    addMedication: addMedication.mutateAsync,
    updateMedication: updateMedication.mutateAsync,
    deleteMedication: deleteMedication.mutateAsync,
    logMedicationAdministration: logMedicationAdministration.mutateAsync,
    calculateDosage,
    getMedicationStatus
  };
};
