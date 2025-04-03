
import { Litter } from '@/types';
import { LitterFormData } from '../types/litterFormTypes';

/**
 * Get default form values, merging initialData if available
 */
export const getDefaultFormValues = (initialData?: Partial<Litter>, defaultDate: Date = new Date()): LitterFormData => {
  // Default values for a new litter
  const defaults: LitterFormData = {
    litter_name: '',
    dam_id: '',
    sire_id: '',
    birth_date: defaultDate,
    status: 'active',
    male_count: 0,
    female_count: 0,
    notes: '',
    breeding_notes: ''
  };

  // If no initialData, return defaults
  if (!initialData) return defaults;

  // Convert birth_date to Date object if it's a string
  let birthDate = initialData.birth_date 
    ? (typeof initialData.birth_date === 'string' 
        ? new Date(initialData.birth_date) 
        : initialData.birth_date)
    : defaultDate;

  // Convert expected_go_home_date to Date object if it's a string
  let expectedGoHomeDate = initialData.expected_go_home_date 
    ? (typeof initialData.expected_go_home_date === 'string' 
        ? new Date(initialData.expected_go_home_date) 
        : initialData.expected_go_home_date)
    : undefined;

  // Convert akc_registration_date to Date object if it's a string
  let akcRegistrationDate = initialData.akc_registration_date 
    ? (typeof initialData.akc_registration_date === 'string' 
        ? new Date(initialData.akc_registration_date) 
        : initialData.akc_registration_date)
    : undefined;

  // Merge defaults with initialData
  return {
    ...defaults,
    id: initialData.id,
    litter_name: initialData.litter_name || defaults.litter_name,
    dam_id: initialData.dam_id || defaults.dam_id,
    sire_id: initialData.sire_id || defaults.sire_id,
    birth_date: birthDate,
    expected_go_home_date: expectedGoHomeDate,
    akc_litter_number: initialData.akc_litter_number,
    akc_registration_number: initialData.akc_registration_number,
    akc_registration_date: akcRegistrationDate,
    akc_verified: initialData.akc_verified,
    status: (initialData.status as LitterFormData['status']) || defaults.status,
    male_count: initialData.male_count ?? defaults.male_count,
    female_count: initialData.female_count ?? defaults.female_count,
    breeding_notes: initialData.breeding_notes || defaults.breeding_notes,
    notes: initialData.notes || defaults.notes
  };
};
