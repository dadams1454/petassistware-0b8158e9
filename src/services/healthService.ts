
import { supabase } from '@/integrations/supabase/client';
import { HealthRecord, HealthRecordTypeEnum, WeightRecord } from '@/types/health';

// Helper function for adapting health records
export const adaptHealthRecord = (record: any): HealthRecord => {
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
    recovery_notes: record.recovery_notes
  };
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

// Update health record
export const updateHealthRecord = async (id: string, updates: Partial<HealthRecord>) => {
  const { data, error } = await supabase
    .from('health_records')
    .update(updates)
    .eq('id', id);
  
  if (error) {
    console.error('Error updating health record:', error);
    throw error;
  }
  
  return data;
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
    .insert(record);
  
  if (error) {
    console.error('Error creating health record:', error);
    throw error;
  }
  
  return data;
};

// Delete health record
export const deleteHealthRecord = async (id: string) => {
  const { data, error } = await supabase
    .from('health_records')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting health record:', error);
    throw error;
  }
  
  return data;
};

// Get weight records for a dog
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
  
  return data || [];
};
