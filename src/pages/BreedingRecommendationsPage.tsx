
import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DogSelector } from '@/components/genetics/DogSelector';
import BreedingRecommendations from '@/components/genetics/BreedingRecommendations';
import { useDogDetail } from '@/components/dogs/hooks/useDogDetail';
import PageContainer from '@/components/common/PageContainer';
import BackButton from '@/components/common/BackButton';

const BreedingRecommendationsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialDogId = searchParams.get('dogId') || '';
  const initialPartnerId = searchParams.get('partnerId') || '';
  
  const [selectedDogId, setSelectedDogId] = useState<string>(initialDogId);
  const [selectedPartnerId, setSelectedPartnerId] = useState<string>(initialPartnerId);
  
  const { dog } = useDogDetail(selectedDogId);
  
  return (
    <PageContainer>
      <div className="container mx-auto py-6 space-y-6">
        <BackButton fallbackPath="/dogs" />
        
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Breeding Recommendations</h1>
          <p className="text-muted-foreground">
            Analyze genetic compatibility and generate breeding recommendations
          </p>
        </div>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Select Dog</CardTitle>
            <CardDescription>
              Choose a dog to see breeding recommendations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Dog</label>
                <DogSelector
                  value={selectedDogId}
                  onChange={setSelectedDogId}
                  placeholder="Select dog..."
                />
              </div>
              
              {selectedDogId && dog?.gender && (
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Specific Breeding Partner (Optional)
                  </label>
                  <DogSelector
                    value={selectedPartnerId}
                    onChange={setSelectedPartnerId}
                    placeholder={`Select ${dog.gender === 'male' ? 'female' : 'male'} partner...`}
                    filterSex={dog.gender === 'male' ? 'female' : 'male'}
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        {selectedDogId && (
          <BreedingRecommendations 
            dogId={selectedDogId}
            selectedPartnerId={selectedPartnerId || undefined}
          />
        )}
      </div>
    </PageContainer>
  );
};

export default BreedingRecommendationsPage;
