
import { supabase } from '@/integrations/supabase/client';
import { 
  MedicationRecord, 
  MedicationFormData, 
  MedicationFrequency, 
  MedicationStatus,
  MedicationStats,
  MedicationSchedule 
} from '@/types/medication';
import { format, addDays, addWeeks, addMonths, compareAsc, parseISO } from 'date-fns';
import { Json } from '@/integrations/supabase/types';

// Helper function to cast Json to medication record
const castMedicationData = (data: any): MedicationRecord => {
  return {
    id: data.id,
    dog_id: data.dog_id,
    task_name: data.task_name || 'Medication',
    category: data.category || 'medication',
    status: data.status || MedicationStatus.ACTIVE,
    created_at: data.created_at,
    created_by: data.created_by || null,
    timestamp: data.timestamp || data.created_at, // Ensure timestamp exists
    medication_name: data.medication_name || '',
    dosage: data.dosage || '',
    dosage_unit: data.dosage_unit || '',
    frequency: data.frequency || MedicationFrequency.DAILY,
    route: data.route || undefined,
    start_date: data.start_date || null,
    end_date: data.end_date || null,
    next_due_date: data.next_due_date || null,
    medication_type: data.medication_type || 'treatment',
    prescription_id: data.prescription_id || null,
    refills_remaining: data.refills_remaining || 0,
    administered_by: data.administered_by || null,
    notes: data.notes || null,
    administrations: data.administrations || []
  };
};

/**
 * Calculate the next due date based on medication frequency
 */
export const calculateNextDueDate = (startDate: Date, frequency: MedicationFrequency): Date => {
  const today = new Date();
  let nextDue: Date;

  switch (frequency) {
    case MedicationFrequency.DAILY:
      // If already given today, next is tomorrow
      nextDue = addDays(today, 1);
      break;
    case MedicationFrequency.TWICE_DAILY:
      // If morning dose, next is evening; if evening, next is morning of next day
      // For simplicity, just use 12 hours from now
      nextDue = new Date(today.getTime() + 12 * 60 * 60 * 1000);
      break;
    case MedicationFrequency.WEEKLY:
      nextDue = addWeeks(startDate, 1);
      if (compareAsc(nextDue, today) <= 0) {
        // If the calculated date is in the past, calculate from today
        nextDue = addWeeks(today, 1);
      }
      break;
    case MedicationFrequency.BIWEEKLY:
      nextDue = addWeeks(startDate, 2);
      if (compareAsc(nextDue, today) <= 0) {
        nextDue = addWeeks(today, 2);
      }
      break;
    case MedicationFrequency.MONTHLY:
      nextDue = addMonths(startDate, 1);
      if (compareAsc(nextDue, today) <= 0) {
        nextDue = addMonths(today, 1);
      }
      break;
    case MedicationFrequency.QUARTERLY:
      nextDue = addMonths(startDate, 3);
      if (compareAsc(nextDue, today) <= 0) {
        nextDue = addMonths(today, 3);
      }
      break;
    case MedicationFrequency.ANNUALLY:
      nextDue = addMonths(startDate, 12);
      if (compareAsc(nextDue, today) <= 0) {
        nextDue = addMonths(today, 12);
      }
      break;
    case MedicationFrequency.AS_NEEDED:
    case MedicationFrequency.CUSTOM:
    default:
      // For as-needed or custom, don't set a specific next date
      nextDue = today;
      break;
  }

  return nextDue;
};

/**
 * Fetch medication records for multiple dogs
 */
export const getMedicationRecords = async (dogIds: string[]): Promise<MedicationRecord[]> => {
  try {
    // Use the daily_care_logs table instead of medication_records
    const { data, error } = await supabase
      .from('daily_care_logs')
      .select('*')
      .in('dog_id', dogIds)
      .eq('category', 'medication');
      
    if (error) throw error;
    
    // Cast the data to MedicationRecord type
    return data.map((item: any) => castMedicationData(item));
  } catch (error) {
    console.error('Error fetching medication records:', error);
    throw error;
  }
};

/**
 * Create a new medication record
 */
