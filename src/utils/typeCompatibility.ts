
/**
 * Type compatibility helpers for ensuring consistent types across the system
 */
import { Dog, DogGender, DogStatus } from '@/types/dog';
import { WeightRecord } from '@/types/health';
import { HealthRecord, HealthRecordType } from '@/types/health';
import { Puppy } from '@/types/puppy';
import { standardizeWeightUnit, WeightUnit } from '@/types/weight-units';

/**
 * Ensures a dog object conforms to the Dog interface
 */
export function ensureDogType(dog: any): Dog {
  if (!dog) return null as unknown as Dog;
  
  // Map gender to the correct enum
  let gender: DogGender;
  if (typeof dog.gender === 'string') {
    const genderLower = dog.gender.toLowerCase();
    if (genderLower === 'male' || genderLower === 'm') {
      gender = DogGender.MALE;
    } else if (genderLower === 'female' || genderLower === 'f') {
      gender = DogGender.FEMALE;
    } else {
      gender = DogGender.MALE; // Default
    }
  } else {
    gender = dog.gender || DogGender.MALE;
  }
  
  // Map status to the correct enum
  let status: DogStatus;
  if (typeof dog.status === 'string') {
    const statusLower = dog.status.toLowerCase();
    if (Object.values(DogStatus).includes(statusLower as DogStatus)) {
      status = statusLower as DogStatus;
    } else {
      status = DogStatus.ACTIVE; // Default
    }
  } else {
    status = dog.status || DogStatus.ACTIVE;
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
    gender: gender,
    birthdate: dog.birthdate || dog.birth_date || '',
    birth_date: dog.birth_date || dog.birthdate || '',
    color: dog.color || '',
    status: status,
    created_at: dog.created_at || new Date().toISOString(),
    photo_url: dog.photo_url || '',
    is_pregnant: Boolean(dog.is_pregnant),
    dam_id: dog.dam_id || undefined,
    sire_id: dog.sire_id || undefined,
    reproductive_status: dog.reproductive_status || undefined,
    registration_number: dog.registration_number || '',
    tie_date: dog.tie_date || null,
    last_heat_date: dog.last_heat_date || null,
    next_heat_date: dog.next_heat_date || undefined,
    litter_number: dog.litter_number || 0,
    tenant_id: dog.tenant_id || undefined,
    pedigree: Boolean(dog.pedigree),
    weight: dog.weight || undefined,
    weight_unit: weightUnit
  };
}

/**
 * Ensures a puppy object conforms to the Puppy interface
 */
export function ensurePuppyType(puppy: any): Puppy {
  if (!puppy) return null as unknown as Puppy;
  
  // Normalize gender
  const gender = typeof puppy.gender === 'string' && puppy.gender.toLowerCase() === 'female' 
    ? 'Female' 
    : 'Male';
  
  // Normalize status
  const validStatuses = ['Available', 'Reserved', 'Sold', 'Unavailable'];
  const status = puppy.status && validStatuses.includes(puppy.status) 
    ? puppy.status 
    : 'Available';
  
  // Handle weight unit standardization
  let weightUnit: WeightUnit | undefined;
  if (puppy.weight_unit) {
    weightUnit = standardizeWeightUnit(puppy.weight_unit);
  }
  
  return {
    id: puppy.id || '',
    name: puppy.name || '',
    gender: gender,
    color: puppy.color || '',
    birth_date: puppy.birth_date || '',
    litter_id: puppy.litter_id || '',
    microchip_number: puppy.microchip_number || undefined,
    photo_url: puppy.photo_url || undefined,
    current_weight: puppy.current_weight || undefined,
    weight_unit: weightUnit,
    status: status,
    birth_order: puppy.birth_order || undefined,
    birth_weight: puppy.birth_weight || undefined,
    birth_time: puppy.birth_time || undefined,
    presentation: puppy.presentation || undefined,
    assistance_required: Boolean(puppy.assistance_required),
    assistance_notes: puppy.assistance_notes || undefined
  };
}

/**
 * Ensures a weight record object conforms to the WeightRecord interface
 */
export function ensureWeightRecordType(record: any): WeightRecord {
  if (!record) return null as unknown as WeightRecord;
  
  // Handle unit vs weight_unit compatibility
  const unit = standardizeWeightUnit(record.weight_unit || record.unit || 'lb');
  
  return {
    id: record.id || '',
    dog_id: record.dog_id || '',
    puppy_id: record.puppy_id || undefined,
    weight: typeof record.weight === 'number' ? record.weight : 0,
    weight_unit: unit,
    date: record.date || new Date().toISOString().split('T')[0],
    notes: record.notes || '',
    percent_change: record.percent_change !== undefined ? record.percent_change : 0,
    created_at: record.created_at || new Date().toISOString(),
    age_days: record.age_days || undefined,
    birth_date: record.birth_date || undefined
  };
}

/**
 * Ensures a health record object conforms to the HealthRecord interface
 */
export function ensureHealthRecordType(record: any): HealthRecord {
  if (!record) return null as unknown as HealthRecord;
  
  // Convert record type to enum value
  let recordType: HealthRecordType;
  if (typeof record.record_type === 'string') {
    const typeLower = record.record_type.toLowerCase();
    const enumKey = Object.keys(HealthRecordType).find(
      key => HealthRecordType[key as keyof typeof HealthRecordType].toLowerCase() === typeLower
    );
    recordType = enumKey 
      ? HealthRecordType[enumKey as keyof typeof HealthRecordType] 
      : HealthRecordType.EXAMINATION;
  } else {
    recordType = record.record_type || HealthRecordType.EXAMINATION;
  }
  
  return {
    id: record.id,
    dog_id: record.dog_id,
    puppy_id: record.puppy_id,
    record_type: recordType,
    title: record.title,
    visit_date: record.visit_date || record.date || new Date().toISOString().split('T')[0],
    vet_name: record.vet_name || '',
    description: record.description,
    document_url: record.document_url,
    record_notes: record.record_notes || record.notes,
    created_at: record.created_at,
    next_due_date: record.next_due_date
  };
}

/**
 * Convert array to a consistent format, ensuring all elements are of the specified type
 */
export function ensureArrayOfType<T>(
  arr: any[] | undefined | null, 
  transformFn: (item: any) => T
): T[] {
  if (!arr || !Array.isArray(arr)) return [];
  return arr.map(item => transformFn(item));
}
