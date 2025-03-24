
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
  
  // Map to the HealthRecord type with explicit casting for type safety
  return (data || []).map(record => ({
    id: record.id,
    dog_id: record.dog_id,
    date: record.visit_date,
    record_type: (record.record_type as HealthRecordType) || 'examination',
    title: record.title || `${record.vet_name} Visit`,
    description: record.record_notes || '',
    performed_by: record.performed_by || record.vet_name,
    next_due_date: record.next_due_date,
    created_at: record.created_at,
    // We don't map updated_at if it doesn't exist
    ...(record.updated_at && { updated_at: record.updated_at }),
    // Extended fields for specific record types - all properly typed
    ...(record.vaccine_name && { vaccine_name: record.vaccine_name }),
    ...(record.manufacturer && { manufacturer: record.manufacturer }),
    ...(record.lot_number && { lot_number: record.lot_number }),
    ...(record.administration_route && { administration_route: record.administration_route }),
    ...(record.expiration_date && { expiration_date: record.expiration_date }),
    ...(record.reminder_sent !== undefined && { reminder_sent: record.reminder_sent }),
    ...(record.medication_name && { medication_name: record.medication_name }),
    ...(record.dosage !== undefined && { dosage: record.dosage }),
    ...(record.dosage_unit && { dosage_unit: record.dosage_unit }),
    ...(record.frequency && { frequency: record.frequency }),
    ...(record.duration !== undefined && { duration: record.duration }),
    ...(record.duration_unit && { duration_unit: record.duration_unit }),
    ...(record.start_date && { start_date: record.start_date }),
    ...(record.end_date && { end_date: record.end_date }),
    ...(record.prescription_number && { prescription_number: record.prescription_number }),
    ...(record.examination_type && { examination_type: record.examination_type }),
    ...(record.findings && { findings: record.findings }),
    ...(record.recommendations && { recommendations: record.recommendations }),
    ...(record.vet_clinic && { vet_clinic: record.vet_clinic }),
    ...(record.procedure_name && { procedure_name: record.procedure_name }),
    ...(record.surgeon && { surgeon: record.surgeon }),
    ...(record.anesthesia_used && { anesthesia_used: record.anesthesia_used }),
    ...(record.recovery_notes && { recovery_notes: record.recovery_notes }),
    ...(record.follow_up_date && { follow_up_date: record.follow_up_date })
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
  
  // Reuse a similar mapping function but with explicit casting for safety
  return (data || []).map(record => ({
    id: record.id,
    dog_id: record.dog_id,
    date: record.visit_date,
    record_type: (record.record_type as HealthRecordType) || 'examination',
    title: record.title || `${record.vet_name} Visit`,
    description: record.record_notes || '',
    performed_by: record.performed_by || record.vet_name,
    next_due_date: record.next_due_date,
    created_at: record.created_at,
    ...(record.updated_at && { updated_at: record.updated_at }),
    // Extended fields based on record type
    ...(record.vaccine_name && { vaccine_name: record.vaccine_name }),
    ...(record.manufacturer && { manufacturer: record.manufacturer }),
    ...(record.lot_number && { lot_number: record.lot_number }),
    ...(record.administration_route && { administration_route: record.administration_route }),
    ...(record.expiration_date && { expiration_date: record.expiration_date }),
    ...(record.reminder_sent !== undefined && { reminder_sent: record.reminder_sent }),
    ...(record.medication_name && { medication_name: record.medication_name }),
    ...(record.dosage !== undefined && { dosage: record.dosage }),
    ...(record.dosage_unit && { dosage_unit: record.dosage_unit }),
    ...(record.frequency && { frequency: record.frequency }),
    ...(record.duration !== undefined && { duration: record.duration }),
    ...(record.duration_unit && { duration_unit: record.duration_unit }),
    ...(record.start_date && { start_date: record.start_date }),
    ...(record.end_date && { end_date: record.end_date }),
    ...(record.prescription_number && { prescription_number: record.prescription_number }),
    ...(record.examination_type && { examination_type: record.examination_type }),
    ...(record.findings && { findings: record.findings }),
    ...(record.recommendations && { recommendations: record.recommendations }),
    ...(record.vet_clinic && { vet_clinic: record.vet_clinic }),
    ...(record.procedure_name && { procedure_name: record.procedure_name }),
    ...(record.surgeon && { surgeon: record.surgeon }),
    ...(record.anesthesia_used && { anesthesia_used: record.anesthesia_used }),
    ...(record.recovery_notes && { recovery_notes: record.recovery_notes }),
    ...(record.follow_up_date && { follow_up_date: record.follow_up_date })
  })) as HealthRecord[];
};

// Add a new health record
export const addHealthRecord = async (record: Omit<HealthRecord, 'id' | 'created_at'>) => {
  // Type-safe creation of record data for Supabase
  const recordData = {
    dog_id: record.dog_id,
    visit_date: record.date,
    record_type: record.record_type,
    title: record.title,
    record_notes: record.description,
    performed_by: record.performed_by,
    vet_name: record.performed_by,
    next_due_date: record.next_due_date,
    // Type-specific fields with proper type handling
    ...(record.vaccine_name && { vaccine_name: record.vaccine_name }),
    ...(record.manufacturer && { manufacturer: record.manufacturer }),
    ...(record.lot_number && { lot_number: record.lot_number }),
    ...(record.administration_route && { administration_route: record.administration_route }),
    ...(record.expiration_date && { expiration_date: record.expiration_date }),
    ...(record.reminder_sent !== undefined && { reminder_sent: record.reminder_sent }),
    ...(record.medication_name && { medication_name: record.medication_name }),
    ...(record.dosage !== undefined && { dosage: record.dosage }),
    ...(record.dosage_unit && { dosage_unit: record.dosage_unit }),
    ...(record.frequency && { frequency: record.frequency }),
    ...(record.duration !== undefined && { duration: record.duration }),
    ...(record.duration_unit && { duration_unit: record.duration_unit }),
    ...(record.start_date && { start_date: record.start_date }),
    ...(record.end_date && { end_date: record.end_date }),
    ...(record.prescription_number && { prescription_number: record.prescription_number }),
    ...(record.examination_type && { examination_type: record.examination_type }),
    ...(record.findings && { findings: record.findings }),
    ...(record.recommendations && { recommendations: record.recommendations }),
    ...(record.vet_clinic && { vet_clinic: record.vet_clinic }),
    ...(record.procedure_name && { procedure_name: record.procedure_name }),
    ...(record.surgeon && { surgeon: record.surgeon }),
    ...(record.anesthesia_used && { anesthesia_used: record.anesthesia_used }),
    ...(record.recovery_notes && { recovery_notes: record.recovery_notes }),
    ...(record.follow_up_date && { follow_up_date: record.follow_up_date })
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
  // Type-safe update fields for Supabase
  const updateData = {
    ...(updates.date && { visit_date: updates.date }),
    ...(updates.record_type && { record_type: updates.record_type }),
    ...(updates.title && { title: updates.title }),
    ...(updates.description && { record_notes: updates.description }),
    ...(updates.performed_by && { performed_by: updates.performed_by, vet_name: updates.performed_by }),
    ...(updates.next_due_date && { next_due_date: updates.next_due_date }),
    // Type-specific fields with proper type handling
    ...(updates.vaccine_name !== undefined && { vaccine_name: updates.vaccine_name }),
    ...(updates.manufacturer !== undefined && { manufacturer: updates.manufacturer }),
    ...(updates.lot_number !== undefined && { lot_number: updates.lot_number }),
    ...(updates.administration_route !== undefined && { administration_route: updates.administration_route }),
    ...(updates.expiration_date !== undefined && { expiration_date: updates.expiration_date }),
    ...(updates.reminder_sent !== undefined && { reminder_sent: updates.reminder_sent }),
    ...(updates.medication_name !== undefined && { medication_name: updates.medication_name }),
    ...(updates.dosage !== undefined && { dosage: updates.dosage }),
    ...(updates.dosage_unit !== undefined && { dosage_unit: updates.dosage_unit }),
    ...(updates.frequency !== undefined && { frequency: updates.frequency }),
    ...(updates.duration !== undefined && { duration: updates.duration }),
    ...(updates.duration_unit !== undefined && { duration_unit: updates.duration_unit }),
    ...(updates.start_date !== undefined && { start_date: updates.start_date }),
    ...(updates.end_date !== undefined && { end_date: updates.end_date }),
    ...(updates.prescription_number !== undefined && { prescription_number: updates.prescription_number }),
    ...(updates.examination_type !== undefined && { examination_type: updates.examination_type }),
    ...(updates.findings !== undefined && { findings: updates.findings }),
    ...(updates.recommendations !== undefined && { recommendations: updates.recommendations }),
    ...(updates.vet_clinic !== undefined && { vet_clinic: updates.vet_clinic }),
    ...(updates.procedure_name !== undefined && { procedure_name: updates.procedure_name }),
    ...(updates.surgeon !== undefined && { surgeon: updates.surgeon }),
    ...(updates.anesthesia_used !== undefined && { anesthesia_used: updates.anesthesia_used }),
    ...(updates.recovery_notes !== undefined && { recovery_notes: updates.recovery_notes }),
    ...(updates.follow_up_date !== undefined && { follow_up_date: updates.follow_up_date })
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
    record_type: 'vaccination' as HealthRecordType,
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
  
  // Explicitly cast the weight_unit to ensure type safety
  return (data || []).map(record => ({
    id: record.id,
    dog_id: record.dog_id,
    date: record.date,
    weight: record.weight,
    weight_unit: record.weight_unit as "lbs" | "kg" | "g" | "oz",
    notes: record.notes,
    created_at: record.created_at
  }));
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
  
  // Explicitly cast the weight_unit to ensure type safety
  return {
    id: data![0].id,
    dog_id: data![0].dog_id,
    date: data![0].date,
    weight: data![0].weight,
    weight_unit: data![0].weight_unit as "lbs" | "kg" | "g" | "oz",
    notes: data![0].notes,
    created_at: data![0].created_at
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
