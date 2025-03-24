
import { supabase } from '@/integrations/supabase/client';
import { HealthRecord, HealthRecordType, WeightRecord } from '@/types/health';
import { formatDateForDatabase } from '@/utils/dateUtils';

// Get all health records for a dog
export const getHealthRecords = async (dogId: string): Promise<HealthRecord[]> => {
  const { data, error } = await supabase
    .from('health_records')
    .select('*')
    .eq('dog_id', dogId)
    .order('visit_date', { ascending: false });
    
  if (error) {
    console.error('Error fetching health records:', error);
    throw error;
  }
  
  // Map database fields to our interface
  return (data || []).map(record => ({
    ...record,
    record_type: record.record_type as HealthRecordType,
  }));
};

// Get health records by type
export const getHealthRecordsByType = async (
  dogId: string, 
  recordType: HealthRecordType
): Promise<HealthRecord[]> => {
  const { data, error } = await supabase
    .from('health_records')
    .select('*')
    .eq('dog_id', dogId)
    .eq('record_type', recordType)
    .order('visit_date', { ascending: false });
    
  if (error) {
    console.error(`Error fetching ${recordType} records:`, error);
    throw error;
  }
  
  return (data || []).map(record => ({
    ...record,
    record_type: record.record_type as HealthRecordType,
  }));
};

// Add a new health record
export const addHealthRecord = async (record: Omit<HealthRecord, 'id' | 'created_at'>): Promise<HealthRecord> => {
  // Transform from our interface to database fields
  const dbRecord = {
    dog_id: record.dog_id,
    visit_date: record.visit_date,
    record_type: record.record_type,
    title: record.title,
    record_notes: record.description || record.record_notes,
    performed_by: record.performed_by,
    next_due_date: record.next_due_date,
    // Include all the specific fields
    vaccine_name: record.vaccine_name,
    manufacturer: record.manufacturer,
    lot_number: record.lot_number,
    administration_route: record.administration_route,
    expiration_date: record.expiration_date,
    reminder_sent: record.reminder_sent,
    medication_name: record.medication_name,
    dosage: record.dosage,
    dosage_unit: record.dosage_unit,
    frequency: record.frequency,
    duration: record.duration,
    duration_unit: record.duration_unit,
    start_date: record.start_date,
    end_date: record.end_date,
    prescription_number: record.prescription_number,
    examination_type: record.examination_type,
    findings: record.findings,
    recommendations: record.recommendations,
    vet_name: record.vet_name,
    vet_clinic: record.vet_clinic,
    procedure_name: record.procedure_name,
    surgeon: record.surgeon,
    anesthesia_used: record.anesthesia_used,
    recovery_notes: record.recovery_notes,
    follow_up_date: record.follow_up_date,
    document_url: record.document_url,
  };
    
  const { data, error } = await supabase
    .from('health_records')
    .insert(dbRecord)
    .select();
    
  if (error) {
    console.error('Error adding health record:', error);
    throw error;
  }
  
  // Map back to our interface
  return {
    ...data![0],
    record_type: data![0].record_type as HealthRecordType,
  };
};

// Update a health record
export const updateHealthRecord = async (id: string, updates: Partial<Omit<HealthRecord, 'id' | 'created_at'>>): Promise<HealthRecord> => {
  const { data, error } = await supabase
    .from('health_records')
    .update(updates)
    .eq('id', id)
    .select();
    
  if (error) {
    console.error('Error updating health record:', error);
    throw error;
  }
  
  return {
    ...data![0],
    record_type: data![0].record_type as HealthRecordType,
  };
};

// Delete a health record
export const deleteHealthRecord = async (id: string): Promise<string> => {
  const { error } = await supabase
    .from('health_records')
    .delete()
    .eq('id', id);
    
  if (error) {
    console.error('Error deleting health record:', error);
    throw error;
  }
  
  return id;
};

// Get upcoming due vaccinations
export const getUpcomingVaccinations = async (dogId: string, daysAhead = 30): Promise<HealthRecord[]> => {
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + daysAhead);
  
  const { data, error } = await supabase
    .from('health_records')
    .select('*')
    .eq('dog_id', dogId)
    .eq('record_type', HealthRecordType.Vaccination)
    .lte('next_due_date', futureDate.toISOString().split('T')[0])
    .gte('next_due_date', new Date().toISOString().split('T')[0])
    .order('next_due_date', { ascending: true });
    
  if (error) {
    console.error('Error fetching upcoming vaccinations:', error);
    throw error;
  }
  
  return (data || []).map(record => ({
    ...record,
    record_type: record.record_type as HealthRecordType,
  }));
};

// Weight record functions
export const getWeightHistory = async (dogId: string): Promise<WeightRecord[]> => {
  const { data, error } = await supabase
    .from('weight_records')
    .select('*')
    .eq('dog_id', dogId)
    .order('date', { ascending: false });
    
  if (error) {
    console.error('Error fetching weight history:', error);
    throw error;
  }
  
  // Ensure weight_unit is a valid enum value
  return (data || []).map(record => ({
    ...record,
    weight_unit: (record.weight_unit as 'lbs' | 'kg' | 'g' | 'oz') || 'lbs'
  }));
};

export const addWeightRecord = async (
  record: Omit<WeightRecord, 'id' | 'created_at'>
): Promise<WeightRecord> => {
  // Ensure date is in the correct format
  const formattedRecord = {
    dog_id: record.dog_id,
    date: formatDateForDatabase(record.date) || new Date().toISOString().split('T')[0],
    weight: record.weight,
    weight_unit: record.weight_unit,
    notes: record.notes
  };
    
  const { data, error } = await supabase
    .from('weight_records')
    .insert(formattedRecord)
    .select();
    
  if (error) {
    console.error('Error adding weight record:', error);
    throw error;
  }
  
  return {
    ...data![0],
    weight_unit: (data![0].weight_unit as 'lbs' | 'kg' | 'g' | 'oz')
  };
};

export const deleteWeightRecord = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('weight_records')
    .delete()
    .eq('id', id);
    
  if (error) {
    console.error('Error deleting weight record:', error);
    throw error;
  }
};
