
import { supabase } from '@/integrations/supabase/client';
import { HealthRecord, HealthRecordType, WeightRecord } from '@/types/health';

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
  
  // Map to the HealthRecord type
  return (data || []).map(record => ({
    id: record.id,
    dog_id: record.dog_id,
    date: record.visit_date,
    record_type: record.record_type || 'examination',
    title: record.title || `${record.vet_name} Visit`,
    description: record.record_notes || '',
    performed_by: record.performed_by || record.vet_name,
    next_due_date: record.next_due_date,
    created_at: record.created_at,
    updated_at: record.updated_at,
    // Extended fields for specific record types
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
    vet_clinic: record.vet_clinic,
    procedure_name: record.procedure_name,
    surgeon: record.surgeon,
    anesthesia_used: record.anesthesia_used,
    recovery_notes: record.recovery_notes,
    follow_up_date: record.follow_up_date
  })) as HealthRecord[];
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
  
  // Reuse the same mapping function for consistency
  return (data || []).map(record => ({
    id: record.id,
    dog_id: record.dog_id,
    date: record.visit_date,
    record_type: record.record_type || 'examination',
    title: record.title || `${record.vet_name} Visit`,
    description: record.record_notes || '',
    performed_by: record.performed_by || record.vet_name,
    next_due_date: record.next_due_date,
    created_at: record.created_at,
    updated_at: record.updated_at,
    // Extended fields based on record type
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
    vet_clinic: record.vet_clinic,
    procedure_name: record.procedure_name,
    surgeon: record.surgeon,
    anesthesia_used: record.anesthesia_used,
    recovery_notes: record.recovery_notes,
    follow_up_date: record.follow_up_date
  })) as HealthRecord[];
};

// Add a new health record
export const addHealthRecord = async (record: Omit<HealthRecord, 'id' | 'created_at'>) => {
  const recordData = {
    dog_id: record.dog_id,
    visit_date: record.date,
    record_type: record.record_type,
    title: record.title,
    record_notes: record.description,
    performed_by: record.performed_by,
    vet_name: record.performed_by,
    next_due_date: record.next_due_date,
    // Type-specific fields
    vaccine_name: 'vaccine_name' in record ? record.vaccine_name : null,
    manufacturer: 'manufacturer' in record ? record.manufacturer : null,
    lot_number: 'lot_number' in record ? record.lot_number : null,
    administration_route: 'administration_route' in record ? record.administration_route : null,
    expiration_date: 'expiration_date' in record ? record.expiration_date : null,
    reminder_sent: 'reminder_sent' in record ? record.reminder_sent : false,
    medication_name: 'medication_name' in record ? record.medication_name : null,
    dosage: 'dosage' in record ? record.dosage : null,
    dosage_unit: 'dosage_unit' in record ? record.dosage_unit : null,
    frequency: 'frequency' in record ? record.frequency : null,
    duration: 'duration' in record ? record.duration : null,
    duration_unit: 'duration_unit' in record ? record.duration_unit : null,
    start_date: 'start_date' in record ? record.start_date : null,
    end_date: 'end_date' in record ? record.end_date : null,
    prescription_number: 'prescription_number' in record ? record.prescription_number : null,
    examination_type: 'examination_type' in record ? record.examination_type : null,
    findings: 'findings' in record ? record.findings : null,
    recommendations: 'recommendations' in record ? record.recommendations : null,
    vet_clinic: 'vet_clinic' in record ? record.vet_clinic : null,
    procedure_name: 'procedure_name' in record ? record.procedure_name : null,
    surgeon: 'surgeon' in record ? record.surgeon : null,
    anesthesia_used: 'anesthesia_used' in record ? record.anesthesia_used : null,
    recovery_notes: 'recovery_notes' in record ? record.recovery_notes : null,
    follow_up_date: 'follow_up_date' in record ? record.follow_up_date : null
  };
  
  const { data, error } = await supabase
    .from('health_records')
    .insert(recordData)
    .select();
    
  if (error) {
    console.error('Error adding health record:', error);
    throw error;
  }
  
  return data![0];
};

