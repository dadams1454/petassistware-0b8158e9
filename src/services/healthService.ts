import { supabase } from '@/integrations/supabase/client';
import { HealthRecord, HealthRecordTypeEnum, WeightRecord } from '@/types/health';

// Helper function for adapting health records
const adaptHealthRecord = (record: any): HealthRecord => {
  return {
    id: record.id,
    dog_id: record.dog_id,
    record_type: record.record_type as HealthRecordTypeEnum,
    title: record.title,
    description: record.description,
    performed_by: record.performed_by,
    visit_date: record.visit_date,
    date: record.date,
    next_due_date: record.next_due_date,
    record_notes: record.record_notes,
    document_url: record.document_url,
    vet_name: record.vet_name,
    created_at: record.created_at,
    updated_at: record.updated_at,
    
    // Additional properties
    medication_name: record.medication_name,
    dosage: record.dosage,
    dosage_unit: record.dosage_unit,
    frequency: record.frequency,
    start_date: record.start_date,
    end_date: record.end_date,
    vaccine_name: record.vaccine_name,
    manufacturer: record.manufacturer,
    lot_number: record.lot_number,
    expiration_date: record.expiration_date,
    examination_type: record.examination_type,
    findings: record.findings,
    recommendations: record.recommendations,
    follow_up_date: record.follow_up_date,
    procedure_name: record.procedure_name,
    surgeon: record.surgeon,
    anesthesia_used: record.anesthesia_used,
    recovery_notes: record.recovery_notes,
    
    // Additional medication properties
    prescribed_by: record.prescribed_by,
    pharmacy: record.pharmacy,
    prescription_number: record.prescription_number,
    refills_remaining: record.refills_remaining,
    
    // Additional examination properties
    exam_type: record.exam_type,
    vet_clinic: record.vet_clinic,
    examiner: record.examiner,
    facility: record.facility,
    
    // Additional properties that might be required
    duration: record.duration,
    duration_unit: record.duration_unit,
    administration_route: record.administration_route
  };
};

// Weight Records Functions

// Get weight history for a dog
export const getWeightHistory = async (dogId: string): Promise<WeightRecord[]> => {
  const { data, error } = await supabase
    .from('weight_records')
    .select('*')
    .eq('dog_id', dogId)
    .order('date', { ascending: true });
  
  if (error) {
    console.error('Error fetching weight history:', error);
    throw error;
  }
  
  return data.map(record => ({
    id: record.id,
    dog_id: record.dog_id,
    date: record.date,
    weight: record.weight,
    unit: record.weight_unit, // Map to unit property for compatibility
    weight_unit: record.weight_unit,
    notes: record.notes,
    created_at: record.created_at,
    percent_change: record.percent_change
  })) as WeightRecord[];
};

// Add a weight record
export const addWeightRecord = async (record: Omit<WeightRecord, 'id' | 'created_at'>): Promise<WeightRecord> => {
  // Calculate percent change if previous records exist
  let percentChange = null;
  
  if (record.dog_id) {
    const { data: previousRecords } = await supabase
      .from('weight_records')
      .select('*')
      .eq('dog_id', record.dog_id)
      .order('date', { ascending: false })
      .limit(1);
    
    if (previousRecords && previousRecords.length > 0) {
      const prevRecord = previousRecords[0];
      if (prevRecord.weight_unit === record.weight_unit) {
        percentChange = ((record.weight - prevRecord.weight) / prevRecord.weight) * 100;
      }
    }
  }
  
  // Ensure both unit and weight_unit are set correctly
  const recordData = {
    ...record,
    unit: record.unit || record.weight_unit, // Ensure both are set
    weight_unit: record.weight_unit || record.unit,
    percent_change: percentChange
  };
  
  const { data, error } = await supabase
    .from('weight_records')
    .insert(recordData)
    .select()
    .single();
  
  if (error) {
    console.error('Error adding weight record:', error);
    throw error;
  }
  
  return {
    id: data.id,
    dog_id: data.dog_id,
    date: data.date,
    weight: data.weight,
    unit: data.weight_unit,
    weight_unit: data.weight_unit,
    notes: data.notes,
    created_at: data.created_at,
    percent_change: data.percent_change
  } as WeightRecord;
};

// Delete a weight record
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

// Health Records Functions

// Get health records for a dog
export const getHealthRecords = async (dogId: string): Promise<HealthRecord[]> => {
  const { data, error } = await supabase
    .from('health_records')
    .select('*')
    .eq('dog_id', dogId)
    .order('date', { ascending: false });
  
  if (error) {
    console.error('Error fetching health records:', error);
    throw error;
  }
  
  return (data || []).map(adaptHealthRecord);
};

// Get health records by type
export const getHealthRecordsByType = async (dogId: string, recordType: HealthRecordTypeEnum): Promise<HealthRecord[]> => {
  const { data, error } = await supabase
    .from('health_records')
    .select('*')
    .eq('dog_id', dogId)
    .eq('record_type', recordType)
    .order('date', { ascending: false });
  
  if (error) {
    console.error(`Error fetching ${recordType} records:`, error);
    throw error;
  }
  
  return (data || []).map(adaptHealthRecord);
};

