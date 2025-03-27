
// Vaccination information for tooltips and reference
export const vaccinationInfo = {
  'rabies': {
    name: 'Rabies',
    description: 'Protects against the rabies virus, which affects the central nervous system and is fatal.',
    schedule: 'First vaccination at 12-16 weeks, then booster at 1 year. After that, either annually or every 3 years depending on the vaccine used.'
  },
  'distemper': {
    name: 'Distemper',
    description: 'Protects against canine distemper virus, which can cause severe respiratory, gastrointestinal, and neurological disease.',
    schedule: 'Series of vaccinations starting at 6-8 weeks, then every 2-4 weeks until 16 weeks old. Booster at 1 year, then every 1-3 years.'
  },
  'parvovirus': {
    name: 'Parvovirus',
    description: 'Protects against canine parvovirus, which causes severe, often fatal gastrointestinal disease, especially in puppies.',
    schedule: 'Series of vaccinations starting at 6-8 weeks, then every 2-4 weeks until 16 weeks old. Booster at 1 year, then every 1-3 years.'
  },
  'adenovirus': {
    name: 'Adenovirus',
    description: 'Protects against infectious canine hepatitis, which can cause liver damage, eye damage, and death.',
    schedule: 'Series of vaccinations starting at 6-8 weeks, then every 2-4 weeks until 16 weeks old. Booster at 1 year, then every 1-3 years.'
  },
  'leptospirosis': {
    name: 'Leptospirosis',
    description: 'Protects against the Leptospira bacteria, which can cause kidney and liver damage and is transmissible to humans.',
    schedule: 'Initial vaccine followed by a booster 2-4 weeks later, then annually in high-risk areas.'
  },
  'bordetella': {
    name: 'Bordetella (Kennel Cough)',
    description: 'Protects against Bordetella bronchiseptica, one of the main causes of kennel cough.',
    schedule: 'Typically given at least 48 hours before boarding or social situations. Boosters range from every 6 months to annually, depending on risk.'
  },
  'lyme': {
    name: 'Lyme Disease',
    description: 'Protects against Borrelia burgdorferi, which causes Lyme disease transmitted by ticks.',
    schedule: 'Initial vaccine followed by a booster 2-4 weeks later, then annually in high-risk areas.'
  },
  'combo': {
    name: 'Combo Vaccine (DHPP)',
    description: 'Combination vaccine that protects against Distemper, Hepatitis (Adenovirus), Parainfluenza, and Parvovirus.',
    schedule: 'Series of vaccinations starting at 6-8 weeks, then every 2-4 weeks until 16 weeks old. Booster at 1 year, then every 1-3 years.'
  },
  'parainfluenza': {
    name: 'Parainfluenza',
    description: 'Protects against canine parainfluenza virus, one of the causes of kennel cough.',
    schedule: 'Often included in combo vaccines. Series of vaccinations starting at 6-8 weeks, then every 2-4 weeks until 16 weeks old. Booster at 1 year, then every 1-3 years.'
  },
  'coronavirus': {
    name: 'Coronavirus',
    description: 'Protects against canine coronavirus, which can cause diarrhea, especially in puppies.',
    schedule: 'Often given in areas where the disease is common, with a schedule similar to other core vaccines.'
  }
};

/**
 * Get vaccination information by type
 */
export const getVaccinationInfo = (type: string) => {
  return vaccinationInfo[type as keyof typeof vaccinationInfo] || {
    name: type.charAt(0).toUpperCase() + type.slice(1),
    description: 'No detailed information available for this vaccination type.',
    schedule: 'Consult your veterinarian for the recommended schedule.'
  };
};