// Update a health record
export const updateHealthRecord = async (id: string, updates: Partial<Omit<HealthRecord, 'id' | 'created_at'>>) => {
  const updateData = {
    visit_date: updates.date,
    record_type: updates.record_type,
    title: updates.title,
    record_notes: updates.description,
    performed_by: updates.performed_by,
    vet_name: updates.performed_by,
    next_due_date: updates.next_due_date,
    // Type-specific fields
    vaccine_name: 'vaccine_name' in updates ? updates.vaccine_name : undefined,
    manufacturer: 'manufacturer' in updates ? updates.manufacturer : undefined,
    lot_number: 'lot_number' in updates ? updates.lot_number : undefined,
    administration_route: 'administration_route' in updates ? updates.administration_route : undefined,
    expiration_date: 'expiration_date' in updates ? updates.expiration_date : undefined,
    reminder_sent: 'reminder_sent' in updates ? updates.reminder_sent : undefined,
    medication_name: 'medication_name' in updates ? updates.medication_name : undefined,
    dosage: 'dosage' in updates ? updates.dosage : undefined,
    dosage_unit: 'dosage_unit' in updates ? updates.dosage_unit : undefined,
    frequency: 'frequency' in updates ? updates.frequency : undefined,
    duration: 'duration' in updates ? updates.duration : undefined,
    duration_unit: 'duration_unit' in updates ? updates.duration_unit : undefined,
    start_date: 'start_date' in updates ? updates.start_date : undefined,
    end_date: 'end_date' in updates ? updates.end_date : undefined,
    prescription_number: 'prescription_number' in updates ? updates.prescription_number : undefined,
    examination_type: 'examination_type' in updates ? updates.examination_type : undefined,
    findings: 'findings' in updates ? updates.findings : undefined,
    recommendations: 'recommendations' in updates ? updates.recommendations : undefined,
    vet_clinic: 'vet_clinic' in updates ? updates.vet_clinic : undefined,
    procedure_name: 'procedure_name' in updates ? updates.procedure_name : undefined,
    surgeon: 'surgeon' in updates ? updates.surgeon : undefined,
    anesthesia_used: 'anesthesia_used' in updates ? updates.anesthesia_used : undefined,
    recovery_notes: 'recovery_notes' in updates ? updates.recovery_notes : undefined,
    follow_up_date: 'follow_up_date' in updates ? updates.follow_up_date : undefined
  };
  
  const { data, error } = await supabase
    .from('health_records')
    .update(updateData)
    .eq('id', id)
    .select();
    
  if (error) {
    console.error('Error updating health record:', error);
    throw error;
  }
  
  return data![0];
};

// Delete a health record
export const deleteHealthRecord = async (id: string) => {
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
    .eq('record_type', 'vaccination')
    .lte('next_due_date', futureDate.toISOString().split('T')[0])
    .gte('next_due_date', new Date().toISOString().split('T')[0])
    .order('next_due_date', { ascending: true });
    
  if (error) {
    console.error('Error fetching upcoming vaccinations:', error);
    throw error;
  }
  
  return (data || []).map(record => ({
    id: record.id,
    dog_id: record.dog_id,
    date: record.visit_date,
    record_type: record.record_type || 'vaccination',
    title: record.title || `${record.vaccine_name || 'Vaccination'}`,
    description: record.record_notes || '',
    performed_by: record.performed_by || record.vet_name,
    next_due_date: record.next_due_date,
    created_at: record.created_at,
    vaccine_name: record.vaccine_name
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
  
  return data || [];
};

export const addWeightRecord = async (
  record: Omit<WeightRecord, 'id' | 'created_at'>
): Promise<WeightRecord> => {
  const { data, error } = await supabase
    .from('weight_records')
    .insert({
      dog_id: record.dog_id,
      date: record.date,
      weight: record.weight,
      weight_unit: record.weight_unit,
      notes: record.notes
    })
    .select();
    
  if (error) {
    console.error('Error adding weight record:', error);
    throw error;
  }
  
  return data![0];
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
