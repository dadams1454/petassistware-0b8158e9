import { supabase } from '@/integrations/supabase/client';
import { 
  MedicationRecord, 
  MedicationFormData, 
  MedicationFrequency, 
  MedicationStatus,
  MedicationStats
} from '@/types/medication';
import { format, addDays, addWeeks, addMonths, compareAsc, parseISO } from 'date-fns';
import { Json } from '@/integrations/supabase/types';

// Helper function to cast Json to medication record
const castMedicationData = (data: any): MedicationRecord => {
  // Convert the medication metadata if needed
  let medicationData: any = {};
  if (data.medication_metadata) {
    if (typeof data.medication_metadata === 'string') {
      try {
        medicationData = JSON.parse(data.medication_metadata);
      } catch (e) {
        medicationData = {};
      }
    } else {
      medicationData = data.medication_metadata;
    }
  }

  return {
    id: data.id,
    dog_id: data.dog_id,
    task_name: data.task_name || 'Medication',
    category: data.category || 'medication',
    status: data.status || MedicationStatus.ACTIVE,
    created_at: data.created_at,
    created_by: data.created_by || null,
    timestamp: data.timestamp || data.created_at,
    medication_name: medicationData.medication_name || data.task_name || '',
    dosage: medicationData.dosage || '',
    dosage_unit: medicationData.dosage_unit || '',
    frequency: medicationData.frequency || MedicationFrequency.DAILY,
    route: medicationData.route || undefined,
    start_date: medicationData.start_date || null,
    end_date: medicationData.end_date || null,
    next_due_date: medicationData.next_due_date || null,
    medication_type: medicationData.medication_type || 'treatment',
    prescription_id: medicationData.prescription_id || null,
    refills_remaining: medicationData.refills_remaining || 0,
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
 * Get medication records for multiple dogs
 */
export const getMedicationRecords = async (dogIds: string[]): Promise<MedicationRecord[]> => {
  try {
    // Use the daily_care_logs table with medication category
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

    // Prepare metadata for daily_care_logs table
    const medicationMetadata = {
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
      administrations: []
    };

    // Create record in daily_care_logs
    const medicationData = {
      dog_id: data.dog_id,
      task_name: `${data.medication_name} ${data.dosage || ''} ${data.dosage_unit || ''}`.trim(),
      category: 'medication',
      status: MedicationStatus.ACTIVE,
      created_by: data.created_by || null,
      timestamp: new Date().toISOString(),
      notes: data.notes,
      medication_metadata: medicationMetadata
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
    // First get the existing record to keep any fields we're not updating
    const { data: existingRecord, error: fetchError } = await supabase
      .from('daily_care_logs')
      .select('*')
      .eq('id', medicationId)
      .single();
      
    if (fetchError) throw fetchError;
    
    // Calculate next due date if not provided
    if (!data.next_due_date && data.start_date) {
      data.next_due_date = calculateNextDueDate(data.start_date, data.frequency);
    }
    
    // Parse existing metadata
    let existingMetadata = {};
    if (existingRecord.medication_metadata) {
      if (typeof existingRecord.medication_metadata === 'string') {
        try {
          existingMetadata = JSON.parse(existingRecord.medication_metadata);
        } catch (e) {
          existingMetadata = {};
        }
      } else {
        existingMetadata = existingRecord.medication_metadata;
      }
    }
    
    // Update metadata with new values
    const medicationMetadata = {
      ...existingMetadata,
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
      refills_remaining: data.refills_remaining
    };
    
    // Update record
    const updateData = {
      task_name: `${data.medication_name} ${data.dosage || ''} ${data.dosage_unit || ''}`.trim(),
      notes: data.notes,
      medication_metadata: medicationMetadata
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
    
    // Parse existing metadata
    let medicationMetadata = {};
    if (currentRecord.medication_metadata) {
      if (typeof currentRecord.medication_metadata === 'string') {
        try {
          medicationMetadata = JSON.parse(currentRecord.medication_metadata);
        } catch (e) {
          medicationMetadata = {};
        }
      } else {
        medicationMetadata = currentRecord.medication_metadata;
      }
    }
    
    // Get existing administrations, or initialize if none
    const existingAdministrations = medicationMetadata.administrations || [];
    
    // Create new administration entry with unique ID
    const newAdministration = {
      id: crypto.randomUUID(),
      ...administrationData
    };
    
    // Add to the administrations array
    const updatedAdministrations = [
      ...existingAdministrations,
      newAdministration
    ];

    // Calculate next due date based on frequency
    const medicationRecord = castMedicationData(currentRecord);
    const nextDueDate = calculateNextDueDate(
      new Date(administrationData.timestamp),
      medicationRecord.frequency
    );
    
    // Update the medication metadata
    const updatedMetadata = {
      ...medicationMetadata,
      administrations: updatedAdministrations,
      next_due_date: format(nextDueDate, 'yyyy-MM-dd'),
      last_administered: administrationData.timestamp
    };
    
    // Update the medication record
    const { error: updateError } = await supabase
      .from('daily_care_logs')
      .update({
        medication_metadata: updatedMetadata
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
      .eq('category', 'medication');
      
    if (error) throw error;
    
    // Filter records with overdue next_due_date
    const medications = data.map((item: any) => castMedicationData(item));
    return medications.filter(med => {
      if (!med.next_due_date) return false;
      
      const nextDue = new Date(med.next_due_date);
      return nextDue < today && med.status === 'active';
    });
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
      .eq('category', 'medication');
      
    if (error) throw error;
    
    // Filter records with upcoming next_due_date
    const medications = data.map((item: any) => castMedicationData(item));
    return medications.filter(med => {
      if (!med.next_due_date) return false;
      
      const nextDue = new Date(med.next_due_date);
      return nextDue >= today && nextDue <= futureDate && med.status === 'active';
    });
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
    
    const activeCount = medications.filter(m => m.status === 'active').length;
    const completedCount = medications.filter(m => m.status === 'completed').length;
    
    // Count overdue medications
    const overdueCount = medications.filter(m => {
      if (!m.next_due_date || m.status !== 'active') return false;
      const nextDue = new Date(m.next_due_date);
      return nextDue < today;
    }).length;
    
    // Count upcoming medications (next 7 days)
    const futureDate = addDays(today, 7);
    const upcomingCount = medications.filter(m => {
      if (!m.next_due_date || m.status !== 'active') return false;
      const nextDue = new Date(m.next_due_date);
      return nextDue >= today && nextDue <= futureDate;
    }).length;
    
    // Calculate compliance rate (completed / (completed + overdue))
    const complianceRate = completedCount + overdueCount > 0 
      ? completedCount / (completedCount + overdueCount)
      : 1; // If no completed or overdue, assume 100% compliance
    
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

// Add these exported aliases for compatibility
export const getMedicationStats = fetchMedicationStats;
export const getOverdueMedications = fetchOverdueMedications;
export const getUpcomingMedications = fetchUpcomingMedications;
