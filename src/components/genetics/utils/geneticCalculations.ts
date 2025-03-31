
import { DogGenotype, ColorProbability } from '@/types/genetics';

/**
 * Generate color probability data for charts
 */
export function generateColorProbabilityData(colorProbabilities: Record<string, number>): ColorProbability[] {
  const colorMap: Record<string, string> = {
    'Black': '#111827',
    'Brown': '#92400E',
    'Grey': '#6B7280',
    'Light Brown': '#B45309',
    'Red': '#B91C1C',
    'Cream': '#FCD34D'
  };
  
  return Object.entries(colorProbabilities).map(([name, value]) => ({
    name,
    value,
    color: colorMap[name] || '#64748B',
    percentage: value  // Add percentage property
  }));
}

/**
 * Parse genotype string into alleles
 */
export function parseGenotype(genotype: string): string[] {
  // Parses a genotype like "B/b" into ["B", "b"]
  return genotype.split('/');
}

/**
 * Get the phenotype (visual color) from color genes
 */
export function getPhenotypeFromGenes(
  baseColor: string,
  brownDilution: string,
  dilution: string
): string {
  const isBlackBased = baseColor.includes('E');
  const hasBrownDilution = brownDilution === 'b/b';
  const hasDilution = dilution === 'd/d';
  
  if (!isBlackBased) {
    return hasDilution ? 'Cream' : 'Red';
  } else if (hasBrownDilution) {
    return hasDilution ? 'Light Brown' : 'Brown';
  } else {
    return hasDilution ? 'Grey' : 'Black';
  }
}

/**
 * Calculate coefficient of inbreeding (COI)
 * Note: This is a simplified placeholder. Real COI calculations require extensive pedigree analysis.
 */
export function calculateCOI(
  sireGenotype: DogGenotype,
  damGenotype: DogGenotype
): number {
  // This is a placeholder. Real COI calculations require examining the pedigree
  // to find common ancestors and calculate inbreeding coefficient.
  return 4.5; // Returning a placeholder value
}
