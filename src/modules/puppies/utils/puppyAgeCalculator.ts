
/**
 * Puppy Age Calculator
 * 
 * Utility functions for calculating puppy age and developmental stages
 */
import { differenceInDays, differenceInWeeks, differenceInMonths } from 'date-fns';

/**
 * Calculate a puppy's age in days
 * 
 * @param birthDate The puppy's birth date string
 * @returns Number of days since birth or undefined if birthDate is invalid
 */
export const calculateAgeInDays = (birthDate?: string | Date): number | undefined => {
  if (!birthDate) return undefined;
  
  try {
    const birthDateObj = typeof birthDate === 'string' ? new Date(birthDate) : birthDate;
    return differenceInDays(new Date(), birthDateObj);
  } catch (error) {
    console.error('Error calculating puppy age in days:', error);
    return undefined;
  }
};

/**
 * Calculate a puppy's age in weeks
 * 
 * @param birthDate The puppy's birth date string
 * @returns Number of weeks since birth or undefined if birthDate is invalid
 */
export const calculateAgeInWeeks = (birthDate?: string | Date): number | undefined => {
  if (!birthDate) return undefined;
  
  try {
    const birthDateObj = typeof birthDate === 'string' ? new Date(birthDate) : birthDate;
    return differenceInWeeks(new Date(), birthDateObj);
  } catch (error) {
    console.error('Error calculating puppy age in weeks:', error);
    return undefined;
  }
};

/**
 * Calculate a puppy's age in months
 * 
 * @param birthDate The puppy's birth date string
 * @returns Number of months since birth or undefined if birthDate is invalid
 */
export const calculateAgeInMonths = (birthDate?: string | Date): number | undefined => {
  if (!birthDate) return undefined;
  
  try {
    const birthDateObj = typeof birthDate === 'string' ? new Date(birthDate) : birthDate;
    return differenceInMonths(new Date(), birthDateObj);
  } catch (error) {
    console.error('Error calculating puppy age in months:', error);
    return undefined;
  }
};

/**
 * Get puppy age group based on age in days
 * 
 * @param ageInDays The puppy's age in days
 * @returns Age group identifier
 */
export const getPuppyAgeGroup = (ageInDays?: number): string => {
  if (!ageInDays && ageInDays !== 0) return 'unknown';
  
  if (ageInDays < 14) return 'newborn';
  if (ageInDays < 28) return 'twoWeek';
  if (ageInDays < 42) return 'fourWeek';
  if (ageInDays < 56) return 'sixWeek';
  if (ageInDays < 70) return 'eightWeek';
  if (ageInDays < 84) return 'tenWeek';
  if (ageInDays < 98) return 'twelveWeek';
  return 'older';
};

/**
 * Get human-readable name for puppy age group
 * 
 * @param ageGroup The age group identifier
 * @returns Human-readable age group name
 */
export const getAgeGroupName = (ageGroup: string): string => {
  const nameMap: Record<string, string> = {
    'newborn': 'Newborn (0-2 weeks)',
    'twoWeek': '2-4 Weeks',
    'fourWeek': '4-6 Weeks',
    'sixWeek': '6-8 Weeks',
    'eightWeek': '8-10 Weeks',
    'tenWeek': '10-12 Weeks',
    'twelveWeek': '12-14 Weeks',
    'older': 'Older than 14 Weeks',
    'unknown': 'Unknown Age'
  };
  
  return nameMap[ageGroup] || 'Unknown Age Group';
};

/**
 * Get expected milestones for an age group
 * 
 * @param ageGroup The age group identifier
 * @returns Array of expected developmental milestones
 */
export const getExpectedMilestones = (ageGroup: string): string[] => {
  const milestoneMap: Record<string, string[]> = {
    'newborn': [
      'Eyes closed', 
      'Ears closed', 
      'Cannot regulate body temperature', 
      'Sleeping 90% of time',
      'Nursing every 2-3 hours'
    ],
    'twoWeek': [
      'Eyes beginning to open',
      'Ears beginning to open',
      'Some movement on belly',
      'First teeth may appear',
      'Starting to regulate body temperature'
    ],
    'fourWeek': [
      'Walking more steadily',
      'Beginning to play with littermates',
      'Starting to eat soft food',
      'More alert and responsive',
      'Beginning to eliminate on their own'
    ],
    'sixWeek': [
      'All baby teeth present',
      'Fully weaned to solid food',
      'Playing actively',
      'Can be introduced to basic socialization',
      'More coordinated movement'
    ],
    'eightWeek': [
      'Ready for vaccinations',
      'Can begin house training',
      'Fully mobile and coordinated',
      'Social play with littermates peaks',
      'Can begin basic commands'
    ],
    'tenWeek': [
      'Second vaccinations',
      'More focused attention',
      'Enhanced coordination',
      'Beginning to show adult personality traits',
      'Can learn more complex commands'
    ],
    'twelveWeek': [
      'Third vaccinations',
      'Adult coat beginning to come in',
      'Teething begins',
      'More independent behavior',
      'Critical socialization period ending'
    ],
    'older': [
      'Continued training',
      'Adult teeth coming in',
      'Strengthening immune system',
      'Growth rate slowing',
      'Developing adult behaviors'
    ]
  };
  
  return milestoneMap[ageGroup] || ['No specific milestones for this age group'];
};

/**
 * Get age-appropriate developmental tasks
 * 
 * @param ageInDays The puppy's age in days
 * @returns Array of developmental tasks appropriate for the age
 */
export const getAgeDevelopmentalTasks = (ageInDays?: number): string[] => {
  if (!ageInDays && ageInDays !== 0) return [];
  
  const ageGroup = getPuppyAgeGroup(ageInDays);
  return getExpectedMilestones(ageGroup);
};
