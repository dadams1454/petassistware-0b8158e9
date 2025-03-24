
/**
 * Parses a litter number value to a valid number
 * @param value The litter number value to parse
 * @returns A valid number for litter_number
 */
export const parseLitterNumber = (value: any): number => {
  if (value === null || value === undefined) return 0;
  const num = parseInt(String(value));
  return isNaN(num) ? 0 : num;
};

/**
 * Formats dog form data for API submission
 * @param values Form values from the dog form
 * @param userId The current user's ID
 * @returns Formatted dog data ready for API submission
 */
export const formatDogDataForSubmission = (values: any, userId: string) => {
  let birthdate = values.birthdate;
  if (!birthdate && values.birthdateStr) {
    try {
      // Try to parse date from string if direct date object not available
      const parts = values.birthdateStr.split('/');
      if (parts.length === 3) {
        const month = parseInt(parts[0]) - 1; // JS months are 0-indexed
        const day = parseInt(parts[1]);
        const year = parseInt(parts[2]);
        birthdate = new Date(year, month, day);
      }
    } catch (e) {
      console.error("Date parsing error:", e);
    }
  }

  return {
    name: values.name,
    breed: values.breed,
    birthdate: birthdate ? birthdate.toISOString().split('T')[0] : null,
    gender: values.gender,
    color: values.color,
    weight: values.weight,
    weight_unit: values.weight_unit || 'lbs',
    microchip_number: values.microchip_number,
    microchip_location: values.microchip_location,
    registration_number: values.registration_number,
    registration_organization: values.registration_organization,
    status: values.status || 'active',
    pedigree: values.pedigree,
    notes: values.notes,
    photo_url: values.photo_url,
    owner_id: userId,
    requires_special_handling: values.requires_special_handling,
    potty_alert_threshold: values.potty_alert_threshold,
    max_time_between_breaks: values.max_time_between_breaks,
    // Female dog breeding fields
    is_pregnant: values.is_pregnant,
    last_heat_date: values.last_heat_date ? values.last_heat_date.toISOString().split('T')[0] : null,
    tie_date: values.tie_date ? values.tie_date.toISOString().split('T')[0] : null,
    litter_number: values.litter_number,
    // Vaccination fields
    last_vaccination_date: values.last_vaccination_date ? values.last_vaccination_date.toISOString().split('T')[0] : null,
    vaccination_type: values.vaccination_type,
    vaccination_notes: values.vaccination_notes,
  };
};
