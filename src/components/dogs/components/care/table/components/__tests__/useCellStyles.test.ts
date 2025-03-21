
import { renderHook } from '@testing-library/react';
import { useCellStyles } from '../useCellStyles';
import { DogFlag } from '@/types/dailyCare';

describe('useCellStyles Hook', () => {
  const defaultProps = {
    category: 'pottybreaks',
    hasPottyBreak: false,
    hasCareLogged: false,
    flags: [] as DogFlag[]
  };

  test('returns default styles when no special conditions', () => {
    const { result } = renderHook(() => useCellStyles(defaultProps));
    
    expect(result.current.cellClassNames).toContain('bg-white');
    expect(result.current.cellClassNames).toContain('hover:bg-blue-50');
    expect(result.current.isPottyCategory).toBe(true);
    expect(result.current.isInHeat).toBe(false);
    expect(result.current.isPregnant).toBe(false);
    expect(result.current.hasIncompatibility).toBe(false);
    expect(result.current.hasSpecialAttention).toBe(false);
  });

  test('adds potty break styling when hasPottyBreak is true', () => {
    const { result } = renderHook(() => 
      useCellStyles({ ...defaultProps, hasPottyBreak: true })
    );
    
    expect(result.current.cellClassNames).toContain('bg-green-100');
    expect(result.current.cellClassNames).toContain('border-green-200');
  });

  test('adds in-heat flag styling', () => {
    const { result } = renderHook(() => 
      useCellStyles({ 
        ...defaultProps, 
        flags: [{ type: 'in_heat', notes: 'In heat' }] 
      })
    );
    
    expect(result.current.cellClassNames).toContain('ring-2');
    expect(result.current.cellClassNames).toContain('ring-red-300');
    expect(result.current.isInHeat).toBe(true);
  });

  test('adds pregnant flag styling', () => {
    const { result } = renderHook(() => 
      useCellStyles({ 
        ...defaultProps, 
        flags: [{ type: 'pregnant', notes: 'Due in 3 weeks' }] 
      })
    );
    
    expect(result.current.cellClassNames).toContain('ring-2');
    expect(result.current.cellClassNames).toContain('ring-purple-300');
    expect(result.current.isPregnant).toBe(true);
  });

  test('adds special attention flag styling', () => {
    const { result } = renderHook(() => 
      useCellStyles({ 
        ...defaultProps, 
        flags: [{ type: 'special_attention', notes: 'Recent surgery' }] 
      })
    );
    
    expect(result.current.cellClassNames).toContain('ring-1');
    expect(result.current.cellClassNames).toContain('ring-blue-300');
    expect(result.current.hasSpecialAttention).toBe(true);
  });

  test('handles multiple flags correctly', () => {
    const { result } = renderHook(() => 
      useCellStyles({ 
        ...defaultProps, 
        flags: [
          { type: 'in_heat', notes: 'In heat' },
          { type: 'incompatible', notes: 'Keep separate from Rex' },
          { type: 'special_attention', notes: 'Recent surgery' }
        ] 
      })
    );
    
    // Should apply the in_heat styling (highest priority)
    expect(result.current.cellClassNames).toContain('ring-2');
    expect(result.current.cellClassNames).toContain('ring-red-300');
    
    // All flag booleans should be set correctly
    expect(result.current.isInHeat).toBe(true);
    expect(result.current.isPregnant).toBe(false);
    expect(result.current.hasIncompatibility).toBe(true);
    expect(result.current.hasSpecialAttention).toBe(true);
  });
});
