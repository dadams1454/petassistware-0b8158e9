
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DogSelector } from '@/components/genetics/DogSelector';
import { useDogDetail } from '@/components/dogs/hooks/useDogDetail';
import { Dna, ChevronRight } from 'lucide-react';

export interface GeneticBreedingRecommendationsProps {
  preselectedDogId?: string;
}

const GeneticBreedingRecommendations: React.FC<GeneticBreedingRecommendationsProps> = ({
  preselectedDogId
}) => {
  const navigate = useNavigate();
  const [selectedDogId, setSelectedDogId] = useState<string>(preselectedDogId || '');
  const { dog } = useDogDetail(selectedDogId);
  
  const viewRecommendations = () => {
    if (selectedDogId) {
      navigate(`/breeding/recommendations?dogId=${selectedDogId}`);
    }
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-base">
          <Dna className="h-5 w-5 mr-2 text-primary" />
          Genetic Breeding Recommendations
        </CardTitle>
        <CardDescription>
          Find optimal breeding pairs based on genetic compatibility
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium block mb-1">
              Dog
            </label>
            <DogSelector
              value={selectedDogId}
              onChange={setSelectedDogId}
              placeholder="Select a dog..."
            />
          </div>
          
          {dog?.gender && (
            <div className="p-3 rounded-md bg-muted">
              <span className="text-sm block mb-1">Selected: <strong>{dog.name}</strong></span>
              <span className="text-xs text-muted-foreground">
                {dog.breed} • {dog.gender === 'male' ? 'Male' : 'Female'}
                {dog.color ? ` • ${dog.color}` : ''}
              </span>
            </div>
          )}
          
          <Button 
            className="w-full" 
            disabled={!selectedDogId}
            onClick={viewRecommendations}
          >
            View Breeding Recommendations
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default GeneticBreedingRecommendations;
