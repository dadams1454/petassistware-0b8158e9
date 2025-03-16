
import { useState, useCallback, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';

export const useCareTracking = (onRefresh?: () => void) => {
  const [careLogged, setCareLogged] = useState<Record<string, boolean>>({});
  const { toast } = useToast();
  
  // Debug log careLogged state changes
  useEffect(() => {
    console.log('Current care logged entries:', Object.keys(careLogged).length);
  }, [careLogged]);
  
  // Check if care has been logged for specific dog, time slot, and category
  const hasCareLogged = useCallback((dogId: string, timeSlot: string, category: string) => {
    const key = `${dogId}-${timeSlot}-${category}`;
    return careLogged[key] || false;
  }, [careLogged]);
  
  // Handle cell click for care logging
  const handleCellClick = useCallback((dogId: string, dogName: string, timeSlot: string, category: string) => {
    console.log('📝 Care cell clicked:', { dogId, dogName, timeSlot, category });
    
    // For potty breaks, we handle this through a dedicated potty break handler
    if (category === 'pottybreaks') {
      console.log('Ignoring click in care handler - this is a potty break, will be handled elsewhere');
      return;
    }
    
    // For other care types, toggle the care logged state
    const key = `${dogId}-${timeSlot}-${category}`;
    
    if (careLogged[key]) {
      // Remove the care logged if it exists
      const updatedCareLogged = { ...careLogged };
      delete updatedCareLogged[key];
      setCareLogged(updatedCareLogged);
      
      toast({
        title: "Care removed",
        description: `Removed ${category} for ${dogName} at ${timeSlot}`,
      });
      
      console.log('🚫 Care removed:', { key });
    } else {
      // Add new care logged
      setCareLogged(prev => ({
        ...prev,
        [key]: true
      }));
      
      toast({
        title: "Care logged",
        description: `Logged ${category} for ${dogName} at ${timeSlot}`,
      });
      
      console.log('✅ Care logged:', { key });
    }
    
    // Trigger refresh if provided
    if (onRefresh) {
      onRefresh();
    }
  }, [careLogged, toast, onRefresh]);
  
  return {
    careLogged,
    hasCareLogged,
    handleCellClick
  };
};