export const createMedicationRecord = async (data: MedicationFormData): Promise<MedicationRecord> => {
  try {
    // Set the next due date based on frequency if not provided
    if (!data.next_due_date && data.start_date) {
      data.next_due_date = calculateNextDueDate(data.start_date, data.frequency);
    }

    // Use daily_care_logs table
    const medicationData = {
      dog_id: data.dog_id,
      task_name: 'Medication',
      category: 'medication',
      status: MedicationStatus.ACTIVE,
      medication_name: data.medication_name,
      dosage: data.dosage,
      dosage_unit: data.dosage_unit,
      frequency: data.frequency,
      route: data.route,
      start_date: data.start_date ? format(data.start_date, 'yyyy-MM-dd') : null,
      end_date: data.end_date ? format(data.end_date, 'yyyy-MM-dd') : null,
      next_due_date: data.next_due_date ? format(data.next_due_date, 'yyyy-MM-dd') : null,
      medication_type: data.medication_type,
      prescription_id: data.prescription_id,
      refills_remaining: data.refills_remaining,
      created_by: data.created_by,
      timestamp: new Date().toISOString(),
      notes: data.notes,
      administrations: JSON.stringify([])
    };

    const { data: result, error } = await supabase
      .from('daily_care_logs')
      .insert(medicationData)
      .select()
      .single();

    if (error) throw error;
    
    return castMedicationData(result);
  } catch (error) {
    console.error('Error creating medication record:', error);
    throw error;
  }
};

/**
 * Fetch all medication records for a specific dog
 */
export const fetchDogMedications = async (dogId: string): Promise<MedicationRecord[]> => {
  try {
    const { data, error } = await supabase
      .from('daily_care_logs')
      .select('*')
      .eq('dog_id', dogId)
      .eq('category', 'medication');
      
    if (error) throw error;
    
    // Cast the data to ensure type safety
    return data.map(item => castMedicationData(item));
  } catch (error) {
    console.error('Error fetching dog medications:', error);
    throw error;
  }
};

/**
 * Get medication record by ID
 */
export const getMedicationById = async (medicationId: string): Promise<MedicationRecord | null> => {
  try {
    const { data, error } = await supabase
      .from('daily_care_logs')
      .select('*')
      .eq('id', medicationId)
      .eq('category', 'medication')
      .single();
      
    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw error;
    }
    
    return data ? castMedicationData(data) : null;
  } catch (error) {
    console.error(`Error fetching medication with ID ${medicationId}:`, error);
    throw error;
  }
};

/**
 * Update a medication record
 */
export const updateMedicationRecord = async (
  medicationId: string, 
  data: MedicationFormData
): Promise<MedicationRecord> => {
  try {
    // Calculate next due date if not provided
    if (!data.next_due_date && data.start_date) {
      data.next_due_date = calculateNextDueDate(data.start_date, data.frequency);
    }
    
    const updateData = {
      medication_name: data.medication_name,
      dosage: data.dosage,
      dosage_unit: data.dosage_unit,
      frequency: data.frequency,
      route: data.route,
      start_date: data.start_date ? format(data.start_date, 'yyyy-MM-dd') : null,
      end_date: data.end_date ? format(data.end_date, 'yyyy-MM-dd') : null,
      next_due_date: data.next_due_date ? format(data.next_due_date, 'yyyy-MM-dd') : null,
      medication_type: data.medication_type,
      prescription_id: data.prescription_id,
      refills_remaining: data.refills_remaining,
      notes: data.notes
    };
    
    const { data: updatedRecord, error } = await supabase
      .from('daily_care_logs')
      .update(updateData)
      .eq('id', medicationId)
      .select()
      .single();
      
    if (error) throw error;
    
    return castMedicationData(updatedRecord);
  } catch (error) {
    console.error('Error updating medication record:', error);
    throw error;
  }
};

/**
 * Record a medication administration
 */
export const recordMedicationAdministration = async (
  medicationId: string,
  administrationData: {
    timestamp: string;
    administered_by: string;
    notes?: string;
  }
): Promise<void> => {
  try {
    // Get the current medication record
    const { data: currentRecord, error: fetchError } = await supabase
      .from('daily_care_logs')
      .select('*')
      .eq('id', medicationId)
      .eq('category', 'medication')
      .single();
      
    if (fetchError) throw fetchError;
    
    // Ensure we have a valid record
    if (!currentRecord) {
      throw new Error(`Medication record with ID ${medicationId} not found`);
    }
    
    // Get existing administrations, or initialize if none
    const existingAdministrations = currentRecord.administrations || [];
    let parsedAdministrations;
    
    try {
      if (typeof existingAdministrations === 'string') {
        parsedAdministrations = JSON.parse(existingAdministrations);
      } else {
        parsedAdministrations = existingAdministrations;
      }
    } catch (e) {
      parsedAdministrations = [];
    }
    
    // Create new administration entry with unique ID
    const newAdministration = {
      id: crypto.randomUUID(),
      ...administrationData
    };
    
    // Add to the administrations array
    const updatedAdministrations = [
      ...parsedAdministrations,
      newAdministration
    ];

    // Calculate next due date based on frequency
    const medicationRecord = castMedicationData(currentRecord);
    const nextDueDate = calculateNextDueDate(
      new Date(administrationData.timestamp),
      medicationRecord.frequency
    );
    
    // Update the medication record with the new administration and next due date
    const { error: updateError } = await supabase
      .from('daily_care_logs')
      .update({
        administrations: JSON.stringify(updatedAdministrations),
        next_due_date: format(nextDueDate, 'yyyy-MM-dd'),
        last_administered: administrationData.timestamp
      })
      .eq('id', medicationId);
      
    if (updateError) throw updateError;
  } catch (error) {
    console.error('Error recording medication administration:', error);
    throw error;
  }
};

