
import { Dog, DogGender, DogStatus, normalizeDogGender, normalizeDogStatus } from '@/types/dog';
import { WeightRecord } from '@/types/weight';
import { standardizeWeightUnit, WeightUnit } from '@/types/common';
import { Medication, HealthRecord, HealthRecordTypeEnum } from '@/types/health';

/**
 * Normalizes a dog record from any source to ensure it meets the Dog interface requirements
 */
export function normalizeDog(data: any): Dog {
  if (!data) return null as unknown as Dog;
  
  return {
    id: data.id || '',
    name: data.name || 'Unknown',
    breed: data.breed || 'Unknown',
    gender: normalizeDogGender(data.gender),
    color: data.color || undefined,
    birthdate: data.birthdate || data.birth_date || undefined,
    birth_date: data.birth_date || data.birthdate || undefined,
    status: normalizeDogStatus(data.status),
    created_at: data.created_at || new Date().toISOString(),
    photo_url: data.photo_url || undefined,
    is_pregnant: Boolean(data.is_pregnant),
    dam_id: data.dam_id || undefined,
    sire_id: data.sire_id || undefined,
    reproductive_status: data.reproductive_status || undefined,
    registration_number: data.registration_number || undefined,
    tie_date: data.tie_date || undefined,
    last_heat_date: data.last_heat_date || undefined,
    next_heat_date: data.next_heat_date || undefined,
    litter_number: data.litter_number || 0,
    tenant_id: data.tenant_id || undefined,
    pedigree: Boolean(data.pedigree),
    weight: data.weight || undefined,
    weight_unit: data.weight_unit ? standardizeWeightUnit(data.weight_unit) : undefined
  };
}

/**
 * Normalizes a weight record from any source to ensure it meets the WeightRecord interface requirements
 */
export function normalizeWeightRecord(data: any): WeightRecord {
  if (!data) return null as unknown as WeightRecord;
  
  // Handle unit vs weight_unit compatibility
  const unit = data.weight_unit || data.unit || 'lb';
  const weightUnit = standardizeWeightUnit(unit);
  
  return {
    id: data.id || '',
    dog_id: data.dog_id || '',
    puppy_id: data.puppy_id || undefined,
    weight: typeof data.weight === 'number' ? data.weight : 0,
    weight_unit: weightUnit,
    date: data.date || new Date().toISOString().split('T')[0],
    notes: data.notes || '',
    percent_change: data.percent_change !== undefined ? data.percent_change : 0,
    created_at: data.created_at || new Date().toISOString(),
    age_days: data.age_days || undefined,
    birth_date: data.birth_date || undefined
  };
}

/**
 * Normalizes a medication from any source to ensure it meets the Medication interface requirements
 */
export function normalizeMedication(data: any): Medication {
  if (!data) return null as unknown as Medication;
  
  return {
    id: data.id || '',
    dog_id: data.dog_id || '',
    medication_name: data.medication_name || data.name || '',
    dosage: typeof data.dosage === 'number' ? data.dosage : 0,
    dosage_unit: data.dosage_unit || '',
    frequency: data.frequency || 'daily',
    administration_route: data.administration_route || '',
    start_date: data.start_date || new Date().toISOString().split('T')[0],
    end_date: data.end_date || undefined,
    notes: data.notes || '',
    is_active: data.is_active !== undefined ? data.is_active : true,
    created_at: data.created_at || new Date().toISOString(),
    last_administered: data.last_administered || undefined
  };
}

/**
 * Normalizes a health record from any source to ensure it meets the HealthRecord interface requirements
 */
export function normalizeHealthRecord(data: any): HealthRecord {
  if (!data) return null as unknown as HealthRecord;
  
  // Try to determine record type
  let recordType: HealthRecordTypeEnum;
  const rawType = data.record_type || 'examination';
  
  if (Object.values(HealthRecordTypeEnum).includes(rawType.toUpperCase() as HealthRecordTypeEnum)) {
    recordType = HealthRecordTypeEnum[rawType.toUpperCase() as keyof typeof HealthRecordTypeEnum];
  } else {
    recordType = HealthRecordTypeEnum.EXAMINATION;
  }
  
  return {
    id: data.id || '',
    dog_id: data.dog_id || '',
    record_type: recordType,
    title: data.title || '',
    visit_date: data.visit_date || data.date || new Date().toISOString().split('T')[0],
    vet_name: data.vet_name || '',
    description: data.description || '',
    document_url: data.document_url || undefined,
    record_notes: data.record_notes || data.notes || '',
    created_at: data.created_at || new Date().toISOString(),
    next_due_date: data.next_due_date || undefined,
    performed_by: data.performed_by || undefined,
    
    // Vaccination-specific fields
    vaccine_name: data.vaccine_name || undefined,
    manufacturer: data.manufacturer || undefined,
    lot_number: data.lot_number || undefined,
    expiration_date: data.expiration_date || undefined,
    
    // Medication-specific fields
    medication_name: data.medication_name || undefined,
    dosage: data.dosage || undefined,
    dosage_unit: data.dosage_unit || undefined,
    frequency: data.frequency || undefined,
    start_date: data.start_date || undefined,
    end_date: data.end_date || undefined,
    duration: data.duration || undefined,
    duration_unit: data.duration_unit || undefined,
    administration_route: data.administration_route || undefined,
    
    // Examination-specific fields
    examination_type: data.examination_type || undefined,
    findings: data.findings || undefined,
    recommendations: data.recommendations || undefined,
    follow_up_date: data.follow_up_date || undefined,
    
    // Surgery-specific fields
    procedure_name: data.procedure_name || undefined,
    surgeon: data.surgeon || undefined,
    anesthesia_used: data.anesthesia_used || undefined,
    recovery_notes: data.recovery_notes || undefined
  };
}
