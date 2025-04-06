
import { Puppy, PuppyWithAge } from '@/types/puppy';

/**
 * Maps a puppy record from Supabase DB format to frontend TypeScript format
 * @param record The database record to map
 * @returns A properly typed Puppy object
 */
export function mapPuppyFromDB(record: any): Puppy {
  // Validate record exists
  if (!record) return null as unknown as Puppy;

  // Normalize gender to the expected "Male" | "Female" format
  let gender: 'Male' | 'Female';
  if (record.gender === 'Male' || record.gender === 'male') {
    gender = 'Male';
  } else if (record.gender === 'Female' || record.gender === 'female') {
    gender = 'Female';
  } else {
    gender = 'Male'; // Default
  }

  // Normalize status
  const validStatuses = ['Available', 'Reserved', 'Sold', 'Unavailable'];
  const status = validStatuses.includes(record.status) ? record.status : 'Available';

  return {
    id: record.id || '',
    name: record.name || '',
    gender: gender,
    color: record.color || '',
    birth_date: record.birth_date || '',
    litter_id: record.litter_id || '',
    microchip_number: record.microchip_number || undefined,
    photo_url: record.photo_url || undefined,
    current_weight: record.current_weight || undefined,
    weight_unit: record.weight_unit || undefined,
    status: status,
    birth_order: record.birth_order || undefined,
    birth_weight: record.birth_weight || undefined,
    birth_time: record.birth_time || undefined,
    presentation: record.presentation || undefined,
    assistance_required: record.assistance_required || false,
    assistance_notes: record.assistance_notes || undefined,
    sale_price: record.sale_price || undefined,
    notes: record.notes || undefined,
    vaccination_dates: record.vaccination_dates || undefined,
    deworming_dates: record.deworming_dates || undefined,
    vet_check_dates: record.vet_check_dates || undefined,
    akc_litter_number: record.akc_litter_number || undefined,
    akc_registration_number: record.akc_registration_number || undefined,
    health_notes: record.health_notes || undefined,
    weight_notes: record.weight_notes || undefined,
    created_at: record.created_at || new Date().toISOString(),
    updated_at: record.updated_at || undefined,
    is_test_data: record.is_test_data || false,
    
    // Milestone dates
    eyes_open_date: record.eyes_open_date || undefined,
    ears_open_date: record.ears_open_date || undefined,
    first_walk_date: record.first_walk_date || undefined,
    fully_mobile_date: record.fully_mobile_date || undefined,
    reservation_date: record.reservation_date || undefined
  };
}

/**
 * Maps a puppy record with age information from Supabase DB format
 * @param record The database record to map
 * @returns A properly typed PuppyWithAge object
 */
export function mapPuppyWithAgeFromDB(record: any): PuppyWithAge {
  // Get the base puppy fields
  const puppy = mapPuppyFromDB(record);
  
  // Calculate or extract age info
  const age = record.age || record.age_days || 0;
  const ageInDays = record.ageInDays || record.age_days || age || 0;
  const ageInWeeks = record.ageInWeeks || record.age_weeks || Math.floor(ageInDays / 7) || 0;
  
  // Determine developmental stage
  let developmentalStage = record.developmentalStage || '';
  if (!developmentalStage) {
    if (ageInDays <= 14) developmentalStage = 'Neonatal';
    else if (ageInDays <= 21) developmentalStage = 'Transitional';
    else if (ageInDays <= 49) developmentalStage = 'Socialization';
    else if (ageInDays <= 84) developmentalStage = 'Juvenile';
    else developmentalStage = 'Adolescent';
  }
  
  return {
    ...puppy,
    age: age,
    ageInDays: ageInDays,
    ageInWeeks: ageInWeeks,
    developmentalStage: developmentalStage,
    weightHistory: record.weightHistory || [],
    age_days: ageInDays, // For backward compatibility
    age_weeks: ageInWeeks, // For backward compatibility
    ageDescription: record.ageDescription || undefined
  };
}

/**
 * Maps a frontend Puppy to Supabase DB format
 * @param puppy The frontend puppy to map to DB format
 * @returns An object formatted for Supabase insertion/update
 */
export function mapPuppyToDB(puppy: Partial<Puppy>): any {
  return {
    id: puppy.id,
    name: puppy.name,
    gender: puppy.gender,
    color: puppy.color,
    birth_date: puppy.birth_date,
    litter_id: puppy.litter_id,
    microchip_number: puppy.microchip_number,
    photo_url: puppy.photo_url,
    current_weight: puppy.current_weight,
    weight_unit: puppy.weight_unit,
    status: puppy.status,
    birth_order: puppy.birth_order,
    birth_weight: puppy.birth_weight,
    birth_time: puppy.birth_time,
    presentation: puppy.presentation,
    assistance_required: puppy.assistance_required,
    assistance_notes: puppy.assistance_notes,
    sale_price: puppy.sale_price,
    notes: puppy.notes,
    vaccination_dates: puppy.vaccination_dates,
    deworming_dates: puppy.deworming_dates,
    vet_check_dates: puppy.vet_check_dates,
    akc_litter_number: puppy.akc_litter_number,
    akc_registration_number: puppy.akc_registration_number,
    health_notes: puppy.health_notes,
    weight_notes: puppy.weight_notes,
    eyes_open_date: puppy.eyes_open_date,
    ears_open_date: puppy.ears_open_date,
    first_walk_date: puppy.first_walk_date,
    fully_mobile_date: puppy.fully_mobile_date,
    reservation_date: puppy.reservation_date
  };
}
