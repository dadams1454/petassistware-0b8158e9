
import { useState, useEffect } from 'react';
import { DogFlag } from '@/types/dailyCare';
import { toast } from '@/hooks/use-toast';

export interface UseFlagHandlingProps {
  initialFlags?: DogFlag[];
  onFlagChange?: (flags: DogFlag[]) => void;
  dogId?: string; // Added missing property
  setOtherDogs?: React.Dispatch<React.SetStateAction<any[]>>;
  incompatibleDogs?: string[];
  setIncompatibleDogs?: React.Dispatch<React.SetStateAction<string[]>>;
  selectedFlags?: DogFlag[];
  setSelectedFlags?: React.Dispatch<React.SetStateAction<DogFlag[]>>;
  specialAttentionNote?: string;
  otherFlagNote?: string;
}

export const useFlagHandling = ({
  dogId,
  setOtherDogs,
  incompatibleDogs = [],
  setIncompatibleDogs,
  selectedFlags: propSelectedFlags,
  setSelectedFlags: propSetSelectedFlags,
  specialAttentionNote,
  otherFlagNote,
  initialFlags = [],
  onFlagChange
}: UseFlagHandlingProps) => {
  const [localSelectedFlags, setLocalSelectedFlags] = useState<DogFlag[]>(initialFlags);
  const [hasConflict, setHasConflict] = useState(false);
  
  // Use props values if provided, otherwise use local state
  const selectedFlags = propSelectedFlags || localSelectedFlags;
  const setSelectedFlags = propSetSelectedFlags || setLocalSelectedFlags;

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

  // Add the missing handler for incompatible dog toggling
  const handleIncompatibleDogToggle = (dogId: string) => {
    if (!setIncompatibleDogs) return;
    
    if (incompatibleDogs.includes(dogId)) {
      setIncompatibleDogs(incompatibleDogs.filter(id => id !== dogId));
    } else {
      setIncompatibleDogs([...incompatibleDogs, dogId]);
    }
  };

  // Add the missing compileFlags function
  const compileFlags = (): DogFlag[] => {
    const flags: DogFlag[] = [...selectedFlags];
    
    // Add special attention flag if note exists
    if (specialAttentionNote && specialAttentionNote.trim()) {
      flags.push({
        id: 'special-attention-' + Date.now(),
        name: 'Special Attention',
        color: '#FF5733',
        type: 'special_attention',
        value: specialAttentionNote
      });
    }
    
    // Add other flag note if exists
    if (otherFlagNote && otherFlagNote.trim()) {
      flags.push({
        id: 'other-' + Date.now(),
        name: 'Other',
        color: '#808080',
        type: 'other',
        value: otherFlagNote
      });
    }
    
    // Add incompatible dogs flag if any are selected
    if (incompatibleDogs && incompatibleDogs.length > 0) {
      flags.push({
        id: 'incompatible-' + Date.now(),
        name: 'Incompatible Dogs',
        color: '#FF0000',
        type: 'incompatible',
        value: incompatibleDogs.join(',')
      });
    }
    
    return flags;
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
    createAbnormalFlag,
    handleIncompatibleDogToggle, // Added missing function
    compileFlags // Added missing function
  };
};
