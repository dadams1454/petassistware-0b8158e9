
/**
 * Tests for type guard utilities
 */
import { 
  isWeightUnit, 
  isHealthRecordType, 
  isAppetiteLevel, 
  isEnergyLevel, 
  isStoolConsistency,
  isPuppyWithAge,
  isWeightRecord,
  isHealthRecord,
  safelyConvertValue
} from '../typeGuards';

describe('Type Guards', () => {
  describe('isWeightUnit', () => {
    it('should return true for valid weight units', () => {
      expect(isWeightUnit('oz')).toBe(true);
      expect(isWeightUnit('g')).toBe(true);
      expect(isWeightUnit('lb')).toBe(true);
      expect(isWeightUnit('kg')).toBe(true);
      expect(isWeightUnit('KG')).toBe(false); // Case sensitive
    });
    
    it('should return false for invalid weight units', () => {
      expect(isWeightUnit('invalid')).toBe(false);
      expect(isWeightUnit(null)).toBe(false);
      expect(isWeightUnit(undefined)).toBe(false);
      expect(isWeightUnit(123)).toBe(false);
      expect(isWeightUnit({})).toBe(false);
    });
  });
  
  describe('isHealthRecordType', () => {
    it('should return true for valid health record types', () => {
      expect(isHealthRecordType('vaccination')).toBe(true);
      expect(isHealthRecordType('examination')).toBe(true);
      expect(isHealthRecordType('treatment')).toBe(true);
      expect(isHealthRecordType('other')).toBe(true);
      expect(isHealthRecordType('surgery')).toBe(true);
    });
    
    it('should return false for invalid health record types', () => {
      expect(isHealthRecordType('invalid')).toBe(false);
      expect(isHealthRecordType(null)).toBe(false);
      expect(isHealthRecordType(undefined)).toBe(false);
      expect(isHealthRecordType(123)).toBe(false);
      expect(isHealthRecordType({})).toBe(false);
    });
  });
  
  describe('isAppetiteLevel', () => {
    it('should return true for valid appetite levels', () => {
      expect(isAppetiteLevel('excellent')).toBe(true);
      expect(isAppetiteLevel('good')).toBe(true);
      expect(isAppetiteLevel('fair')).toBe(true);
      expect(isAppetiteLevel('poor')).toBe(true);
      expect(isAppetiteLevel('none')).toBe(true);
      expect(isAppetiteLevel('GOOD')).toBe(false); // Case sensitive
    });
    
    it('should return false for invalid appetite levels', () => {
      expect(isAppetiteLevel('invalid')).toBe(false);
      expect(isAppetiteLevel(null)).toBe(false);
      expect(isAppetiteLevel(undefined)).toBe(false);
      expect(isAppetiteLevel(123)).toBe(false);
      expect(isAppetiteLevel({})).toBe(false);
    });
  });
  
  describe('isPuppyWithAge', () => {
    it('should return true for valid puppy with age objects', () => {
      expect(isPuppyWithAge({ id: '1', ageInDays: 10 })).toBe(true);
      expect(isPuppyWithAge({ id: '2', age_days: 20 })).toBe(true);
      expect(isPuppyWithAge({ id: '3', age: 30 })).toBe(true);
      expect(isPuppyWithAge({ id: '4', ageInDays: 0 })).toBe(true);
      expect(isPuppyWithAge({ id: '5', name: 'Rex', ageInDays: 40 })).toBe(true);
      expect(isPuppyWithAge({ id: '6', name: 'Fido', age_days: 0 })).toBe(true);
      expect(isPuppyWithAge({ id: '7', ageInDays: '50' })).toBe(true); // Type checking, not value validation
    });
    
    it('should return false for invalid puppy with age objects', () => {
      expect(isPuppyWithAge(null)).toBe(false);
      expect(isPuppyWithAge(undefined)).toBe(false);
      expect(isPuppyWithAge({})).toBe(false);
      expect(isPuppyWithAge({ name: 'Rex' })).toBe(false);
      expect(isPuppyWithAge({ id: 1, ageInDays: 10 })).toBe(false); // id not string
    });
  });
  
  describe('isWeightRecord', () => {
    it('should return true for valid weight records', () => {
      expect(isWeightRecord({
        id: '1',
        weight: 10,
        weight_unit: 'kg',
        date: '2023-01-01'
      })).toBe(true);
      expect(isWeightRecord({
        id: '2',
        weight: 5.5,
        weight_unit: 'lb',
        date: '2023-01-02',
        dog_id: 'd1'
      })).toBe(true);
      expect(isWeightRecord({
        id: '3',
        weight: 100,
        weight_unit: 'g',
        date: '2023-01-03',
        puppy_id: 'p1',
        notes: 'Test'
      })).toBe(true);
      expect(isWeightRecord({
        id: '4',
        weight: 9.8,
        weight_unit: 'oz',
        date: '2023-01-04',
        created_at: '2023-01-04T12:00:00Z'
      })).toBe(true);
    });
    
    it('should return false for invalid weight records', () => {
      expect(isWeightRecord(null)).toBe(false);
      expect(isWeightRecord(undefined)).toBe(false);
      expect(isWeightRecord({})).toBe(false);
      expect(isWeightRecord({ id: '1' })).toBe(false);
      expect(isWeightRecord({ id: '1', weight: 10 })).toBe(false);
      expect(isWeightRecord({ id: '1', weight: 10, weight_unit: 'invalid', date: '2023-01-01' })).toBe(false);
      expect(isWeightRecord({ id: '1', weight: '10', weight_unit: 'kg', date: '2023-01-01' })).toBe(false); // weight not number
    });
  });
  
  describe('safelyConvertValue', () => {
    it('should return the value if it passes the type guard', () => {
      expect(safelyConvertValue('oz', isWeightUnit, 'g')).toBe('oz');
      expect(safelyConvertValue('vaccination', isHealthRecordType, 'other')).toBe('vaccination');
    });
    
    it('should return the default value if it fails the type guard', () => {
      expect(safelyConvertValue('invalid', isWeightUnit, 'g')).toBe('g');
      expect(safelyConvertValue(null, isHealthRecordType, 'other')).toBe('other');
      expect(safelyConvertValue(undefined, isAppetiteLevel, 'normal')).toBe('normal');
      expect(safelyConvertValue({}, isEnergyLevel, 'normal')).toBe('normal');
    });
  });
});
