import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { adaptHealthRecord } from '@/types/health';
import { 
  HealthRecord, 
  HealthRecordTypeEnum 
} from '@/types/health';

// Get all health records for a dog
export const getHealthRecords = async (dogId: string): Promise<HealthRecord[]> => {
  try {
    const { data, error } = await supabase
      .from('health_records')
      .select('*')
      .eq('dog_id', dogId)
      .order('visit_date', { ascending: false });
    
    if (error) throw error;
    
    // Map to HealthRecord type
    return (data || []).map(record => adaptHealthRecord(record));
  } catch (error) {
    console.error('Error fetching health records:', error);
    return [];
  }
};

// Get a single health record
export const getHealthRecord = async (recordId: string): Promise<HealthRecord | null> => {
  try {
    const { data, error } = await supabase
      .from('health_records')
      .select('*')
      .eq('id', recordId)
      .single();
    
    if (error) throw error;
    
    return adaptHealthRecord(data);
  } catch (error) {
    console.error('Error fetching health record:', error);
    return null;
  }
};

// Add a health record
export const addHealthRecord = async (
  record: Omit<HealthRecord, 'id' | 'created_at'>
): Promise<HealthRecord | null> => {
  try {
    const recordWithId = {
      ...record,
      id: uuidv4(),
      date: record.visit_date // Ensure date is set for compatibility
    };
    
    // Add specific fields based on record type
    let specificFields = {};
    
    if (record.record_type) {
      switch (record.record_type.toString()) {
        case HealthRecordTypeEnum.Medication:
          specificFields = {
            medication_name: record.medication_name || null,
            dosage: record.dosage || null,
            dosage_unit: record.dosage_unit || null,
            frequency: record.frequency || null,
            start_date: record.start_date || null,
            end_date: record.end_date || null,
            prescribed_by: record.prescribed_by || null,
            pharmacy: record.pharmacy || null,
            prescription_number: record.prescription_number || null,
            refills_remaining: record.refills_remaining || null
          };
          break;
        case HealthRecordTypeEnum.Vaccination:
          specificFields = {
            vaccine_name: record.vaccine_name || null,
            vaccine_type: record.vaccine_type || null,
            manufacturer: record.manufacturer || null,
            lot_number: record.lot_number || null,
            expiration_date: record.expiration_date || null
          };
          break;
        case HealthRecordTypeEnum.Examination:
          specificFields = {
            examination_type: record.examination_type || null,
            exam_type: record.exam_type || null,
            findings: record.findings || null,
            recommendations: record.recommendations || null,
            vet_clinic: record.vet_clinic || null,
            follow_up_date: record.follow_up_date || null,
            examiner: record.examiner || null,
            facility: record.facility || null
          };
          break;
        case HealthRecordTypeEnum.Surgery:
          specificFields = {
            procedure_name: record.procedure_name || null,
            surgeon: record.surgeon || null,
            anesthesia_used: record.anesthesia_used || null,
            recovery_notes: record.recovery_notes || null
          };
          break;
      }
    }
    
    const finalRecord = {
      ...recordWithId,
      ...specificFields
    };
    
    const { data, error } = await supabase
      .from('health_records')
      .insert(finalRecord)
      .select()
      .single();
    
    if (error) throw error;
    
    return adaptHealthRecord(data);
  } catch (error) {
    console.error('Error adding health record:', error);
    return null;
  }
};

// Update a health record
export const updateHealthRecord = async (
  recordId: string,
  updates: Partial<HealthRecord>
): Promise<HealthRecord | null> => {
  try {
    // Add specific fields based on record type
    let specificFields = {};
    
    if (updates.record_type) {
      switch (updates.record_type.toString()) {
        case HealthRecordTypeEnum.Medication:
          specificFields = {
            medication_name: updates.medication_name,
            dosage: updates.dosage,
            dosage_unit: updates.dosage_unit,
            frequency: updates.frequency,
            start_date: updates.start_date,
            end_date: updates.end_date
          };
          break;
        // Handle other record types similarly
      }
    }
    
    const finalUpdates = {
      ...updates,
      ...specificFields
    };
    
    const { data, error } = await supabase
      .from('health_records')
      .update(finalUpdates)
      .eq('id', recordId)
      .select()
      .single();
    
    if (error) throw error;
    
    return adaptHealthRecord(data);
  } catch (error) {
    console.error('Error updating health record:', error);
    return null;
  }
};

// Delete a health record
export const deleteHealthRecord = async (recordId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('health_records')
      .delete()
      .eq('id', recordId);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error deleting health record:', error);
    return false;
  }
};
