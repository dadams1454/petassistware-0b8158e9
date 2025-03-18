
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { DogCareStatus } from '@/types/dailyCare';

interface SpecialConditionsAlertProps {
  dogs: DogCareStatus[];
}

const SpecialConditionsAlert: React.FC<SpecialConditionsAlertProps> = ({ dogs }) => {
  // Find dogs with special conditions
  const dogsInHeat = dogs.filter(dog => 
    dog.flags?.some(flag => flag.type === 'in_heat')
  );
  
  const dogsWithSpecialAttention = dogs.filter(dog => 
    dog.flags?.some(flag => flag.type === 'special_attention')
  );
  
  const pregnantDogs = dogsWithSpecialAttention.filter(dog => 
    dog.flags?.some(flag => 
      flag.type === 'special_attention' && 
      flag.value?.toLowerCase().includes('pregnant')
    )
  );
  
  const otherSpecialAttentionDogs = dogsWithSpecialAttention.filter(dog => 
    !dog.flags?.some(flag => 
      flag.type === 'special_attention' && 
      flag.value?.toLowerCase().includes('pregnant')
    )
  );
  
  const incompatibleDogs = dogs.filter(dog => 
    dog.flags?.some(flag => flag.type === 'incompatible')
  );
  
  // Check if we have any dogs with special conditions
  const hasSpecialConditions = dogsInHeat.length > 0 || 
                              pregnantDogs.length > 0 || 
                              otherSpecialAttentionDogs.length > 0 || 
                              incompatibleDogs.length > 0;
  
  if (!hasSpecialConditions) {
    return null;
  }
  
  return (
    <div className="px-6 pt-0 pb-2">
      <Alert className="bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-300">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription className="text-sm">
          <span className="font-semibold">Special attention needed:</span>{' '}
          {dogsInHeat.length > 0 && (
            <span>🔴 {dogsInHeat.length} dog(s) in heat. </span>
          )}
          {pregnantDogs.length > 0 && (
            <span>🩷 {pregnantDogs.length} pregnant dog(s). </span>
          )}
          {otherSpecialAttentionDogs.length > 0 && (
            <span>🔔 {otherSpecialAttentionDogs.length} dog(s) needing special care. </span>
          )}
          {incompatibleDogs.length > 0 && (
            <span>⚠️ {incompatibleDogs.length} dog(s) with incompatibility issues. </span>
          )}
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default SpecialConditionsAlert;
