
import { supabase } from '@/integrations/supabase/client';
import { 
  MedicationRecord, 
  MedicationFormData, 
  MedicationSchedule,
  MedicationStats,
  MedicationFrequency,
  MedicationStatus,
  MedicationType
} from '@/types/medication';
import { CareCategory } from '@/types/careRecord';
import { formatISO, addDays, addWeeks, addMonths, addYears } from 'date-fns';

/**
 * Calculate the next due date based on the frequency
 */
export const calculateNextDueDate = (
  startDate: Date, 
  frequency: MedicationFrequency
): Date => {
  const today = new Date(startDate);
  
  switch (frequency) {
    case MedicationFrequency.DAILY:
      return addDays(today, 1);
    case MedicationFrequency.TWICE_DAILY:
      // For twice daily, we don't advance the day, just set a reminder for later in the day
      return today;
    case MedicationFrequency.WEEKLY:
      return addWeeks(today, 1);
    case MedicationFrequency.BIWEEKLY:
      return addWeeks(today, 2);
    case MedicationFrequency.MONTHLY:
      return addMonths(today, 1);
    case MedicationFrequency.QUARTERLY:
      return addMonths(today, 3);
    case MedicationFrequency.ANNUALLY:
      return addYears(today, 1);
    case MedicationFrequency.AS_NEEDED:
    case MedicationFrequency.CUSTOM:
    default:
      // For as-needed medications, we don't set a next due date
      return today;
  }
};

/**
 * Fetch all medication records for a dog
 */
export const fetchDogMedications = async (
  dogId: string,
  includeCompleted: boolean = false
): Promise<MedicationRecord[]> => {
  // First fetch medication logs from daily_care_logs with category 'medications'
  const { data: careRecords, error: careError } = await supabase
    .from('daily_care_logs')
    .select('*')
    .eq('dog_id', dogId)
    .eq('category', 'medications')
    .order('timestamp', { ascending: false });

  if (careError) {
    console.error('Error fetching medication records from care logs:', careError);
    throw careError;
  }

  // Filter care records to include only ones that have medication metadata
  const medicationRecords = (careRecords || []).filter(record => 
    record.medication_metadata && 
    (includeCompleted || record.medication_metadata.status !== MedicationStatus.COMPLETED)
  ).map(record => ({
    ...record,
    medication_name: record.task_name.split(' (')[0], // Extract medication name from task_name
    frequency: record.medication_metadata?.frequency || MedicationFrequency.DAILY,
    medication_type: record.medication_metadata?.medication_type || MedicationType.TREATMENT,
    next_due_date: record.medication_metadata?.next_due_date,
    dosage: record.medication_metadata?.dosage,
    dosage_unit: record.medication_metadata?.dosage_unit,
    route: record.medication_metadata?.route,
    start_date: record.medication_metadata?.start_date,
    end_date: record.medication_metadata?.end_date,
    prescription_id: record.medication_metadata?.prescription_id,
    refills_remaining: record.medication_metadata?.refills_remaining,
    administered_by: record.medication_metadata?.administered_by
  })) as MedicationRecord[];

  return medicationRecords;
};

/**
 * Create a new medication record
 */
export const createMedicationRecord = async (
  data: MedicationFormData,
  userId: string
): Promise<MedicationRecord | null> => {
  // Format the frequency label
  const frequencyLabel = data.frequency.charAt(0).toUpperCase() + data.frequency.slice(1).replace('_', ' ');
  const medicationWithFrequency = `${data.medication_name} (${frequencyLabel})`;
  
  // Calculate next due date
  const nextDueDate = data.next_due_date || calculateNextDueDate(data.start_date, data.frequency);
  
  // Prepare medication metadata
  const medicationMetadata = {
    frequency: data.frequency,
    medication_type: data.medication_type,
    next_due_date: nextDueDate.toISOString(),
    dosage: data.dosage,
    dosage_unit: data.dosage_unit,
    route: data.route,
    start_date: data.start_date.toISOString(),
    end_date: data.end_date ? data.end_date.toISOString() : null,
    prescription_id: data.prescription_id,
    refills_remaining: data.refills_remaining,
    status: MedicationStatus.ACTIVE,
    administered_by: userId
  };

  // Create care record entry
  const careRecord = {
    dog_id: data.dog_id,
    category: 'medications' as CareCategory,
    task_name: medicationWithFrequency,
    timestamp: data.start_date.toISOString(),
    notes: data.notes || '',
    created_by: userId,
    medication_metadata: medicationMetadata
  };

  const { data: newMedicationRecord, error } = await supabase
    .from('daily_care_logs')
    .insert(careRecord)
    .select()
    .single();

  if (error) {
    console.error('Error creating medication record:', error);
    throw error;
  }

  // Add the derived fields to the response
  return {
    ...newMedicationRecord,
    medication_name: data.medication_name,
    frequency: data.frequency,
    medication_type: data.medication_type,
    next_due_date: nextDueDate.toISOString(),
    dosage: data.dosage,
    dosage_unit: data.dosage_unit,
    route: data.route,
    start_date: data.start_date.toISOString(),
    end_date: data.end_date ? data.end_date.toISOString() : undefined,
    prescription_id: data.prescription_id,
    refills_remaining: data.refills_remaining,
    administered_by: userId
  } as MedicationRecord;
};

