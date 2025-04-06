
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDogProfileData } from '@/hooks/useDogProfileData';
import WhelpingPreparation from './reproductive/WhelpingPreparation';
import { DogGender, DogStatus } from '@/types/dog';
import FemaleBreedingPreparation from './reproductive/FemaleBreedingPreparation';
import MaleBreedingPreparation from './reproductive/MaleBreedingPreparation';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { useBreedingPreparation } from '@/hooks/breeding/useBreedingPreparation';

interface BreedingPreparationProps {
  dogId?: string;
}

const BreedingPreparation: React.FC<BreedingPreparationProps> = ({ dogId }) => {
  const navigate = useNavigate();
  const { dog, isLoading, error } = useDogProfileData(dogId);
  const { fetchBreedingData, breedingData } = useBreedingPreparation();
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  
  useEffect(() => {
    if (dogId) {
      fetchBreedingData(dogId);
    }
    // Only show the loading state on initial load
    if (!isLoading && isInitialLoad) {
      setIsInitialLoad(false);
    }
  }, [dogId, fetchBreedingData, isLoading, isInitialLoad]);
  
  if (isInitialLoad) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="h-[300px] w-full" />
      </div>
    );
  }
  
  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-6">
            <p className="text-red-500">Error loading dog data</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => navigate('/dogs')}
            >
              Go Back to Dogs
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (!dog) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-6">
            <p>No dog selected or found</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => navigate('/dogs')}
            >
              Select a Dog
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Make sure we're using the correct enum value from DogStatus
  const isActive = dog.status === DogStatus.Active;
  
  if (!isActive) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-6">
            <p>Breeding preparation is only available for active dogs</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => navigate('/dogs')}
            >
              Go Back to Dogs
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Breeding Preparation for {dog.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-6">
            {dog.gender === DogGender.Female 
              ? "This dashboard helps you prepare and track the breeding process for your female dog."
              : "This dashboard helps you prepare and track the breeding process for your male dog."
            }
          </p>
          
          {dog.gender === DogGender.Female ? (
            <>
              <FemaleBreedingPreparation dog={dog} breedingData={breedingData} />
              <WhelpingPreparation dog={dog} />
            </>
          ) : (
            <MaleBreedingPreparation dog={dog} breedingData={breedingData} />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BreedingPreparation;
