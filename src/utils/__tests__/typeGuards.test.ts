
import { 
  isAppetiteLevel, 
  isEnergyLevel, 
  isStoolConsistency, 
  isHealthRecordType,
  isMedicationStatus,
  safelyConvertValue
} from '../typeGuards';

describe('Type Guard Utilities', () => {
  describe('isAppetiteLevel', () => {
    it('should validate valid appetite levels', () => {
      expect(isAppetiteLevel('excellent')).toBe(true);
      expect(isAppetiteLevel('good')).toBe(true);
      expect(isAppetiteLevel('fair')).toBe(true);
      expect(isAppetiteLevel('poor')).toBe(true);
      expect(isAppetiteLevel('none')).toBe(true);
    });
    
    it('should reject invalid appetite levels', () => {
      expect(isAppetiteLevel('invalid')).toBe(false);
      expect(isAppetiteLevel('')).toBe(false);
      expect(isAppetiteLevel(null)).toBe(false);
      expect(isAppetiteLevel(undefined)).toBe(false);
      expect(isAppetiteLevel(123)).toBe(false);
    });
  });
  
  describe('isEnergyLevel', () => {
    it('should validate valid energy levels', () => {
      expect(isEnergyLevel('hyperactive')).toBe(true);
      expect(isEnergyLevel('high')).toBe(true);
      expect(isEnergyLevel('normal')).toBe(true);
      expect(isEnergyLevel('low')).toBe(true);
      expect(isEnergyLevel('lethargic')).toBe(true);
    });
    
    it('should reject invalid energy levels', () => {
      expect(isEnergyLevel('invalid')).toBe(false);
      expect(isEnergyLevel('')).toBe(false);
      expect(isEnergyLevel(null)).toBe(false);
      expect(isEnergyLevel(undefined)).toBe(false);
      expect(isEnergyLevel(123)).toBe(false);
    });
  });
  
  describe('isStoolConsistency', () => {
    it('should validate valid stool consistency values', () => {
      expect(isStoolConsistency('normal')).toBe(true);
      expect(isStoolConsistency('soft')).toBe(true);
      expect(isStoolConsistency('loose')).toBe(true);
      expect(isStoolConsistency('watery')).toBe(true);
      expect(isStoolConsistency('hard')).toBe(true);
      expect(isStoolConsistency('bloody')).toBe(true);
      expect(isStoolConsistency('mucus')).toBe(true);
    });
    
    it('should reject invalid stool consistency values', () => {
      expect(isStoolConsistency('invalid')).toBe(false);
      expect(isStoolConsistency('')).toBe(false);
      expect(isStoolConsistency(null)).toBe(false);
      expect(isStoolConsistency(undefined)).toBe(false);
      expect(isStoolConsistency(123)).toBe(false);
    });
  });
  
  describe('isHealthRecordType', () => {
    it('should validate valid health record types', () => {
      expect(isHealthRecordType('vaccination')).toBe(true);
      expect(isHealthRecordType('examination')).toBe(true);
      expect(isHealthRecordType('treatment')).toBe(true);
      expect(isHealthRecordType('medication')).toBe(true);
      expect(isHealthRecordType('surgery')).toBe(true);
      expect(isHealthRecordType('injury')).toBe(true);
      expect(isHealthRecordType('allergy')).toBe(true);
      expect(isHealthRecordType('test')).toBe(true);
      expect(isHealthRecordType('other')).toBe(true);
    });
    
    it('should reject invalid health record types', () => {
      expect(isHealthRecordType('invalid')).toBe(false);
      expect(isHealthRecordType('')).toBe(false);
      expect(isHealthRecordType(null)).toBe(false);
      expect(isHealthRecordType(undefined)).toBe(false);
      expect(isHealthRecordType(123)).toBe(false);
    });
  });
  
  describe('isMedicationStatus', () => {
    it('should validate valid medication statuses', () => {
      expect(isMedicationStatus('due')).toBe(true);
      expect(isMedicationStatus('upcoming')).toBe(true);
      expect(isMedicationStatus('overdue')).toBe(true);
      expect(isMedicationStatus('completed')).toBe(true);
      expect(isMedicationStatus('skipped')).toBe(true);
      expect(isMedicationStatus('unknown')).toBe(true);
      expect(isMedicationStatus('active')).toBe(true);
      expect(isMedicationStatus('paused')).toBe(true);
      expect(isMedicationStatus('stopped')).toBe(true);
      expect(isMedicationStatus('scheduled')).toBe(true);
      expect(isMedicationStatus('not_started')).toBe(true);
      expect(isMedicationStatus('discontinued')).toBe(true);
    });
    
    it('should reject invalid medication statuses', () => {
      expect(isMedicationStatus('invalid')).toBe(false);
      expect(isMedicationStatus('')).toBe(false);
      expect(isMedicationStatus(null)).toBe(false);
      expect(isMedicationStatus(undefined)).toBe(false);
      expect(isMedicationStatus(123)).toBe(false);
    });
  });
  
  describe('safelyConvertValue', () => {
    it('should return the value if valid', () => {
      expect(safelyConvertValue('normal', 'unknown', isStoolConsistency)).toBe('normal');
      expect(safelyConvertValue('excellent', 'good', isAppetiteLevel)).toBe('excellent');
    });
    
    it('should return default value if invalid', () => {
      expect(safelyConvertValue('invalid', 'normal', isStoolConsistency)).toBe('normal');
      expect(safelyConvertValue(null, 'good', isAppetiteLevel)).toBe('good');
      expect(safelyConvertValue(undefined, 'normal', isEnergyLevel)).toBe('normal');
      expect(safelyConvertValue(123, 'vaccination', isHealthRecordType)).toBe('vaccination');
    });
  });
});
