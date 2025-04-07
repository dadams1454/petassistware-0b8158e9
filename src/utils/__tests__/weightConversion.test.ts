
import { 
  convertWeightToGrams, 
  convertWeight, 
  formatWeight, 
  getAppropriateWeightUnit,
  calculatePercentChange
} from '../../utils/weightConversion';
import { WeightUnit } from '@/types';

describe('Weight Conversion Utilities', () => {
  describe('convertWeightToGrams', () => {
    it('should correctly convert weight to grams', () => {
      expect(convertWeightToGrams(1, 'oz')).toBeCloseTo(28.3495);
      expect(convertWeightToGrams(1, 'g')).toBe(1);
      expect(convertWeightToGrams(1, 'lb')).toBeCloseTo(453.592);
      expect(convertWeightToGrams(1, 'kg')).toBe(1000);
    });
    
    it('should handle edge cases', () => {
      expect(convertWeightToGrams(0, 'oz')).toBe(0);
      expect(convertWeightToGrams(-1, 'g')).toBe(-1);
      expect(convertWeightToGrams(1.5, 'lb')).toBeCloseTo(680.388);
    });
  });
  
  describe('convertWeight', () => {
    it('should correctly convert between weight units', () => {
      expect(convertWeight(1, 'kg', 'g')).toBe(1000);
      expect(convertWeight(1000, 'g', 'kg')).toBe(1);
      expect(convertWeight(16, 'oz', 'lb')).toBeCloseTo(1);
      expect(convertWeight(1, 'lb', 'oz')).toBeCloseTo(16);
      expect(convertWeight(1, 'kg', 'lb')).toBeCloseTo(2.20462);
    });
    
    it('should return the same value when converting to same unit', () => {
      expect(convertWeight(5, 'oz', 'oz')).toBe(5);
      expect(convertWeight(10, 'kg', 'kg')).toBe(10);
    });
  });
  
  describe('formatWeight', () => {
    it('should format weight with appropriate precision', () => {
      expect(formatWeight(1, 'oz')).toBe('1.0 oz');
      expect(formatWeight(1, 'g')).toBe('1 g');
      expect(formatWeight(1, 'lb')).toBe('1.00 lb');
      expect(formatWeight(1, 'kg')).toBe('1.00 kg');
    });
    
    it('should handle decimal values', () => {
      expect(formatWeight(1.2345, 'oz')).toBe('1.2 oz');
      expect(formatWeight(1.2345, 'g')).toBe('1 g');
      expect(formatWeight(1.2345, 'lb')).toBe('1.23 lb');
      expect(formatWeight(1.2345, 'kg')).toBe('1.23 kg');
    });
  });
  
  describe('getAppropriateWeightUnit', () => {
    it('should select the appropriate unit based on weight', () => {
      expect(getAppropriateWeightUnit(500)).toBe('g');
      expect(getAppropriateWeightUnit(5000)).toBe('kg');
      expect(getAppropriateWeightUnit(100)).toBe('g');
      expect(getAppropriateWeightUnit(1500)).toBe('kg');
    });
  });
  
  describe('calculatePercentChange', () => {
    it('should calculate percent change correctly', () => {
      expect(calculatePercentChange(100, 120)).toBe(20);
      expect(calculatePercentChange(100, 80)).toBe(-20);
      expect(calculatePercentChange(0, 100)).toBe(0); // Avoid division by zero
    });
  });
});
