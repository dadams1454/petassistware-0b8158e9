
import { useState, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';

interface PottyBreak {
  dogId: string;
  timeSlot: string;
  timestamp: string;
}

export const usePottyBreaks = (onRefresh?: () => void) => {
  const [pottyBreaks, setPottyBreaks] = useState<PottyBreak[]>([]);
  const { toast } = useToast();
  
  const hasPottyBreak = useCallback((dogId: string, timeSlot: string) => {
    return pottyBreaks.some(pb => pb.dogId === dogId && pb.timeSlot === timeSlot);
  }, [pottyBreaks]);
  
  const handleCellClick = useCallback((dogId: string, dogName: string, timeSlot: string, category: string) => {
    // Only handle potty break logging in the potty breaks tab
    if (category === 'pottybreaks') {
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
        
        console.log('Potty break removed:', {
          dog: { id: dogId, name: dogName },
          timeSlot
        });
      } else {
        // Add new potty break
        const newPottyBreak = {
          dogId,
          timeSlot,
          timestamp: new Date().toISOString()
        };
        
        setPottyBreaks([...pottyBreaks, newPottyBreak]);
        
        // Show toast for added potty break
        toast({
          title: "Potty break logged",
          description: `${dogName} was taken out at ${timeSlot}`,
        });
        
        console.log('Potty break logged:', {
          dog: { id: dogId, name: dogName },
          timeSlot,
          timestamp: new Date().toISOString(),
        });
      }
      
      // Trigger refresh if provided
      if (onRefresh) {
        onRefresh();
      }
    }
  }, [pottyBreaks, toast, onRefresh]);
  
  return {
    pottyBreaks,
    setPottyBreaks,
    hasPottyBreak,
    handleCellClick
  };
};
