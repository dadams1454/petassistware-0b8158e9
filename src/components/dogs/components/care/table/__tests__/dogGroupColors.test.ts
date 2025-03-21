
import { generateTimeSlots, getDogRowColor } from '../dogGroupColors';

describe('dogGroupColors utilities', () => {
  describe('generateTimeSlots', () => {
    beforeEach(() => {
      // Mock the date to a fixed time for tests
      jest.spyOn(Date.prototype, 'getHours').mockImplementation(() => 14); // 2 PM
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    test('generates feeding slots correctly', () => {
      const slots = generateTimeSlots(new Date(), 'feeding');
      
      expect(slots).toEqual(['Morning', 'Noon', 'Evening']);
    });

    test('generates potty break slots starting before current hour', () => {
      const slots = generateTimeSlots(new Date(), 'pottybreaks');
      
      // Should start 6 hours before 2 PM (8 AM) and include 8 slots
      expect(slots).toHaveLength(8);
      
      // First slot should be 8 AM
      expect(slots[0]).toBe('8:00 AM');
      
      // Last slot should be 3 PM (current hour + 1)
      expect(slots[7]).toBe('3:00 PM');
    });

    test('handles day boundary correctly', () => {
      // Mock to 1 AM
      jest.spyOn(Date.prototype, 'getHours').mockImplementation(() => 1);
      
      const slots = generateTimeSlots(new Date(), 'pottybreaks');
      
      // Should wrap around and include late night hours
      expect(slots).toHaveLength(8);
      expect(slots).toContain('7:00 PM');
      expect(slots).toContain('12:00 AM');
      expect(slots).toContain('2:00 AM');
    });

    test('defaults to pottybreaks if no viewType provided', () => {
      const slots = generateTimeSlots(new Date());
      
      expect(slots).toHaveLength(8);
      expect(slots[0]).toBe('8:00 AM');
    });
  });

  describe('getDogRowColor', () => {
    test('returns white for even rows', () => {
      expect(getDogRowColor(0)).toBe('bg-white dark:bg-slate-900');
      expect(getDogRowColor(2)).toBe('bg-white dark:bg-slate-900');
      expect(getDogRowColor(4)).toBe('bg-white dark:bg-slate-900');
    });

    test('returns light gray for odd rows', () => {
      expect(getDogRowColor(1)).toBe('bg-slate-50 dark:bg-slate-800/50');
      expect(getDogRowColor(3)).toBe('bg-slate-50 dark:bg-slate-800/50');
      expect(getDogRowColor(5)).toBe('bg-slate-50 dark:bg-slate-800/50');
    });
  });
});
