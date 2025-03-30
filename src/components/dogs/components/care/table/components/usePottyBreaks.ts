
import { useState, useCallback, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';

interface PottyBreak {
  dogId: string;
  timeSlot: string;
  timestamp: string;
}

export const usePottyBreaks = (onRefresh?: () => void) => {
  const [pottyBreaks, setPottyBreaks] = useState<PottyBreak[]>([]);
  const { toast } = useToast();
  
  // Log potty breaks on change for debugging
  useEffect(() => {
    console.log('Current potty breaks:', pottyBreaks);
  }, [pottyBreaks]);
  
  const hasPottyBreak = useCallback((dogId: string, timeSlot: string) => {
    const result = pottyBreaks.some(pb => pb.dogId === dogId && pb.timeSlot === timeSlot);
    // Verbose logging removed to clean up console, uncomment if needed for debugging
    // console.log('Checking potty break for:', dogId, timeSlot, 'Result:', result);
    return result;
  }, [pottyBreaks]);
  
  const handleCellClick = useCallback((dogId: string, dogName: string, timeSlot: string, category: string) => {
    // Only handle potty break logging in the potty breaks tab
    if (category === 'pottybreaks') {
      console.log('⭐ Potty break cell clicked:', { dogId, dogName, timeSlot });
      
      // Check if this dog already has a potty break at this time
      const existingBreakIndex = pottyBreaks.findIndex(
        pb => pb.dogId === dogId && pb.timeSlot === timeSlot
      );
      
      if (existingBreakIndex >= 0) {
        // Remove the potty break if it exists
        const updatedBreaks = [...pottyBreaks];
        updatedBreaks.splice(existingBreakIndex, 1);
        setPottyBreaks(updatedBreaks);
        
        // Show toast for removal
        toast({
          title: "Potty break removed",
          description: `Removed potty break for ${dogName} at ${timeSlot}`,
        });
        
        console.log('🚫 Potty break removed for', dogName, 'at', timeSlot);
      } else {
        // Add new potty break
        const newPottyBreak = {
          dogId,
          timeSlot,
          timestamp: new Date().toISOString()
        };
        
        setPottyBreaks(prev => [...prev, newPottyBreak]);
        
        // Show toast for added potty break
        toast({
          title: "Potty break logged",
          description: `${dogName} was taken out at ${timeSlot}`,
        });
        
        console.log('✅ Potty break added for', dogName, 'at', timeSlot);
      }
      
      // Trigger refresh if provided
      if (onRefresh) {
        onRefresh();
      }
    } else {
      console.log('Ignoring cell click in potty handler - not a potty category:', category);
    }
  }, [pottyBreaks, toast, onRefresh]);
  
  return {
    pottyBreaks,
    setPottyBreaks,
    hasPottyBreak,
    handleCellClick
  };
};
