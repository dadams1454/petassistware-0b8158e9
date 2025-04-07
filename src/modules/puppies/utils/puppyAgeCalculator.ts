
import { differenceInDays, differenceInWeeks, differenceInMonths } from 'date-fns';

/**
 * Calculates puppy age in days from birth date
 * 
 * @param birthDate The birth date of the puppy (string or Date)
 * @returns The age in days, or 0 if no birth date provided
 */
export const calculateAgeInDays = (birthDate: string | Date | null | undefined): number => {
  if (!birthDate) return 0;
  
  const birthDateObj = typeof birthDate === 'string' ? new Date(birthDate) : birthDate;
  return differenceInDays(new Date(), birthDateObj);
};

/**
 * Calculates puppy age in weeks from birth date
 * 
 * @param birthDate The birth date of the puppy (string or Date)
 * @returns The age in weeks, or 0 if no birth date provided
 */
export const calculateAgeInWeeks = (birthDate: string | Date | null | undefined): number => {
  if (!birthDate) return 0;
  
  const birthDateObj = typeof birthDate === 'string' ? new Date(birthDate) : birthDate;
  return differenceInWeeks(new Date(), birthDateObj);
};

/**
 * Calculates puppy age in months from birth date
 * 
 * @param birthDate The birth date of the puppy (string or Date)
 * @returns The age in months, or 0 if no birth date provided
 */
export const calculateAgeInMonths = (birthDate: string | Date | null | undefined): number => {
  if (!birthDate) return 0;
  
  const birthDateObj = typeof birthDate === 'string' ? new Date(birthDate) : birthDate;
  return differenceInMonths(new Date(), birthDateObj);
};

/**
 * Determines the developmental stage of a puppy based on age in days
 * 
 * @param ageInDays The puppy's age in days
 * @returns The developmental stage as a string
 */
export const getPuppyDevelopmentalStage = (ageInDays: number): string => {
  if (ageInDays < 0) return 'Unknown';
  
  if (ageInDays <= 14) return 'Neonatal';
  if (ageInDays <= 21) return 'Transitional';
  if (ageInDays <= 49) return 'Socialization';
  if (ageInDays <= 84) return 'Juvenile';
  if (ageInDays <= 365) return 'Adolescent';
  
  return 'Adult';
};

/**
 * Gets appropriate milestones for a puppy based on age
 * 
 * @param ageInDays The puppy's age in days
 * @returns Array of relevant milestones for the puppy's age
 */
export const getAgeMilestones = (ageInDays: number): string[] => {
  const stage = getPuppyDevelopmentalStage(ageInDays);
  
  switch (stage) {
    case 'Neonatal':
      return [
        'Eyes begin to open',
        'Ears begin to open',
        'Crawling begins',
        'First veterinary check'
      ];
    case 'Transitional':
      return [
        'Eyes fully open',
        'Ears fully open',
        'Beginning to walk',
        'Teeth beginning to emerge',
        'First socialization experiences'
      ];
    case 'Socialization':
      return [
        'Walking confidently',
        'Playing with littermates',
        'Beginning to wean',
        'First solid food',
        'Vaccines beginning',
        'Critical socialization period'
      ];
    case 'Juvenile':
      return [
        'Fully weaned',
        'Vaccines continuing',
        'Basic training beginning',
        'Ready for new homes',
        'Permanent teeth emerging'
      ];
    case 'Adolescent':
      return [
        'Continuing training',
        'Adult vaccines',
        'Growth slowing',
        'Sexual maturity approaching'
      ];
    case 'Adult':
      return [
        'Full adult size',
        'Sexual maturity',
        'Adult maintenance'
      ];
    default:
      return [];
  }
};
