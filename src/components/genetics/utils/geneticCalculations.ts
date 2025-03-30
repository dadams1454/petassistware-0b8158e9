
import { DogGenotype, ColorProbability } from '@/types/genetics';

/**
 * Calculates color probabilities between two dogs
 */
export function calculateColorProbabilities(sire: DogGenotype, dam: DogGenotype): ColorProbability[] {
  // In a real app, this would use actual genetic algorithms
  // For now we'll return sample data
  return [
    { color: 'Black', percentage: 50 },
    { color: 'Brown', percentage: 25 },
    { color: 'Grey', percentage: 15 },
    { color: 'Cream', percentage: 10 }
  ];
}

/**
 * Calculate Coefficient of Inbreeding (COI)
 */
export function calculateCOI(dogId: string, generations: number = 5): number {
  // In a real app, this would analyze pedigree data
  // For now return a placeholder
  return 4.2;
}

/**
 * Parses genotype string into alleles
 */
export function parseGenotype(genotypeStr: string): string[] {
  return genotypeStr.split('/');
}

/**
 * Determine if a trait is dominant based on alleles
 */
export function isDominant(allele1: string, allele2: string): boolean {
  return allele1 === allele1.toUpperCase() || allele2 === allele2.toUpperCase();
}

/**
 * Check if a dog is homozygous for a trait
 */
export function isHomozygous(genotypeStr: string): boolean {
  const alleles = parseGenotype(genotypeStr);
  return alleles[0] === alleles[1];
}