/**
 * Delete a medication record
 */
export const deleteMedicationRecord = async (medicationId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('daily_care_logs')
      .delete()
      .eq('id', medicationId)
      .eq('category', 'medication');
      
    if (error) throw error;
  } catch (error) {
    console.error('Error deleting medication record:', error);
    throw error;
  }
};

/**
 * Fetch all overdue medications
 */
export const fetchOverdueMedications = async (): Promise<MedicationRecord[]> => {
  try {
    const today = new Date();
    const todayStr = format(today, 'yyyy-MM-dd');
    
    const { data, error } = await supabase
      .from('daily_care_logs')
      .select('*')
      .eq('category', 'medication')
      .lt('next_due_date', todayStr)
      .is('end_date', null);
      
    if (error) throw error;
    
    return data.map(item => castMedicationData(item));
  } catch (error) {
    console.error('Error fetching overdue medications:', error);
    throw error;
  }
};

/**
 * Fetch upcoming medications
 */
export const fetchUpcomingMedications = async (daysAhead = 7): Promise<MedicationRecord[]> => {
  try {
    const today = new Date();
    const todayStr = format(today, 'yyyy-MM-dd');
    const futureDate = addDays(today, daysAhead);
    const futureDateStr = format(futureDate, 'yyyy-MM-dd');
    
    const { data, error } = await supabase
      .from('daily_care_logs')
      .select('*')
      .eq('category', 'medication')
      .gte('next_due_date', todayStr)
      .lte('next_due_date', futureDateStr);
      
    if (error) throw error;
    
    return data.map(item => castMedicationData(item));
  } catch (error) {
    console.error('Error fetching upcoming medications:', error);
    throw error;
  }
};

/**
 * Fetch medication statistics
 */
export const fetchMedicationStats = async (dogId: string): Promise<MedicationStats> => {
  try {
    const { data, error } = await supabase
      .from('daily_care_logs')
      .select('*')
      .eq('dog_id', dogId)
      .eq('category', 'medication');
      
    if (error) throw error;
    
    const medications = data.map(item => castMedicationData(item));
    
    // Calculate statistics
    const total = medications.length;
    const preventative = medications.filter(m => m.medication_type === 'preventative').length;
    const prescription = medications.filter(m => m.medication_type === 'prescription').length;
    const supplement = medications.filter(m => m.medication_type === 'supplement').length;
    const treatment = medications.filter(m => m.medication_type === 'treatment').length;
    const vaccine = medications.filter(m => m.medication_type === 'vaccine').length;
    
    const today = new Date();
    const todayStr = format(today, 'yyyy-MM-dd');
    
    const activeCount = medications.filter(m => m.status === MedicationStatus.ACTIVE).length;
    const completedCount = medications.filter(m => m.status === MedicationStatus.COMPLETED).length;
    const overdueCount = medications.filter(m => 
      m.status === MedicationStatus.ACTIVE && 
      m.next_due_date && 
      m.next_due_date < todayStr
    ).length;
    const upcomingCount = medications.filter(m => 
      m.status === MedicationStatus.ACTIVE && 
      m.next_due_date && 
      m.next_due_date >= todayStr
    ).length;
    
    // Calculate compliance rate (completed / (completed + overdue))
    const complianceRate = completedCount + overdueCount > 0 
      ? completedCount / (completedCount + overdueCount) * 100 
      : 100;
    
    return {
      total,
      preventative,
      prescription,
      supplement,
      treatment,
      vaccine,
      activeCount,
      completedCount,
      overdueCount,
      upcomingCount,
      complianceRate
    };
  } catch (error) {
    console.error('Error fetching medication stats:', error);
    throw error;
  }
};

// Add these functions to match the imports in MedicationContext.tsx
export const getMedicationStats = fetchMedicationStats;
export const getOverdueMedications = fetchOverdueMedications;
export const getUpcomingMedications = fetchUpcomingMedications;
