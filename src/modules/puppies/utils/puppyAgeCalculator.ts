
/**
 * Calculate age in days based on a birth date
 * @param birthDate - ISO date string of birth date
 * @returns Age in days
 */
export function calculateAgeInDays(birthDate: string): number {
  if (!birthDate) return 0;
  
  const birthDateObj = new Date(birthDate);
  const now = new Date();
  
  // Calculate difference in milliseconds
  const diffTime = Math.abs(now.getTime() - birthDateObj.getTime());
  
  // Convert to days
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
}

/**
 * Calculate age in weeks based on a birth date
 * @param birthDate - ISO date string of birth date
 * @returns Age in weeks
 */
export function calculateAgeInWeeks(birthDate: string): number {
  const ageInDays = calculateAgeInDays(birthDate);
  return Math.floor(ageInDays / 7);
}

/**
 * Get a human-readable age description
 * @param ageInDays - Age in days
 * @returns Formatted age string
 */
export function getAgeDescription(ageInDays: number): string {
  if (ageInDays < 7) {
    return `${ageInDays} days`;
  } else if (ageInDays < 14) {
    return `1 week, ${ageInDays % 7} days`;
  } else {
    const weeks = Math.floor(ageInDays / 7);
    const days = ageInDays % 7;
    return days > 0 ? `${weeks} weeks, ${days} days` : `${weeks} weeks`;
  }
}