// Create a new health record
export const createHealthRecord = async (record: Omit<HealthRecord, 'id' | 'created_at'>) => {
  // Set default record type if not provided
  if (!record.record_type) {
    record.record_type = HealthRecordTypeEnum.Examination;
  }
  
  // Handle record-type specific fields
  if (record.record_type === HealthRecordTypeEnum.Medication) {
    // Ensure medication fields are properly set
    if (record.medication_name) record.medication_name = record.medication_name;
    if (record.dosage) record.dosage = record.dosage;
    if (record.dosage_unit) record.dosage_unit = record.dosage_unit;
    if (record.frequency) record.frequency = record.frequency;
    if (record.start_date) record.start_date = record.start_date;
    if (record.end_date) record.end_date = record.end_date;
    if (record.prescribed_by) record.prescribed_by = record.prescribed_by;
    if (record.pharmacy) record.pharmacy = record.pharmacy;
    if (record.prescription_number) record.prescription_number = record.prescription_number;
    if (record.refills_remaining) record.refills_remaining = record.refills_remaining;
  } else if (record.record_type === HealthRecordTypeEnum.Vaccination) {
    // Ensure vaccination fields are properly set
    if (record.vaccine_name) record.vaccine_name = record.vaccine_name;
    if (record.vaccine_type) record.vaccine_type = record.vaccine_type;
    if (record.manufacturer) record.manufacturer = record.manufacturer;
    if (record.lot_number) record.lot_number = record.lot_number;
    if (record.expiration_date) record.expiration_date = record.expiration_date;
  } else if (record.record_type === HealthRecordTypeEnum.Examination) {
    // Ensure examination fields are properly set
    if (record.examination_type) record.examination_type = record.examination_type;
    if (record.exam_type) record.exam_type = record.exam_type;
    if (record.findings) record.findings = record.findings;
    if (record.recommendations) record.recommendations = record.recommendations;
    if (record.vet_clinic) record.vet_clinic = record.vet_clinic;
    if (record.follow_up_date) record.follow_up_date = record.follow_up_date;
    if (record.examiner) record.examiner = record.examiner;
    if (record.facility) record.facility = record.facility;
  } else if (record.record_type === HealthRecordTypeEnum.Surgery) {
    // Ensure surgery fields are properly set
    if (record.procedure_name) record.procedure_name = record.procedure_name;
    if (record.surgeon) record.surgeon = record.surgeon;
    if (record.anesthesia_used) record.anesthesia_used = record.anesthesia_used;
    if (record.recovery_notes) record.recovery_notes = record.recovery_notes;
  }
  
  const { data, error } = await supabase
    .from('health_records')
    .insert([record])
    .select();
  
  if (error) {
    console.error('Error creating health record:', error);
    throw error;
  }
  
  return data && data.length > 0 ? adaptHealthRecord(data[0]) : null;
};

// Add a health record (alias for createHealthRecord)
export const addHealthRecord = createHealthRecord;

// Update health record
export const updateHealthRecord = async (id: string, updates: Partial<HealthRecord>) => {
  const { data, error } = await supabase
    .from('health_records')
    .update(updates)
    .eq('id', id)
    .select();
  
  if (error) {
    console.error('Error updating health record:', error);
    throw error;
  }
  
  return data && data.length > 0 ? adaptHealthRecord(data[0]) : null;
};

// Delete health record
export const deleteHealthRecord = async (id: string) => {
  const { error } = await supabase
    .from('health_records')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting health record:', error);
    throw error;
  }
  
  return true;
};

// Get weight records for a dog (similar to getWeightHistory but with a different name)
export const getWeightRecords = async (dogId: string): Promise<WeightRecord[]> => {
  const { data, error } = await supabase
    .from('weight_records')
    .select('*')
    .eq('dog_id', dogId)
    .order('date', { ascending: false });
  
  if (error) {
    console.error('Error fetching weight records:', error);
    throw error;
  }
  
  return data.map(record => ({
    id: record.id,
    dog_id: record.dog_id,
    date: record.date,
    weight: record.weight,
    unit: record.weight_unit,
    weight_unit: record.weight_unit,
    notes: record.notes,
    created_at: record.created_at,
    percent_change: record.percent_change
  })) as WeightRecord[];
};

// Get upcoming medications
export const getUpcomingMedications = async (dogId?: string): Promise<HealthRecord[]> => {
  let query = supabase
    .from('health_records')
    .select('*')
    .eq('record_type', HealthRecordTypeEnum.Medication)
    .lte('next_due_date', new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
    .gte('next_due_date', new Date().toISOString().split('T')[0])
    .order('next_due_date');
  
  if (dogId) {
    query = query.eq('dog_id', dogId);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error('Error fetching upcoming medications:', error);
    return [];
  }
  
  return (data || []).map(adaptHealthRecord);
};

// Get expiring medications
export const getExpiringMedications = async (dogId?: string): Promise<HealthRecord[]> => {
  let query = supabase
    .from('health_records')
    .select('*')
    .eq('record_type', HealthRecordTypeEnum.Medication)
    .lte('expiration_date', new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
    .gte('expiration_date', new Date().toISOString().split('T')[0])
    .order('expiration_date');
  
  if (dogId) {
    query = query.eq('dog_id', dogId);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error('Error fetching expiring medications:', error);
    return [];
  }
  
  return (data || []).map(adaptHealthRecord);
};

// Get upcoming vaccinations
export const getUpcomingVaccinations = async (dogId?: string): Promise<HealthRecord[]> => {
  let query = supabase
    .from('health_records')
    .select('*')
    .eq('record_type', HealthRecordTypeEnum.Vaccination)
    .lte('next_due_date', new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
    .gte('next_due_date', new Date().toISOString().split('T')[0])
    .order('next_due_date');
  
  if (dogId) {
    query = query.eq('dog_id', dogId);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error('Error fetching upcoming vaccinations:', error);
    return [];
  }
  
  return (data || []).map(adaptHealthRecord);
};
