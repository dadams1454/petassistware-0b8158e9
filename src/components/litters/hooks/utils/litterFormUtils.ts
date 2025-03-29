
import { LitterFormData } from '../types/litterFormTypes';

/**
 * Processes form data to prepare it for submission to the database
 */
export const processFormData = (data: LitterFormData, userId: string, today: Date) => {
  // Process the data to handle null values and date formatting
  const processedData = {
    ...data,
    birth_date: data.birth_date ? data.birth_date.toISOString().split('T')[0] : today.toISOString().split('T')[0],
    expected_go_home_date: data.expected_go_home_date ? data.expected_go_home_date.toISOString().split('T')[0] : null,
    akc_registration_date: data.akc_registration_date?.toISOString().split('T')[0] || null,
    first_mating_date: data.first_mating_date?.toISOString().split('T')[0] || null,
    last_mating_date: data.last_mating_date?.toISOString().split('T')[0] || null,
    breeder_id: userId,
  };

  // Remove akc_documents_url field which doesn't exist in the database
  delete (processedData as any).akc_documents_url;

  return processedData;
};

/**
 * Gets default form values based on optional initial data
 */
export const getDefaultFormValues = (initialData?: any, today = new Date()) => {
  // Default go home date (8 weeks from today)
  const defaultGoHomeDate = new Date(today.getTime() + 8 * 7 * 24 * 60 * 60 * 1000);
  
  return {
    litter_name: initialData?.litter_name || '',
    dam_id: initialData?.dam_id || null,
    sire_id: initialData?.sire_id || null,
    birth_date: initialData?.birth_date ? new Date(initialData.birth_date) : today,
    expected_go_home_date: initialData?.expected_go_home_date ? new Date(initialData.expected_go_home_date) : defaultGoHomeDate,
    puppy_count: initialData?.puppy_count || 0,
    male_count: initialData?.male_count || null,
    female_count: initialData?.female_count || null,
    notes: initialData?.notes || null,
    documents_url: initialData?.documents_url || null,
    status: initialData?.status || 'active',
    // AKC compliance fields
    akc_registration_number: initialData?.akc_registration_number || null,
    akc_registration_date: initialData?.akc_registration_date ? new Date(initialData.akc_registration_date) : null,
    akc_litter_color: initialData?.akc_litter_color || null,
    akc_verified: initialData?.akc_verified || false,
    // Breeding details
    first_mating_date: initialData?.first_mating_date ? new Date(initialData.first_mating_date) : null,
    last_mating_date: initialData?.last_mating_date ? new Date(initialData.last_mating_date) : null,
    kennel_name: initialData?.kennel_name || null,
    breeding_notes: initialData?.breeding_notes || null,
  };
};
