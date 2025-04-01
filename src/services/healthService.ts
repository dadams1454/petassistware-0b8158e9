import { supabase } from '@/integrations/supabase/client';
import { 
  HealthRecord, 
  HealthRecordTypeEnum, 
  HealthRecordType,
  WeightRecord,
  WeightUnitEnum,
  adaptHealthRecord,
  adaptWeightRecord
} from '@/types/health';

// Health Records
export const getHealthRecords = async (dogId: string): Promise<HealthRecord[]> => {
  const { data, error } = await supabase
    .from('health_records')
    .select('*')
    .eq('dog_id', dogId)
    .order('visit_date', { ascending: false });

  if (error) throw error;
  
  // Map the database records to our interface
  return (data || []).map(record => adaptHealthRecord(record));
};

export const getHealthRecordsByType = async (dogId: string, type: HealthRecordType): Promise<HealthRecord[]> => {
  const { data, error } = await supabase
    .from('health_records')
    .select('*')
    .eq('dog_id', dogId)
    .eq('record_type', type)
    .order('visit_date', { ascending: false });

  if (error) throw error;
  
  return (data || []).map(record => adaptHealthRecord(record));
};

export const addHealthRecord = async (record: Omit<HealthRecord, 'id' | 'created_at'>): Promise<HealthRecord> => {
  // Prepare database record from our interface
  const dbRecord = {
    dog_id: record.dog_id,
    record_type: record.record_type,
    title: record.title,
    description: record.description,
    visit_date: record.date || record.visit_date,
    performed_by: record.performed_by,
    next_due_date: record.next_due_date,
    vet_name: record.performed_by || '',  // Ensure vet_name is provided
    record_notes: record.description || '', // Map description to record_notes
    // Convert string dosage to numeric if needed
    dosage: record.dosage ? 
      (typeof record.dosage === 'string' ? parseFloat(record.dosage) : record.dosage) : 
      null,
    // Convert string duration to numeric if needed
    duration: record.duration ? 
      (typeof record.duration === 'string' ? parseFloat(record.duration.toString()) : record.duration) : 
      null,
    // Include any other relevant fields
    medication_name: record.medication_name,
    dosage_unit: record.dosage_unit,
    frequency: record.frequency,
    duration_unit: record.duration_unit,
    start_date: record.start_date,
    end_date: record.end_date,
    prescribed_by: record.prescribed_by,
    pharmacy: record.pharmacy,
    prescription_number: record.prescription_number,
    refills_remaining: record.refills_remaining,
    // Other fields that might be useful
    vaccine_type: record.vaccine_type,
    vaccine_name: record.vaccine_name,
    manufacturer: record.manufacturer,
    lot_number: record.lot_number,
    expiration_date: record.expiration_date,
    administration_route: record.administration_route,
    // Exam fields
    exam_type: record.exam_type,
    examination_type: record.examination_type,
    findings: record.findings,
    recommendations: record.recommendations,
    follow_up_date: record.follow_up_date,
    examiner: record.examiner,
    facility: record.facility,
    // Surgery fields
    procedure_name: record.procedure_name,
    surgeon: record.surgeon,
    anesthesia_used: record.anesthesia_used,
    recovery_notes: record.recovery_notes
  };

  const { data, error } = await supabase
    .from('health_records')
    .insert(dbRecord)
    .select()
    .single();

  if (error) throw error;
  
  return adaptHealthRecord(data);
};

export const updateHealthRecord = async (id: string, updates: Partial<HealthRecord>): Promise<HealthRecord> => {
  // Handle type conversions
  const dbUpdates: any = { ...updates };
  
  // Convert string dosage to numeric if needed
  if (updates.dosage !== undefined) {
    dbUpdates.dosage = typeof updates.dosage === 'string' ? parseFloat(updates.dosage) : updates.dosage;
  }
  
  // Convert string duration to numeric if needed
  if (updates.duration !== undefined) {
    dbUpdates.duration = typeof updates.duration === 'string' ? parseFloat(updates.duration.toString()) : updates.duration;
  }
  
  // Additional mappings
  if (updates.date) dbUpdates.visit_date = updates.date;
  if (updates.visit_date) dbUpdates.visit_date = updates.visit_date;
  if (updates.performed_by) dbUpdates.vet_name = updates.performed_by;
  if (updates.description) dbUpdates.record_notes = updates.description;

  const { data, error } = await supabase
    .from('health_records')
    .update(dbUpdates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  
  return adaptHealthRecord(data);
};

export const deleteHealthRecord = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('health_records')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

export const getUpcomingVaccinations = async (dogId: string, daysAhead = 30): Promise<HealthRecord[]> => {
  const today = new Date();
  const futureDate = new Date();
  futureDate.setDate(today.getDate() + daysAhead);
  
  const { data, error } = await supabase
    .from('health_records')
    .select('*')
    .eq('dog_id', dogId)
    .eq('record_type', HealthRecordTypeEnum.Vaccination)
    .gte('next_due_date', today.toISOString().split('T')[0])
    .lte('next_due_date', futureDate.toISOString().split('T')[0])
    .order('next_due_date', { ascending: true });

  if (error) throw error;
  
  return (data || []).map(record => adaptHealthRecord(record));
};

// Weight Records
export const getWeightHistory = async (dogId: string): Promise<WeightRecord[]> => {
  const { data, error } = await supabase
    .from('weight_records')
    .select('*')
    .eq('dog_id', dogId)
    .order('date', { ascending: false });

  if (error) throw error;
  
  return (data || []).map(record => adaptWeightRecord(record));
};

export const addWeightRecord = async (record: Omit<WeightRecord, 'id' | 'created_at'>): Promise<WeightRecord> => {
  const { data, error } = await supabase
    .from('weight_records')
    .insert([
      {
        dog_id: record.dog_id,
        weight: record.weight,
        weight_unit: record.unit || record.weight_unit, // Use unit if provided, otherwise use weight_unit
        date: record.date,
        notes: record.notes
      }
    ])
    .select()
    .single();

  if (error) throw error;
  
  return adaptWeightRecord(data);
};

export const deleteWeightRecord = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('weight_records')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

// Medication Management
export const getUpcomingMedications = async (dogId: string, daysAhead = 30): Promise<HealthRecord[]> => {
  const today = new Date();
  const futureDate = new Date();
  futureDate.setDate(today.getDate() + daysAhead);
  
  const { data, error } = await supabase
    .from('health_records')
    .select('*')
    .eq('dog_id', dogId)
    .eq('record_type', HealthRecordTypeEnum.Medication)
    .gte('next_due_date', today.toISOString().split('T')[0])
    .lte('next_due_date', futureDate.toISOString().split('T')[0])
    .order('next_due_date', { ascending: true });

  if (error) throw error;
  
  return (data || []).map(record => adaptHealthRecord(record));
};

export const getExpiringMedications = async (daysAhead = 30): Promise<HealthRecord[]> => {
  const today = new Date();
  const futureDate = new Date();
  futureDate.setDate(today.getDate() + daysAhead);
  
  const { data, error } = await supabase
    .from('health_records')
    .select('*')
    .eq('record_type', HealthRecordTypeEnum.Medication)
    .not('expiration_date', 'is', null)
    .gte('expiration_date', today.toISOString().split('T')[0])
    .lte('expiration_date', futureDate.toISOString().split('T')[0])
    .order('expiration_date', { ascending: true });

  if (error) throw error;
  
  return (data || []).map(record => adaptHealthRecord(record));
};