/**
 * Update an existing medication record
 */
export const updateMedicationRecord = async (
  id: string, 
  data: Partial<MedicationFormData>,
  userId: string
): Promise<MedicationRecord | null> => {
  // First get the existing record
  const { data: existingRecord, error: fetchError } = await supabase
    .from('daily_care_logs')
    .select('*')
    .eq('id', id)
    .single();

  if (fetchError) {
    console.error('Error fetching medication record:', fetchError);
    throw fetchError;
  }

  // Build updated metadata
  const existingMetadata = existingRecord.medication_metadata || {};
  const nextDueDate = data.next_due_date || 
    (data.frequency && data.start_date 
      ? calculateNextDueDate(data.start_date, data.frequency) 
      : existingMetadata.next_due_date);

  const updatedMetadata = {
    ...existingMetadata,
    ...(data.frequency && { frequency: data.frequency }),
    ...(data.medication_type && { medication_type: data.medication_type }),
    ...(nextDueDate && { next_due_date: nextDueDate instanceof Date ? nextDueDate.toISOString() : nextDueDate }),
    ...(data.dosage && { dosage: data.dosage }),
    ...(data.dosage_unit && { dosage_unit: data.dosage_unit }),
    ...(data.route && { route: data.route }),
    ...(data.start_date && { start_date: data.start_date.toISOString() }),
    ...(data.end_date && { end_date: data.end_date.toISOString() }),
    ...(data.prescription_id && { prescription_id: data.prescription_id }),
    ...(data.refills_remaining !== undefined && { refills_remaining: data.refills_remaining })
  };

  // Update the task name if medication name or frequency has changed
  let taskName = existingRecord.task_name;
  if (data.medication_name || data.frequency) {
    // Extract current medication name
    const currentName = existingRecord.task_name.split(' (')[0];
    const newName = data.medication_name || currentName;
    
    // Format the new frequency if provided
    let frequencyLabel = '';
    if (data.frequency) {
      frequencyLabel = data.frequency.charAt(0).toUpperCase() + data.frequency.slice(1).replace('_', ' ');
    } else {
      // Extract current frequency from task name
      const currentFrequencyMatch = existingRecord.task_name.match(/\((.*?)\)/);
      frequencyLabel = currentFrequencyMatch ? currentFrequencyMatch[1] : '';
    }
    
    taskName = `${newName} (${frequencyLabel})`;
  }

  const updateData = {
    task_name: taskName,
    notes: data.notes !== undefined ? data.notes : existingRecord.notes,
    ...(data.start_date && { timestamp: data.start_date.toISOString() }),
    medication_metadata: updatedMetadata
  };

  // Update the record
  const { data: updatedRecord, error: updateError } = await supabase
    .from('daily_care_logs')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (updateError) {
    console.error('Error updating medication record:', updateError);
    throw updateError;
  }

  // Return with derived fields
  return {
    ...updatedRecord,
    medication_name: taskName.split(' (')[0],
    frequency: updatedMetadata.frequency,
    medication_type: updatedMetadata.medication_type,
    next_due_date: updatedMetadata.next_due_date,
    dosage: updatedMetadata.dosage,
    dosage_unit: updatedMetadata.dosage_unit,
    route: updatedMetadata.route,
    start_date: updatedMetadata.start_date,
    end_date: updatedMetadata.end_date,
    prescription_id: updatedMetadata.prescription_id,
    refills_remaining: updatedMetadata.refills_remaining,
    administered_by: updatedMetadata.administered_by
  } as MedicationRecord;
};

/**
 * Mark a medication as administered
 */
