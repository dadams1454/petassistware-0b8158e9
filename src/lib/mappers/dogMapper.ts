
import { DogGender, DogStatus } from '@/types/enums';
import { Dog } from '@/types/dog';
import { DogProfile } from '@/types/dog';
import { WeightUnit, standardizeWeightUnit } from '@/types/weight-units';

/**
 * Maps data from the database to a Dog object
 */
export function mapDogFromDB(dog: any): Dog {
  if (!dog) {
    return null as unknown as Dog;
  }

  // Handle gender conversion
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

  // Handle status conversion
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
 * Maps a Dog object to a DogProfile object with all additional fields
 */
export function mapDogToProfile(dog: Dog, additionalData: any = {}): DogProfile {
  return {
    id: dog.id,
    name: dog.name,
    breed: dog.breed,
    gender: dog.gender,
    birthdate: dog.birthdate || dog.birth_date || '',
    color: dog.color || '',
    weight: dog.weight,
    weight_unit: dog.weight_unit,
    pedigree: dog.pedigree,
    requires_special_handling: additionalData.requires_special_handling,
    potty_alert_threshold: additionalData.potty_alert_threshold,
    max_time_between_breaks: additionalData.max_time_between_breaks,
    vaccination_type: additionalData.vaccination_type,
    vaccination_notes: additionalData.vaccination_notes,
    last_vaccination_date: additionalData.last_vaccination_date,
    owner_id: additionalData.owner_id,
    sire_id: dog.sire_id,
    dam_id: dog.dam_id,
    registration_organization: additionalData.registration_organization,
    microchip_location: additionalData.microchip_location,
    group_ids: additionalData.group_ids,
    reproductive_status: dog.reproductive_status,
    status: dog.status,
    registration_number: dog.registration_number,
    microchip_number: additionalData.microchip_number,
    notes: additionalData.notes,
    is_pregnant: dog.is_pregnant,
    photo_url: dog.photo_url,
    created_at: dog.created_at,
    litter_number: dog.litter_number,
    tenant_id: dog.tenant_id,
  } as DogProfile;
}

/**
 * Maps a database record to profile data 
 */
export function mapProfileFromDB(record: any): DogProfile {
  const dog = mapDogFromDB(record);
  return mapDogToProfile(dog, record);
}
