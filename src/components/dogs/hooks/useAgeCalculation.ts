
import { useMemo } from 'react';

export function useAgeCalculation(birthDateString: string | undefined) {
  return useMemo(() => {
    if (!birthDateString) return 'Unknown age';
    
    const today = new Date();
    const birthDate = new Date(birthDateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    if (age < 1) {
      // Calculate months for puppies
      const months = Math.max(0, age * 12 + (today.getMonth() - birthDate.getMonth()));
      return `${months} months`;
    }
    
    return `${age} years`;
  }, [birthDateString]);
}
