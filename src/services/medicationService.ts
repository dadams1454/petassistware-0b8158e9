
import { supabase } from '@/integrations/supabase/client';
import { MedicationRecord, MedicationFormData, MedicationFrequency, MedicationRoute, MedicationType, MedicationAdministration, MedicationStats } from '@/types/medication';
import { format, addDays, addWeeks, addMonths, isAfter, isBefore, parseISO } from 'date-fns';

/**
 * Helper to get medication records by dog IDs
 */
export const getMedicationRecords = async (dogIds: string[]): Promise<MedicationRecord[]> => {
  // Use the daily_care_logs table for medication records
  const { data, error } = await supabase
    .from('daily_care_logs')
    .select('*')
    .in('dog_id', dogIds)
    .eq('category', 'medications')
    .order('timestamp', { ascending: false });

  if (error) {
    console.error('Error fetching medication records:', error);
    throw error;
  }

  // Map the raw data to MedicationRecord objects
  const medicationRecords = (data || []).map(record => {
    // Extract medication metadata from JSON
    const metadata = record.medication_metadata || {};
    
    // Create a medication record
    const medicationRecord: MedicationRecord = {
      id: record.id,
      dog_id: record.dog_id,
      medication_name: String(metadata.medication_name || ''),
      created_at: record.created_at,
      timestamp: record.timestamp,
      category: 'medications',
      task_name: record.task_name,
      notes: record.notes || '',
      created_by: record.created_by,
      frequency: (metadata.frequency as MedicationFrequency) || MedicationFrequency.DAILY,
      medication_type: (metadata.medication_type as MedicationType) || MedicationType.TREATMENT,
      start_date: record.timestamp,
      end_date: metadata.end_date ? String(metadata.end_date) : undefined,
      dosage: String(metadata.dosage || ''),
      dosage_unit: String(metadata.dosage_unit || ''),
      route: (metadata.route as MedicationRoute) || MedicationRoute.ORAL,
      next_due_date: metadata.next_due_date ? String(metadata.next_due_date) : undefined,
      prescription_id: String(metadata.prescription_id || ''),
      refills_remaining: Number(metadata.refills_remaining || 0),
      administered_by: String(metadata.administered_by || '')
    };
    
    return medicationRecord;
  });
  
  return medicationRecords;
};

/**
 * Calculates the next due date based on medication frequency
 */
export const calculateNextDueDate = (
  startDate: Date,
  frequency: MedicationFrequency
): Date => {
  switch (frequency) {
    case MedicationFrequency.DAILY:
      return addDays(startDate, 1);
    case MedicationFrequency.TWICE_DAILY:
      return addDays(startDate, 0.5);
    case MedicationFrequency.WEEKLY:
      return addWeeks(startDate, 1);
    case MedicationFrequency.BIWEEKLY:
      return addWeeks(startDate, 2);
    case MedicationFrequency.MONTHLY:
      return addMonths(startDate, 1);
    case MedicationFrequency.QUARTERLY:
      return addMonths(startDate, 3);
    case MedicationFrequency.ANNUALLY:
      return addMonths(startDate, 12);
    case MedicationFrequency.AS_NEEDED:
      return addDays(startDate, 100); // Far future date as it's not scheduled
    default:
      return addDays(startDate, 1);
  }
};

/**
 * Creates a new medication record
 */
