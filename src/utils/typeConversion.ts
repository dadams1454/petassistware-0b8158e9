
/**
 * Type conversion utilities
 * These functions help convert between different type formats
 * to maintain backward compatibility
 */
import { 
  Dog, Puppy, WeightRecord, HealthRecord,
  AnimalGender, DogStatus, PuppyStatus
} from '@/types/unified';
import { standardizeWeightUnit, WeightUnit } from '@/types/weight-units';

/**
 * Convert any dog-like object to a standard Dog interface
 */
export function toDog(dog: any): Dog {
  if (!dog) return null as unknown as Dog;
  
  // Normalize gender
  let gender: string;
  if (typeof dog.gender === 'string') {
    gender = dog.gender.toLowerCase() === 'male' || dog.gender.toLowerCase() === 'm' 
      ? AnimalGender.MALE 
      : AnimalGender.FEMALE;
  } else {
    gender = dog.gender || AnimalGender.MALE;
  }
  
  // Normalize status
  let status: string;
  if (typeof dog.status === 'string' && Object.values(DogStatus).includes(dog.status.toLowerCase() as DogStatus)) {
    status = dog.status.toLowerCase();
  } else {
    status = DogStatus.ACTIVE;
  }
  
  // Handle weight unit standardization
  let weightUnit: WeightUnit | undefined;
  if (dog.weight_unit) {
    weightUnit = standardizeWeightUnit(dog.weight_unit);
  }
  
  return {
    id: dog.id || '',
    name: dog.name || '',
    breed: dog.breed || '',
    gender,
    birth_date: dog.birth_date || dog.birthdate || '',
    color: dog.color || '',
    status,
    created_at: dog.created_at || new Date().toISOString(),
    photo_url: dog.photo_url || '',
    is_pregnant: Boolean(dog.is_pregnant),
    dam_id: dog.dam_id,
    sire_id: dog.sire_id,
    reproductive_status: dog.reproductive_status,
    registration_number: dog.registration_number || '',
    tie_date: dog.tie_date,
    last_heat_date: dog.last_heat_date,
    next_heat_date: dog.next_heat_date,
    litter_number: dog.litter_number || 0,
    tenant_id: dog.tenant_id,
    pedigree: Boolean(dog.pedigree),
    weight: dog.weight,
    weight_unit: weightUnit,
    notes: dog.notes,
    microchip_number: dog.microchip_number,
    requires_special_handling: Boolean(dog.requires_special_handling)
  };
}

/**
 * Convert any puppy-like object to a standard Puppy interface
 */
export function toPuppy(puppy: any): Puppy {
  if (!puppy) return null as unknown as Puppy;
  
  // Normalize gender
  let gender: string;
  if (typeof puppy.gender === 'string') {
    gender = puppy.gender.toLowerCase() === 'male' || puppy.gender.toLowerCase() === 'm' 
      ? AnimalGender.MALE 
      : AnimalGender.FEMALE;
  } else {
    gender = 'male'; // Default
  }
  
  // Normalize status
  let status: string;
  const validStatuses = Object.values(PuppyStatus);
  if (puppy.status && typeof puppy.status === 'string') {
    const normalizedStatus = puppy.status.toLowerCase();
    status = validStatuses.includes(normalizedStatus as PuppyStatus) 
      ? normalizedStatus 
      : PuppyStatus.AVAILABLE;
  } else {
    status = PuppyStatus.AVAILABLE;
  }
  
  // Handle weight unit standardization
  let weightUnit: WeightUnit | undefined;
  if (puppy.weight_unit) {
    weightUnit = standardizeWeightUnit(puppy.weight_unit);
  }
  
  return {
    id: puppy.id || '',
    name: puppy.name || '',
    gender,
    color: puppy.color || '',
    birth_date: puppy.birth_date || '',
    litter_id: puppy.litter_id || '',
    microchip_number: puppy.microchip_number,
    photo_url: puppy.photo_url,
    weight: puppy.current_weight || puppy.weight,
    weight_unit: weightUnit,
    status,
    birth_order: puppy.birth_order,
    birth_weight: puppy.birth_weight,
    birth_time: puppy.birth_time,
    presentation: puppy.presentation,
    assistance_required: Boolean(puppy.assistance_required),
    assistance_notes: puppy.assistance_notes,
    sale_price: puppy.sale_price,
    notes: puppy.notes,
    akc_litter_number: puppy.akc_litter_number,
    akc_registration_number: puppy.akc_registration_number,
    health_notes: puppy.health_notes,
    weight_notes: puppy.weight_notes,
    created_at: puppy.created_at || new Date().toISOString(),
    reservation_date: puppy.reservation_date
  };
}

/**
 * Convert any weight record to a standard WeightRecord interface
 */
export function toWeightRecord(record: any): WeightRecord {
  if (!record) return null as unknown as WeightRecord;
  
  // Handle unit vs weight_unit compatibility
  const unit = record.weight_unit || record.unit || 'lb';
  const weightUnit = standardizeWeightUnit(unit);
  
  return {
    id: record.id || '',
    dog_id: record.dog_id,
    puppy_id: record.puppy_id,
    weight: typeof record.weight === 'number' ? record.weight : parseFloat(record.weight || '0'),
    weight_unit: weightUnit,
    date: record.date || new Date().toISOString().split('T')[0],
    notes: record.notes || '',
    percent_change: record.percent_change,
    created_at: record.created_at || new Date().toISOString(),
    age_days: record.age_days,
    birth_date: record.birth_date
  };
}

/**
 * Convert any health record to a standard HealthRecord interface
 */
export function toHealthRecord(record: any): HealthRecord {
  if (!record) return null as unknown as HealthRecord;
  
  // Ensure we have a valid record type
  const recordType = record.record_type || 'examination';
  
  return {
    id: record.id || '',
    dog_id: record.dog_id,
    puppy_id: record.puppy_id,
    record_type: recordType,
    title: record.title || '',
    date: record.date || record.visit_date || new Date().toISOString().split('T')[0],
    record_notes: record.record_notes || record.notes || '',
    document_url: record.document_url,
    created_at: record.created_at || new Date().toISOString(),
    next_due_date: record.next_due_date,
    performed_by: record.performed_by,
    vet_name: record.vet_name || ''
  };
}
