
/**
 * Tests for weight conversion utilities
 */
import { 
  convertWeightToGrams, 
  convertWeight, 
  formatWeight, 
  getAppropriateWeightUnit,
  calculatePercentChange
} from '../weightConversion';

describe('Weight Conversion Utilities', () => {
  describe('convertWeightToGrams', () => {
    it('should convert weights to grams correctly', () => {
      expect(convertWeightToGrams(100, 'g')).toBe(100);
      expect(convertWeightToGrams(1, 'kg')).toBe(1000);
      expect(convertWeightToGrams(1, 'lb')).toBeCloseTo(453.59, 0);
      expect(convertWeightToGrams(1, 'oz')).toBeCloseTo(28.35, 0);
    });
    
    it('should handle edge cases', () => {
      expect(convertWeightToGrams(0, 'g')).toBe(0);
      expect(convertWeightToGrams(-1, 'kg')).toBe(-1000);
    });
  });
  
  describe('convertWeight', () => {
    it('should convert between different weight units correctly', () => {
      expect(convertWeight(1000, 'g', 'kg')).toBe(1);
      expect(convertWeight(1, 'kg', 'g')).toBe(1000);
      expect(convertWeight(1, 'lb', 'oz')).toBeCloseTo(16, 0);
      expect(convertWeight(16, 'oz', 'lb')).toBeCloseTo(1, 0);
      expect(convertWeight(1, 'kg', 'lb')).toBeCloseTo(2.2046, 2);
    });
    
    it('should return the same value when source and target units are the same', () => {
      expect(convertWeight(100, 'g', 'g')).toBe(100);
      expect(convertWeight(10, 'kg', 'kg')).toBe(10);
      expect(convertWeight(5, 'lb', 'lb')).toBe(5);
      expect(convertWeight(8, 'oz', 'oz')).toBe(8);
    });
  });
  
  describe('formatWeight', () => {
    it('should format weight values with appropriate precision', () => {
      expect(formatWeight(1000, 'g')).toBe('1000 g');
      expect(formatWeight(1, 'kg')).toBe('1.0 kg');
      expect(formatWeight(1.5, 'lb')).toBe('1.5 lb');
      expect(formatWeight(1.234, 'oz')).toBe('1.2 oz');
    });
    
    it('should handle different formatting options', () => {
      expect(formatWeight(1000, 'g', { showUnit: false })).toBe('1000');
      expect(formatWeight(1.5, 'kg', { precision: 2 })).toBe('1.50 kg');
      expect(formatWeight(1.5, 'lb', { showUnit: false, precision: 3 })).toBe('1.500');
      expect(formatWeight(1.234, 'oz', { precision: 0 })).toBe('1 oz');
    });
  });
  
  describe('getAppropriateWeightUnit', () => {
    it('should select appropriate weight units based on weight in grams', () => {
      expect(getAppropriateWeightUnit(50)).toBe('g');
      expect(getAppropriateWeightUnit(500)).toBe('g');
      expect(getAppropriateWeightUnit(1500)).toBe('kg');
      expect(getAppropriateWeightUnit(5000)).toBe('kg');
    });
    
    it('should handle custom threshold options', () => {
      expect(getAppropriateWeightUnit(500, { kgThreshold: 100 })).toBe('kg');
      expect(getAppropriateWeightUnit(900, { kgThreshold: 1000 })).toBe('g');
    });
  });
  
  describe('calculatePercentChange', () => {
    it('should calculate percent change correctly', () => {
      expect(calculatePercentChange(100, 150)).toBe(50);
      expect(calculatePercentChange(200, 100)).toBe(-50);
      expect(calculatePercentChange(100, 100)).toBe(0);
      expect(calculatePercentChange(100, 110)).toBe(10);
    });
    
    it('should handle special cases', () => {
      expect(calculatePercentChange(0, 100)).toBe(null); // Division by zero
      expect(calculatePercentChange(100, 0)).toBe(-100); // Complete decrease
    });
  });
});