export const createMedicationRecord = async (
  data: MedicationFormData
): Promise<MedicationRecord> => {
  try {
    const now = new Date();
    const nextDueDate = calculateNextDueDate(
      data.start_date,
      data.frequency
    );
    
    // Create a medication record in daily_care_logs
    const careLogData = {
      dog_id: data.dog_id,
      category: 'medications',
      task_name: `Medication: ${data.medication_name}`,
      notes: data.notes,
      timestamp: data.start_date.toISOString(),
      created_by: data.created_by || 'system',
      medication_metadata: {
        medication_name: data.medication_name,
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
        administered_by: data.created_by
      }
    };
    
    const { data: careLogRecord, error: careLogError } = await supabase
      .from('daily_care_logs')
      .insert(careLogData)
      .select()
      .single();
      
    if (careLogError) {
      console.error('Error creating medication record:', careLogError);
      throw careLogError;
    }
    
    const metadata = careLogRecord.medication_metadata || {};
    
    // Map to MedicationRecord type
    const record: MedicationRecord = {
      id: careLogRecord.id,
      dog_id: careLogRecord.dog_id,
      medication_name: data.medication_name,
      frequency: data.frequency,
      medication_type: data.medication_type,
      created_at: careLogRecord.created_at,
      timestamp: careLogRecord.timestamp,
      category: 'medications',
      task_name: careLogRecord.task_name,
      notes: careLogRecord.notes || '',
      created_by: careLogRecord.created_by,
      next_due_date: nextDueDate.toISOString(),
      start_date: data.start_date.toISOString(),
      end_date: data.end_date ? data.end_date.toISOString() : undefined,
      dosage: data.dosage || '',
      dosage_unit: data.dosage_unit || '',
      route: data.route,
      prescription_id: data.prescription_id || '',
      refills_remaining: data.refills_remaining || 0
    };
    
    return record;
  } catch (error) {
    console.error('Error in createMedicationRecord:', error);
    throw error;
  }
};

/**
 * Updates an existing medication record
 */
export const updateMedicationRecord = async (
  id: string,
  data: Partial<MedicationFormData>
): Promise<MedicationRecord> => {
  try {
    // Fetch the current record to get existing metadata
    const { data: existingRecord, error: fetchError } = await supabase
      .from('daily_care_logs')
      .select('*')
      .eq('id', id)
      .single();
      
    if (fetchError) {
      console.error('Error fetching existing medication record:', fetchError);
      throw fetchError;
    }
    
    // Prepare updated metadata
    const currentMetadata = existingRecord.medication_metadata || {};
    const updatedMetadata: Record<string, any> = { ...currentMetadata };
    
    // Update specific metadata fields if provided in the data
    if (data.medication_name) updatedMetadata.medication_name = data.medication_name;
    if (data.frequency) updatedMetadata.frequency = data.frequency;
    if (data.medication_type) updatedMetadata.medication_type = data.medication_type;
    if (data.dosage) updatedMetadata.dosage = data.dosage;
    if (data.dosage_unit) updatedMetadata.dosage_unit = data.dosage_unit;
    if (data.route) updatedMetadata.route = data.route;
    if (data.start_date) updatedMetadata.start_date = data.start_date.toISOString();
    if (data.end_date) updatedMetadata.end_date = data.end_date.toISOString();
    if (data.prescription_id) updatedMetadata.prescription_id = data.prescription_id;
    if (data.refills_remaining !== undefined) updatedMetadata.refills_remaining = data.refills_remaining;
    
    // Calculate next due date if frequency or start date changes
    if (data.frequency || data.start_date) {
      const startDate = data.start_date || parseISO(String(currentMetadata.start_date));
      const frequency = data.frequency || currentMetadata.frequency as MedicationFrequency;
      updatedMetadata.next_due_date = calculateNextDueDate(
        startDate,
        frequency
      ).toISOString();
    }
    
    // Prepare the update data
    const updateData: any = {
      medication_metadata: updatedMetadata
    };
    
    // Update other fields if provided
    if (data.notes) updateData.notes = data.notes;
    
    // If medication name changes, update task_name
    if (data.medication_name) {
      updateData.task_name = `Medication: ${data.medication_name}`;
    }
    
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
    
    // Map to MedicationRecord type
    const metadata = updatedRecord.medication_metadata || {};
    
    const record: MedicationRecord = {
      id: updatedRecord.id,
      dog_id: updatedRecord.dog_id,
      medication_name: String(metadata.medication_name || ''),
      frequency: metadata.frequency as MedicationFrequency,
      medication_type: metadata.medication_type as MedicationType,
      created_at: updatedRecord.created_at,
      timestamp: updatedRecord.timestamp,
      category: 'medications',
      task_name: updatedRecord.task_name,
      notes: updatedRecord.notes || '',
      created_by: updatedRecord.created_by,
      next_due_date: String(metadata.next_due_date || ''),
      start_date: String(metadata.start_date || ''),
      end_date: metadata.end_date ? String(metadata.end_date) : undefined,
      dosage: String(metadata.dosage || ''),
      dosage_unit: String(metadata.dosage_unit || ''),
      route: metadata.route as MedicationRoute,
      prescription_id: String(metadata.prescription_id || ''),
      refills_remaining: Number(metadata.refills_remaining || 0)
    };
    
    return record;
  } catch (error) {
    console.error('Error in updateMedicationRecord:', error);
    throw error;
  }
};

