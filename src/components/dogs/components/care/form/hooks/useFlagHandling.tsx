
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { DogFlag } from '@/types/dailyCare';

interface UseFlagHandlingProps {
  dogId: string;
  setOtherDogs: (dogs: Array<{ id: string; name: string }>) => void;
  incompatibleDogs: string[];
  setIncompatibleDogs: (dogs: string[]) => void;
  selectedFlags: {
    in_heat: boolean;
    incompatible: boolean;
    special_attention: boolean;
    other: boolean;
  };
  setSelectedFlags: React.Dispatch<React.SetStateAction<{
    in_heat: boolean;
    incompatible: boolean;
    special_attention: boolean;
    other: boolean;
  }>>;
  specialAttentionNote: string;
  otherFlagNote: string;
}

export const useFlagHandling = ({
  dogId,
  setOtherDogs,
  incompatibleDogs,
  setIncompatibleDogs,
  selectedFlags,
  setSelectedFlags,
  specialAttentionNote,
  otherFlagNote
}: UseFlagHandlingProps) => {
  useEffect(() => {
    // Fetch other dogs for incompatibility selection
    const fetchOtherDogs = async () => {
      try {
        const { data, error } = await supabase
          .from('dogs')
          .select('id, name')
          .neq('id', dogId)
          .order('name');
        
        if (error) throw error;
        setOtherDogs(data || []);
      } catch (error) {
        console.error('Error fetching other dogs:', error);
      }
    };
    
    fetchOtherDogs();
  }, [dogId, setOtherDogs]);

  const handleIncompatibleDogToggle = (dogId: string) => {
    // Fixed: We're updating the state using a function, so we need to fix the type issue
    setIncompatibleDogs((current) => {
      // Explicitly create a new array of string[] type
      return current.includes(dogId)
        ? current.filter(id => id !== dogId)
        : [...current, dogId];
    });
  };

  const toggleFlag = (flagType: keyof typeof selectedFlags) => {
    setSelectedFlags(prev => ({
      ...prev,
      [flagType]: !prev[flagType]
    }));
  };

  const compileFlags = (): DogFlag[] => {
    const flags: DogFlag[] = [];
    
    if (selectedFlags.in_heat) {
      flags.push({ type: 'in_heat' });
    }
    
    if (selectedFlags.incompatible && incompatibleDogs.length > 0) {
      flags.push({ 
        type: 'incompatible',
        incompatible_with: incompatibleDogs
      });
    }
    
    if (selectedFlags.special_attention && specialAttentionNote) {
      flags.push({
        type: 'special_attention',
        value: specialAttentionNote
      });
    }
    
    if (selectedFlags.other && otherFlagNote) {
      flags.push({
        type: 'other',
        value: otherFlagNote
      });
    }
    
    return flags;
  };

  return {
    handleIncompatibleDogToggle,
    toggleFlag,
    compileFlags
  };
};
