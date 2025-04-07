
import { Dog as CoreDog, DogGender, DogStatus } from '@/types/dog';
import { Dog as ModuleDog } from '@/modules/dogs/types/dog';
import { Puppy as CorePuppy } from '@/types/puppy';
import { Puppy as LitterPuppy } from '@/components/litters/puppies/types';
import { WeightRecord as CoreWeightRecord } from '@/types/weight';
import { WeightRecord as ModuleWeightRecord } from '@/modules/dogs/types/dog';
import { standardizeWeightUnit, WeightUnit } from '@/types/common';

/**
 * Maps between different Dog type definitions in the codebase 
 * to ensure compatibility between components
 */
export function mapToCoreDog(dog: ModuleDog | any): CoreDog {
  if (!dog) return null as unknown as CoreDog;
  
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
 * Maps between different Puppy type definitions in the codebase
 * to ensure compatibility between components
 */
export function mapToCorePuppy(puppy: LitterPuppy | any): CorePuppy {
  if (!puppy) return null as unknown as CorePuppy;
  
  // Normalize gender to 'Male' | 'Female'
  let gender: 'Male' | 'Female';
  if (typeof puppy.gender === 'string') {
    const genderStr = String(puppy.gender);
    if (genderStr.toLowerCase() === 'male') {
      gender = 'Male';
    } else if (genderStr.toLowerCase() === 'female') {
      gender = 'Female';
    } else {
      gender = 'Male'; // Default
    }
  } else {
    gender = 'Male'; // Default
  }
  
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
    assistance_notes: puppy.assistance_notes || undefined,
    sale_price: puppy.sale_price || undefined,
    notes: puppy.notes || undefined,
    vaccination_dates: puppy.vaccination_dates || undefined,
    deworming_dates: puppy.deworming_dates || undefined,
    vet_check_dates: puppy.vet_check_dates || undefined,
    akc_litter_number: puppy.akc_litter_number || undefined,
    akc_registration_number: puppy.akc_registration_number || undefined,
    health_notes: puppy.health_notes || undefined,
    weight_notes: puppy.weight_notes || undefined,
    created_at: puppy.created_at || new Date().toISOString(),
    eyes_open_date: puppy.eyes_open_date || undefined,
    ears_open_date: puppy.ears_open_date || undefined,
    first_walk_date: puppy.first_walk_date || undefined,
    fully_mobile_date: puppy.fully_mobile_date || undefined,
    reservation_date: puppy.reservation_date || undefined
  };
}

/**
 * Maps between different WeightRecord type definitions in the codebase
 * to ensure compatibility between components 
 */
export function mapToWeightRecord(record: ModuleWeightRecord | any): CoreWeightRecord {
  if (!record) return null as unknown as CoreWeightRecord;
  
  // Handle unit vs weight_unit compatibility
  const unit = record.weight_unit || record.unit || 'lb';
  const weightUnit = standardizeWeightUnit(unit);
  
  return {
    id: record.id || '',
    dog_id: record.dog_id || '',
    puppy_id: record.puppy_id || undefined,
    weight: typeof record.weight === 'number' ? record.weight : 0,
    weight_unit: weightUnit,
    date: record.date || new Date().toISOString().split('T')[0],
    notes: record.notes || '',
    percent_change: record.percent_change !== undefined ? record.percent_change : 0,
    created_at: record.created_at || new Date().toISOString(),
    age_days: record.age_days || undefined,
    birth_date: record.birth_date || undefined
  };
}

/**
 * Updates the exports in the mappers/index.ts file to include the new mapper
 */
export function mapToModuleDog(dog: CoreDog): ModuleDog {
  if (!dog) return null as unknown as ModuleDog;
  
  let gender = 'male';
  if (dog.gender === DogGender.FEMALE || dog.gender === DogGender.FEMALE_LOWER) {
    gender = 'female';
  }
  
  return {
    id: dog.id || '',
    name: dog.name || '',
    breed: dog.breed || '',
    gender: gender as any,
    birthdate: dog.birthdate || dog.birth_date || '',
    color: dog.color || '',
    status: dog.status?.toLowerCase() as any,
    is_pregnant: dog.is_pregnant,
    last_heat_date: dog.last_heat_date,
    tie_date: dog.tie_date,
    photo_url: dog.photo_url,
    weight: dog.weight,
    weight_unit: dog.weight_unit
  };
}

