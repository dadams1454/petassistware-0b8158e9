
import { LitterFormData } from '../types/litterFormTypes';

export const getDefaultFormValues = (initialData: any | undefined, today: Date): LitterFormData => {
  if (initialData) {
    return {
      litter_name: initialData.litter_name || '',
      dam_id: initialData.dam_id || null,
      sire_id: initialData.sire_id || null,
      birth_date: initialData.birth_date ? new Date(initialData.birth_date) : null,
      expected_go_home_date: initialData.expected_go_home_date ? new Date(initialData.expected_go_home_date) : new Date(today.getTime() + 8 * 7 * 24 * 60 * 60 * 1000), // Default to 8 weeks from today
      puppy_count: initialData.puppy_count || null,
      male_count: initialData.male_count || null,
      female_count: initialData.female_count || null,
      notes: initialData.notes || null,
      documents_url: initialData.documents_url || null,
      status: initialData.status || 'active',
      akc_registration_number: initialData.akc_registration_number || null,
      akc_registration_date: initialData.akc_registration_date ? new Date(initialData.akc_registration_date) : null,
      akc_litter_color: initialData.akc_litter_color || null,
      akc_verified: initialData.akc_verified || false,
      first_mating_date: initialData.first_mating_date ? new Date(initialData.first_mating_date) : null,
      last_mating_date: initialData.last_mating_date ? new Date(initialData.last_mating_date) : null,
      kennel_name: initialData.kennel_name || null,
      breeding_notes: initialData.breeding_notes || null,
    };
  }

  // Default values for new litter
  return {
    litter_name: '',
    dam_id: null,
    sire_id: null,
    birth_date: today,
    expected_go_home_date: new Date(today.getTime() + 8 * 7 * 24 * 60 * 60 * 1000), // Default to 8 weeks from today
    puppy_count: null,
    male_count: null,
    female_count: null,
    notes: null,
    documents_url: null,
    status: 'active',
    akc_registration_number: null,
    akc_registration_date: null,
    akc_litter_color: null,
    akc_verified: false,
    first_mating_date: null,
    last_mating_date: null,
    kennel_name: null,
    breeding_notes: null,
  };
};

export const processFormData = (data: LitterFormData, userId: string, today: Date) => {
  return {
    ...data,
    breeder_id: userId,
    birth_date: data.birth_date ? new Date(data.birth_date).toISOString().split('T')[0] : today.toISOString().split('T')[0],
    expected_go_home_date: data.expected_go_home_date ? new Date(data.expected_go_home_date).toISOString().split('T')[0] : null,
    akc_registration_date: data.akc_registration_date ? new Date(data.akc_registration_date).toISOString().split('T')[0] : null,
    first_mating_date: data.first_mating_date ? new Date(data.first_mating_date).toISOString().split('T')[0] : null,
    last_mating_date: data.last_mating_date ? new Date(data.last_mating_date).toISOString().split('T')[0] : null,
  };
};
