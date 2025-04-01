
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useBreedingPlan } from '@/hooks/useBreedingPlan';
import { Dog, DogGender } from '@/types/dog';
import { LoadingState, ErrorState } from '@/components/ui/standardized';
import { DogSelector } from '@/components/dogs/components/selectors/DogSelector';

interface BreedingSectionProps {
  litter: any;
  onUpdate: (data: any) => void;
}

export const BreedingSection: React.FC<BreedingSectionProps> = ({ litter, onUpdate }) => {
  const [firstMatingDate, setFirstMatingDate] = useState(litter?.first_mating_date || '');
  const [lastMatingDate, setLastMatingDate] = useState(litter?.last_mating_date || '');
  const [selectedSire, setSelectedSire] = useState<Dog | null>(null);
  const [selectedDam, setSelectedDam] = useState<Dog | null>(null);
  
  const { isLoading, error, compatibleDams, compatibleSires } = useBreedingPlan(
    selectedSire?.id, 
    selectedDam?.id
  );
  
  React.useEffect(() => {
    // Load initial dog values if available
    // This is a placeholder for actual data loading logic
    if (litter?.sire_id) {
      // For demonstration purposes only - in a real app, fetch the actual dog data
      setSelectedSire({
        id: litter.sire_id,
        name: "Sire Name", // This would come from a database lookup
        breed: "Breed",
        created_at: new Date().toISOString()
      });
    }
    
    if (litter?.dam_id) {
      // For demonstration purposes only
      setSelectedDam({
        id: litter.dam_id,
        name: "Dam Name", // This would come from a database lookup
        breed: "Breed",
        created_at: new Date().toISOString()
      });
    }
  }, [litter]);
  
  const handleDogSelect = (dog: Dog, type: 'sire' | 'dam') => {
    if (type === 'sire') {
      setSelectedSire(dog);
    } else {
      setSelectedDam(dog);
    }
  };
  
  const handleSave = () => {
    onUpdate({
      sire_id: selectedSire?.id,
      dam_id: selectedDam?.id,
      first_mating_date: firstMatingDate,
      last_mating_date: lastMatingDate
    });
  };
  
  if (isLoading) {
    return <LoadingState message="Loading breeding options..." />;
  }
  
  if (error) {
    return <ErrorState title="Error" message="Failed to load breeding options." />;
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Breeding Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Sire Selection */}
          <div className="space-y-3">
            <Label>Sire (Father)</Label>
            <DogSelector 
              availableDogs={compatibleSires || []}
              selectedDog={selectedSire}
              onSelect={(dog) => handleDogSelect(dog, 'sire')}
              filter={{ gender: DogGender.Male }}
            />
          </div>
          
          {/* Dam Selection */}
          <div className="space-y-3">
            <Label>Dam (Mother)</Label>
            <DogSelector 
              availableDogs={compatibleDams || []}
              selectedDog={selectedDam}
              onSelect={(dog) => handleDogSelect(dog, 'dam')}
              filter={{ gender: DogGender.Female }}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* First Mating Date */}
          <div className="space-y-3">
            <Label>First Mating Date</Label>
            <Input
              type="date"
              value={firstMatingDate}
              onChange={(e) => setFirstMatingDate(e.target.value)}
            />
          </div>
          
          {/* Last Mating Date */}
          <div className="space-y-3">
            <Label>Last Mating Date</Label>
            <Input
              type="date"
              value={lastMatingDate}
              onChange={(e) => setLastMatingDate(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button onClick={handleSave}>Save Breeding Information</Button>
        </div>
      </CardContent>
    </Card>
  );
};