/**
 * Deletes a medication record
 */
export const deleteMedicationRecord = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('daily_care_logs')
      .delete()
      .eq('id', id)
      .eq('category', 'medications');
      
    if (error) {
      console.error('Error deleting medication record:', error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error in deleteMedicationRecord:', error);
    throw error;
  }
};

/**
 * Records a medication administration
 */
export const recordMedicationAdministration = async (
  medicationId: string,
  administrationData: Omit<MedicationAdministration, 'id'>
): Promise<MedicationAdministration> => {
  try {
    // Fetch the current record to get existing metadata
    const { data: existingRecord, error: fetchError } = await supabase
      .from('daily_care_logs')
      .select('*')
      .eq('id', medicationId)
      .single();
      
    if (fetchError) {
      console.error('Error fetching existing medication record:', fetchError);
      throw fetchError;
    }
    
    // Get existing metadata
    const currentMetadata = existingRecord.medication_metadata || {};
    
    // Get existing or initialize administrations array
    let administrations: MedicationAdministration[] = [];
    if (currentMetadata.administrations && Array.isArray(currentMetadata.administrations)) {
      administrations = [...currentMetadata.administrations];
    }
    
    // Create new administration record
    const newAdministration: MedicationAdministration = {
      id: crypto.randomUUID(),
      timestamp: administrationData.timestamp,
      administered_by: administrationData.administered_by,
      notes: administrationData.notes
    };
    
    // Add to administrations array
    administrations.push(newAdministration);
    
    // Update metadata
    const updatedMetadata = {
      ...currentMetadata,
      administrations,
      last_administered: administrationData.timestamp,
      administered_by: administrationData.administered_by
    };
    
    // Calculate new next_due_date
    const now = new Date(administrationData.timestamp);
    const frequency = currentMetadata.frequency as MedicationFrequency;
    updatedMetadata.next_due_date = calculateNextDueDate(now, frequency).toISOString();
    
    // Update the record
    const { error: updateError } = await supabase
      .from('daily_care_logs')
      .update({
        medication_metadata: updatedMetadata
      })
      .eq('id', medicationId);
      
    if (updateError) {
      console.error('Error recording medication administration:', updateError);
      throw updateError;
    }
    
    return newAdministration;
  } catch (error) {
    console.error('Error in recordMedicationAdministration:', error);
    throw error;
  }
};

/**
 * Fetches medication records for a specific dog
 */
export const fetchDogMedications = async (dogId: string): Promise<MedicationRecord[]> => {
  return getMedicationRecords([dogId]);
};

/**
 * Fetches all medication records with overdue status
 */
export const fetchOverdueMedications = async (): Promise<MedicationRecord[]> => {
  const now = new Date().toISOString();
  
  // Fetch all medication records
  const { data, error } = await supabase
    .from('daily_care_logs')
    .select('*')
    .eq('category', 'medications');
  
  if (error) {
    console.error('Error fetching overdue medications:', error);
    throw error;
  }
  
  // Filter to find overdue medications
  const overdueMedications = (data || [])
    .filter(record => {
      const metadata = record.medication_metadata || {};
      const nextDueDate = metadata.next_due_date;
      const endDate = metadata.end_date;
      
      // Skip medications that have ended
      if (endDate && endDate < now) return false;
      
      // Check if next_due_date is in the past
      return nextDueDate && nextDueDate < now;
    })
    .map(record => {
      const metadata = record.medication_metadata || {};
      
      return {
        id: record.id,
        dog_id: record.dog_id,
        medication_name: String(metadata.medication_name || ''),
        frequency: metadata.frequency as MedicationFrequency,
        medication_type: metadata.medication_type as MedicationType,
        created_at: record.created_at,
        timestamp: record.timestamp,
        category: 'medications',
        task_name: record.task_name,
        notes: record.notes || '',
        created_by: record.created_by,
        next_due_date: String(metadata.next_due_date || ''),
        start_date: String(metadata.start_date || ''),
        end_date: metadata.end_date ? String(metadata.end_date) : undefined,
        dosage: String(metadata.dosage || ''),
        dosage_unit: String(metadata.dosage_unit || ''),
        route: metadata.route as MedicationRoute,
        prescription_id: String(metadata.prescription_id || ''),
        refills_remaining: Number(metadata.refills_remaining || 0)
      } as MedicationRecord;
    });
  
  return overdueMedications;
};

