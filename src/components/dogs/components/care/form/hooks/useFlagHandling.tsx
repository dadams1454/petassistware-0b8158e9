
import { useState, useEffect } from 'react';
import { DogFlag, FlagType } from '@/types/dailyCare';
import { useToast } from '@/components/ui/use-toast';

export interface UseFlagHandlingProps {
  initialFlags?: DogFlag[];
  onFlagChange?: (flags: DogFlag[]) => void;
  dogId?: string;
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
  const { toast } = useToast();
  
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

  // Add handler for incompatible dog toggling
  const handleIncompatibleDogToggle = (dogId: string) => {
    if (!setIncompatibleDogs) return;
    
    if (incompatibleDogs.includes(dogId)) {
      setIncompatibleDogs(incompatibleDogs.filter(id => id !== dogId));
    } else {
      setIncompatibleDogs([...incompatibleDogs, dogId]);
    }
  };

  // Compile flags function
  const compileFlags = (): DogFlag[] => {
    const flags: DogFlag[] = [...selectedFlags];
    
    // Add special attention flag if note exists
    if (specialAttentionNote && specialAttentionNote.trim() !== '') {
      flags.push({
        id: 'special-attention',
        name: 'Special Attention',
        color: '#ff9900',
        value: specialAttentionNote,
        description: specialAttentionNote,
        type: 'special_attention'
      });
    }
    
    // Add other flag if note exists
    if (otherFlagNote && otherFlagNote.trim() !== '') {
      flags.push({
        id: 'other-note',
        name: 'Other Note',
        color: '#888888',
        value: otherFlagNote,
        description: otherFlagNote,
        type: 'other'
      });
    }
    
    // Add incompatible dogs flag if any are selected
    if (incompatibleDogs && incompatibleDogs.length > 0) {
      flags.push({
        id: 'incompatible-dogs',
        name: 'Incompatible Dogs',
        color: '#cc0000',
        value: `Incompatible with dogs: ${incompatibleDogs.join(', ')}`,
        description: `Incompatible with dogs: ${incompatibleDogs.join(', ')}`,
        type: 'incompatible',
        incompatible_with: incompatibleDogs
      });
    }
    
    return flags;
  };

  return {
    selectedFlags,
    hasConflict,
    toggleFlag,
    handleIncompatibleDogToggle,
    compileFlags
  };
};
