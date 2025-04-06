
import { Dog, DogGender, DogProfile, DogStatus } from '@/types/dog';

/**
 * Maps a dog record from Supabase DB format to frontend TypeScript format
 * @param record The database record to map
 * @returns A properly typed Dog object
 */
export function mapDogFromDB(record: any): Dog {
  // Validate record exists
  if (!record) return null as unknown as Dog;

  // Normalize gender
  let gender: DogGender;
  if (record.gender === 'Male' || record.gender === 'male') {
    gender = DogGender.Male;
  } else if (record.gender === 'Female' || record.gender === 'female') {
    gender = DogGender.Female;
  } else {
    gender = DogGender.Male; // Default
  }

  // Normalize status
  let status: DogStatus;
  if (Object.values(DogStatus).includes(record.status as DogStatus)) {
    status = record.status as DogStatus;
  } else {
    status = DogStatus.Active; // Default to Active
  }

  return {
    id: record.id || '',
    name: record.name || '',
    breed: record.breed || '',
    gender: gender,
    birthdate: record.birthdate || record.birth_date || '',
    color: record.color || '',
    status: status,
    created_at: record.created_at || new Date().toISOString(),
    // Additional properties that might be used
    photo_url: record.photo_url || '',
    is_pregnant: record.is_pregnant || false,
    dam_id: record.dam_id || undefined,
    sire_id: record.sire_id || undefined,
    reproductive_status: record.reproductive_status || undefined,
    registration_number: record.registration_number || '',
    tie_date: record.tie_date || null,
    last_heat_date: record.last_heat_date || null,
    next_heat_date: record.next_heat_date || undefined,
    litter_number: record.litter_number || 0
  };
}

/**
 * Maps a dog profile record from Supabase DB format to frontend TypeScript format
 * @param record The database record to map
 * @returns A properly typed DogProfile object
 */
export function mapDogProfileFromDB(record: any): DogProfile {
  // Validate record exists
  if (!record) return null as unknown as DogProfile;

  const dog = mapDogFromDB(record);
  
  return {
    ...dog,
    birthdate: dog.birthdate || '', // Ensure birthdate is required for DogProfile
    weight: record.weight || 0,
    weight_unit: record.weight_unit || 'lb',
    pedigree: record.pedigree || false,
    requires_special_handling: record.requires_special_handling || false,
    potty_alert_threshold: record.potty_alert_threshold || 300,
    max_time_between_breaks: record.max_time_between_breaks || 360,
    vaccination_type: record.vaccination_type || '',
    vaccination_notes: record.vaccination_notes || '',
    last_vaccination_date: record.last_vaccination_date || null,
    owner_id: record.owner_id || null,
    notes: record.notes || '',
    microchip_number: record.microchip_number || '',
    registration_organization: record.registration_organization || '',
    microchip_location: record.microchip_location || '',
    group_ids: record.group_ids || []
  };
}

/**
 * Maps a frontend Dog to Supabase DB format
 * @param dog The frontend dog object to map to DB format
 * @returns An object formatted for Supabase insertion/update
 */
export function mapDogToDB(dog: Partial<Dog>): any {
  return {
    id: dog.id,
    name: dog.name,
    breed: dog.breed,
    gender: dog.gender,
    birthdate: dog.birthdate,
    color: dog.color,
    status: dog.status,
    created_at: dog.created_at,
    photo_url: dog.photo_url,
    is_pregnant: dog.is_pregnant,
    dam_id: dog.dam_id,
    sire_id: dog.sire_id,
    reproductive_status: dog.reproductive_status,
    registration_number: dog.registration_number,
    tie_date: dog.tie_date,
    last_heat_date: dog.last_heat_date,
    litter_number: dog.litter_number
  };
}

/**
 * Maps a frontend DogProfile to Supabase DB format
 * @param profile The frontend dog profile to map to DB format
 * @returns An object formatted for Supabase insertion/update
 */
export function mapDogProfileToDB(profile: Partial<DogProfile>): any {
  const dogFields = mapDogToDB(profile);
  
  return {
    ...dogFields,
    weight: profile.weight,
    weight_unit: profile.weight_unit,
    pedigree: profile.pedigree,
    requires_special_handling: profile.requires_special_handling,
    potty_alert_threshold: profile.potty_alert_threshold,
    max_time_between_breaks: profile.max_time_between_breaks,
    vaccination_type: profile.vaccination_type,
    vaccination_notes: profile.vaccination_notes,
    last_vaccination_date: profile.last_vaccination_date,
    owner_id: profile.owner_id,
    notes: profile.notes,
    microchip_number: profile.microchip_number,
    registration_organization: profile.registration_organization,
    microchip_location: profile.microchip_location,
    group_ids: profile.group_ids
  };
}