export const recordMedicationAdministration = async (
  medicationId: string,
  administrationDate: Date = new Date(),
  notes?: string,
  userId?: string
): Promise<MedicationRecord | null> => {
  // First get the existing record
  const { data: existingRecord, error: fetchError } = await supabase
    .from('daily_care_logs')
    .select('*')
    .eq('id', medicationId)
    .single();

  if (fetchError) {
    console.error('Error fetching medication record:', fetchError);
    throw fetchError;
  }

  // Calculate next due date based on frequency
  const existingMetadata = existingRecord.medication_metadata || {};
  const frequency = existingMetadata.frequency as MedicationFrequency || MedicationFrequency.DAILY;
  const nextDueDate = calculateNextDueDate(administrationDate, frequency);

  // Update the metadata
  const updatedMetadata = {
    ...existingMetadata,
    last_administered: administrationDate.toISOString(),
    next_due_date: nextDueDate.toISOString(),
    administered_by: userId || existingMetadata.administered_by
  };

  // Add an administration note if provided
  const updatedNotes = notes 
    ? `${existingRecord.notes || ''}\n[${administrationDate.toISOString()}] Administered. ${notes}`
    : existingRecord.notes;

  // Update the record
  const { data: updatedRecord, error: updateError } = await supabase
    .from('daily_care_logs')
    .update({
      medication_metadata: updatedMetadata,
      notes: updatedNotes
    })
    .eq('id', medicationId)
    .select()
    .single();

  if (updateError) {
    console.error('Error recording medication administration:', updateError);
    throw updateError;
  }

  // Also create a medication schedule entry to track this administration
  const scheduleEntry = {
    dog_id: existingRecord.dog_id,
    medication_record_id: medicationId,
    scheduled_date: administrationDate.toISOString().split('T')[0],
    scheduled_time: administrationDate.toISOString().split('T')[1].substring(0, 5),
    status: 'completed',
    administered_at: administrationDate.toISOString(),
    administered_by: userId,
    notes: notes
  };

  // We don't need to wait for this to complete
  supabase
    .from('medication_schedules')
    .insert(scheduleEntry)
    .then(({ error }) => {
      if (error) {
        console.error('Error recording medication schedule entry:', error);
      }
    });

  // Return with derived fields
  return {
    ...updatedRecord,
    medication_name: existingRecord.task_name.split(' (')[0],
    frequency: existingMetadata.frequency,
    medication_type: existingMetadata.medication_type,
    next_due_date: nextDueDate.toISOString(),
    dosage: existingMetadata.dosage,
    dosage_unit: existingMetadata.dosage_unit,
    route: existingMetadata.route,
    start_date: existingMetadata.start_date,
    end_date: existingMetadata.end_date,
    prescription_id: existingMetadata.prescription_id,
    refills_remaining: existingMetadata.refills_remaining,
    administered_by: userId || existingMetadata.administered_by
  } as MedicationRecord;
};

/**
 * Delete a medication record
 */
export const deleteMedicationRecord = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('daily_care_logs')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting medication record:', error);
    throw error;
  }

  return true;
};

/**
 * Get medication statistics for a dog
 */
export const getMedicationStats = async (dogId: string): Promise<MedicationStats> => {
  const medications = await fetchDogMedications(dogId, true);
  
  // Initialize stats
  const stats: MedicationStats = {
    total: medications.length,
    preventative: 0,
    prescription: 0,
    supplement: 0,
    treatment: 0,
    vaccine: 0,
    activeCount: 0,
    completedCount: 0,
    overdueCount: 0,
    upcomingCount: 0,
    complianceRate: 0
  };
  
  // Count categories
  medications.forEach(med => {
    // Count by type
    if (med.medication_type === MedicationType.PREVENTATIVE) stats.preventative++;
    else if (med.medication_type === MedicationType.PRESCRIPTION) stats.prescription++;
    else if (med.medication_type === MedicationType.SUPPLEMENT) stats.supplement++;
    else if (med.medication_type === MedicationType.TREATMENT) stats.treatment++;
    else if (med.medication_type === MedicationType.VACCINE) stats.vaccine++;
    
    // Check status
    const today = new Date();
    const nextDueDate = med.next_due_date ? new Date(med.next_due_date) : null;
    
    if (nextDueDate) {
      if (nextDueDate < today) {
        stats.overdueCount++;
      } else {
        // Consider upcoming if due in the next 7 days
        const nextWeek = new Date();
        nextWeek.setDate(today.getDate() + 7);
        if (nextDueDate <= nextWeek) {
          stats.upcomingCount++;
        }
      }
    }
    
    // Check if active
    const endDate = med.end_date ? new Date(med.end_date) : null;
    if (!endDate || endDate >= today) {
      stats.activeCount++;
    } else {
      stats.completedCount++;
    }
  });
  
  // Calculate compliance rate (non-overdue / total active)
  const activeTotal = stats.activeCount;
  stats.complianceRate = activeTotal > 0 
    ? (activeTotal - stats.overdueCount) / activeTotal 
    : 1; // 100% if no active medications
  
  return stats;
};

/**
 * Get overdue medications for a dog
 */
export const getOverdueMedications = async (dogId: string): Promise<MedicationRecord[]> => {
  const medications = await fetchDogMedications(dogId);
  const today = new Date();
  
  return medications.filter(med => {
    const nextDueDate = med.next_due_date ? new Date(med.next_due_date) : null;
    return nextDueDate && nextDueDate < today;
  });
};

/**
 * Get upcoming medications for a dog
 */
export const getUpcomingMedications = async (
  dogId: string, 
  daysAhead: number = 7
): Promise<MedicationRecord[]> => {
  const medications = await fetchDogMedications(dogId);
  const today = new Date();
  const futureDate = new Date();
  futureDate.setDate(today.getDate() + daysAhead);
  
  return medications.filter(med => {
    const nextDueDate = med.next_due_date ? new Date(med.next_due_date) : null;
    return nextDueDate && nextDueDate >= today && nextDueDate <= futureDate;
  });
};
