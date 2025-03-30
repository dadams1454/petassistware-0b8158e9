
/**
 * Get color code for visualization
 */
export function getColorCode(colorName: string): string {
  const colorMap: Record<string, string> = {
    'Black': '#212529',
    'Grey': '#adb5bd',
    'Brown': '#795548',
    'Light Brown': '#a98274',
    'Red': '#fd7e14',
    'Cream': '#f8deb5'
  };
  
  return colorMap[colorName] || '#212529';
}

/**
 * Helper function to determine phenotype based on genotype
 */
export function determinePhenotype(
  baseGenotype: string,
  brownGenotype: string,
  dilutionGenotype: string
): string {
  // E is dominant (black-based), e is recessive (red-based)
  const isBlackBased = baseGenotype.includes('E');
  
  // B is dominant (no brown), b is recessive (brown)
  const hasBrownDilution = brownGenotype === 'bb';
  
  // D is dominant (no dilution), d is recessive (dilute)
  const hasDilution = dilutionGenotype === 'dd';
  
  // Determine base color
  if (!isBlackBased) {
    // Red-based colors
    if (hasDilution) {
      return 'Cream';
    }
    return 'Red';
  } else {
    // Black-based colors
    if (hasBrownDilution) {
      // Brown variants
      if (hasDilution) {
        return 'Light Brown';
      }
      return 'Brown';
    } else {
      // Black variants
      if (hasDilution) {
        return 'Grey';
      }
      return 'Black';
    }
  }
}
