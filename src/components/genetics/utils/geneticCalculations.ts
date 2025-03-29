
import { DogGenotype, ColorProbability } from '@/types/genetics';
import { getColorCode } from './colorUtils';

/**
 * Helper function to sort alleles (dominant first)
 */
export function sortAlleles(genotype: string): string {
  if (genotype.length !== 2) return genotype;
  
  const alleles = genotype.split('');
  
  // Sort so capital (dominant) letters come first
  alleles.sort((a, b) => {
    if (a === a.toUpperCase() && b !== b.toUpperCase()) return -1;
    if (a !== a.toUpperCase() && b === b.toUpperCase()) return 1;
    return a.localeCompare(b);
  });
  
  return alleles.join('');
}

/**
 * Determine phenotype based on genotype
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

/**
 * Calculate color probabilities based on parent genotypes
 */
export function calculateColorProbabilities(
  sireGenotype: DogGenotype, 
  damGenotype: DogGenotype
): ColorProbability[] {
  // Parse genotypes
  const sireBase = sireGenotype.baseColor.split('/');
  const damBase = damGenotype.baseColor.split('/');
  
  const sireBrown = sireGenotype.brownDilution.split('/');
  const damBrown = damGenotype.brownDilution.split('/');
  
  const sireDilution = sireGenotype.dilution.split('/');
  const damDilution = damGenotype.dilution.split('/');
  
  // Calculate possible combinations using Punnett square principles
  const colorOutcomes: Record<string, number> = {};
  
  // Calculate for each possible allele combination
  for (const sireAllele1 of sireBase) {
    for (const damAllele1 of damBase) {
      for (const sireAllele2 of sireBrown) {
        for (const damAllele2 of damBrown) {
          for (const sireAllele3 of sireDilution) {
            for (const damAllele3 of damDilution) {
              // Generate genotype for this combination
              const baseGenotype = sortAlleles(sireAllele1 + damAllele1);
              const brownGenotype = sortAlleles(sireAllele2 + damAllele2);
              const dilutionGenotype = sortAlleles(sireAllele3 + damAllele3);
              
              // Determine the phenotype (actual color)
              const phenotype = determinePhenotype(
                baseGenotype, 
                brownGenotype, 
                dilutionGenotype
              );
              
              // Increment count for this phenotype
              colorOutcomes[phenotype] = (colorOutcomes[phenotype] || 0) + 1;
            }
          }
        }
      }
    }
  }
  
  // Calculate total outcomes
  const totalOutcomes = Object.values(colorOutcomes).reduce((a, b) => a + b, 0);
  
  // Convert to percentages and format for chart
  return Object.entries(colorOutcomes).map(([name, count]) => ({
    name,
    probability: Math.round((count / totalOutcomes) * 100),
    color: getColorCode(name)
  }));
}