/**
 * Fetches upcoming medication records within a specified number of days
 */
export const fetchUpcomingMedications = async (daysAhead = 7): Promise<MedicationRecord[]> => {
  const now = new Date();
  const futureDate = addDays(now, daysAhead).toISOString();
  const nowString = now.toISOString();
  
  // Fetch all medication records
  const { data, error } = await supabase
    .from('daily_care_logs')
    .select('*')
    .eq('category', 'medications');
  
  if (error) {
    console.error('Error fetching upcoming medications:', error);
    throw error;
  }
  
  // Filter to find upcoming medications
  const upcomingMedications = (data || [])
    .filter(record => {
      const metadata = record.medication_metadata || {};
      const nextDueDate = metadata.next_due_date;
      const endDate = metadata.end_date;
      
      // Skip medications that have ended
      if (endDate && endDate < nowString) return false;
      
      // Check if next_due_date is between now and future date
      return nextDueDate && nextDueDate >= nowString && nextDueDate <= futureDate;
    })
    .map(record => {
      const metadata = record.medication_metadata || {};
      
      return {
        id: record.id,
        dog_id: record.dog_id,
        medication_name: String(metadata.medication_name || ''),
        frequency: metadata.frequency as MedicationFrequency,
        medication_type: metadata.medication_type as MedicationType,
        created_at: record.created_at,
        timestamp: record.timestamp,
        category: 'medications',
        task_name: record.task_name,
        notes: record.notes || '',
        created_by: record.created_by,
        next_due_date: String(metadata.next_due_date || ''),
        start_date: String(metadata.start_date || ''),
        end_date: metadata.end_date ? String(metadata.end_date) : undefined,
        dosage: String(metadata.dosage || ''),
        dosage_unit: String(metadata.dosage_unit || ''),
        route: metadata.route as MedicationRoute,
        prescription_id: String(metadata.prescription_id || ''),
        refills_remaining: Number(metadata.refills_remaining || 0)
      } as MedicationRecord;
    });
  
  return upcomingMedications;
};

/**
 * Get medication statistics
 */
export const fetchMedicationStats = async (dogId: string): Promise<MedicationStats> => {
  try {
    const medications = await fetchDogMedications(dogId);
    const now = new Date();
    
    // Initialize stats object
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
    
    // Count by type
    medications.forEach(med => {
      // Count by medication type
      switch (med.medication_type) {
        case MedicationType.PREVENTATIVE:
          stats.preventative++;
          break;
        case MedicationType.PRESCRIPTION:
          stats.prescription++;
          break;
        case MedicationType.SUPPLEMENT:
          stats.supplement++;
          break;
        case MedicationType.TREATMENT:
          stats.treatment++;
          break;
        case MedicationType.VACCINE:
          stats.vaccine++;
          break;
      }
      
      // Check active/completed status
      if (med.end_date && new Date(med.end_date) < now) {
        stats.completedCount++;
      } else {
        stats.activeCount++;
        
        // Check if overdue
        if (med.next_due_date && new Date(med.next_due_date) < now) {
          stats.overdueCount++;
        } 
        // Check if upcoming (within next 7 days)
        else if (med.next_due_date) {
          const nextDueDate = new Date(med.next_due_date);
          const sevenDaysFromNow = addDays(now, 7);
          if (nextDueDate <= sevenDaysFromNow) {
            stats.upcomingCount++;
          }
        }
      }
    });
    
    // Calculate compliance rate
    if (stats.activeCount > 0) {
      stats.complianceRate = ((stats.activeCount - stats.overdueCount) / stats.activeCount) * 100;
    }
    
    return stats;
  } catch (error) {
    console.error('Error fetching medication stats:', error);
    throw error;
  }
};
