
import React, { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';

interface PottyBreakLoggerProps {
  dogId: string;
  dogName: string;
  timeSlot: string;
  onSuccess?: () => void;
}

const PottyBreakLogger: React.FC<PottyBreakLoggerProps> = ({
  dogId,
  dogName,
  timeSlot,
  onSuccess,
}) => {
  const { toast } = useToast();

  // Directly log the potty break without showing a dialog
  const logPottyBreak = () => {
    // In a real implementation, this would save to a database
    console.log('Potty break logged:', {
      dog: { id: dogId, name: dogName },
      timeSlot,
      timestamp: new Date().toISOString(),
    });

    toast({
      title: "Potty break logged",
      description: `${dogName} was taken out at ${timeSlot}`,
    });

    if (onSuccess) {
      onSuccess();
    }
  };

  // Automatically log the potty break when the component is mounted
  React.useEffect(() => {
    logPottyBreak();
  }, []);

  return null; // This component doesn't render anything
};

export default PottyBreakLogger;
