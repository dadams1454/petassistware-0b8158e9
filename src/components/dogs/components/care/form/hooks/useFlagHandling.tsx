
import { useState, useEffect } from 'react';
import { DogFlag } from '@/types/dailyCare';
import { toast } from '@/hooks/use-toast';

export interface UseFlagHandlingProps {
  initialFlags?: DogFlag[];
  onFlagChange?: (flags: DogFlag[]) => void;
}

export const useFlagHandling = ({
  initialFlags = [],
  onFlagChange
}: UseFlagHandlingProps) => {
  const [selectedFlags, setSelectedFlags] = useState<DogFlag[]>(initialFlags);
  const [hasConflict, setHasConflict] = useState(false);

  useEffect(() => {
    // Run conflict detection whenever flags change
    detectConflicts(selectedFlags);
    // Notify parent component of flag changes if callback provided
    if (onFlagChange) {
      onFlagChange(selectedFlags);
    }
  }, [selectedFlags, onFlagChange]);

  const detectConflicts = (flags: DogFlag[]) => {
    let conflicts = false;

    // Check each flag against all other flags
    flags.forEach((flag) => {
      if (flag.incompatible_with && flag.incompatible_with.length > 0) {
        // Check if any incompatible flags are also selected
        const hasConflictingFlag = flags.some(
          (otherFlag) => 
            flag.id !== otherFlag.id && 
            flag.incompatible_with?.includes(otherFlag.id)
        );
        
        if (hasConflictingFlag) {
          conflicts = true;
        }
      }
    });

    setHasConflict(conflicts);
    return conflicts;
  };

  const toggleFlag = (flag: DogFlag) => {
    const isAlreadySelected = selectedFlags.some(f => f.id === flag.id);
    
    if (isAlreadySelected) {
      // Remove the flag
      setSelectedFlags(selectedFlags.filter(f => f.id !== flag.id));
    } else {
      // Add the flag
      const newFlags = [...selectedFlags, flag];
      
      // Check for conflicts before adding
      const wouldHaveConflict = detectConflicts(newFlags);
      
      if (wouldHaveConflict) {
        toast({
          title: "Flag Conflict",
          description: `Flag "${flag.name}" conflicts with another selected flag.`,
          variant: "destructive"
        });
        return;
      }
      
      setSelectedFlags(newFlags);
    }
  };

  const createNoteFlag = () => {
    // Create a properly structured DogFlag object
    const noteFlag: DogFlag = {
      id: 'note-' + Date.now(),
      name: 'Note Added',
      color: '#FFD700',
      type: 'note'
    };
    
    toggleFlag(noteFlag);
  };

  const createUrgentFlag = (incompatibleFlags: string[] = []) => {
    // Create a properly structured DogFlag object
    const urgentFlag: DogFlag = {
      id: 'urgent-' + Date.now(),
      name: 'Urgent',
      color: '#FF0000',
      type: 'urgent',
      incompatible_with: incompatibleFlags
    };
    
    toggleFlag(urgentFlag);
  };

  const createFollowUpFlag = (value: string) => {
    // Create a properly structured DogFlag object
    const followUpFlag: DogFlag = {
      id: 'follow-up-' + Date.now(),
      name: 'Follow Up',
      color: '#FFA500',
      type: 'follow-up',
      value
    };
    
    toggleFlag(followUpFlag);
  };

  const createAbnormalFlag = (value: string) => {
    // Create a properly structured DogFlag object
    const abnormalFlag: DogFlag = {
      id: 'abnormal-' + Date.now(),
      name: 'Abnormal',
      color: '#8B0000',
      type: 'abnormal',
      value
    };
    
    toggleFlag(abnormalFlag);
  };

  return {
    selectedFlags,
    hasConflict,
    toggleFlag,
    createNoteFlag,
    createUrgentFlag,
    createFollowUpFlag,
    createAbnormalFlag
  };
};
