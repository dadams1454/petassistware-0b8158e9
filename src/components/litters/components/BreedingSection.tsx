
import React from 'react';
import { SectionHeader } from '@/components/ui/standardized';
import BreedingManagement from './BreedingManagement';
import GeneticBreedingRecommendations from '@/components/breeding/GeneticBreedingRecommendations';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Dna } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface BreedingSectionProps {
  onRefresh?: () => void;
  selectedDogId?: string;
}

const BreedingSection: React.FC<BreedingSectionProps> = ({ onRefresh, selectedDogId }) => {
  const navigate = useNavigate();
  
  const handleViewGeneticCompatibility = () => {
    navigate('/genetics/pairing');
  };
  
  return (
    <div className="space-y-6">
      <SectionHeader 
        title="Breeding Management" 
        description="Monitor heat cycles and breeding activities"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <BreedingManagement onRefresh={onRefresh} dog={selectedDogId ? { id: selectedDogId } : undefined} />
        </div>
        
        <div className="space-y-4">
          <GeneticBreedingRecommendations preselectedDogId={selectedDogId} />
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Dna className="h-5 w-5 text-indigo-500" />
                Genetic Compatibility
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Advanced genetic compatibility analysis for specific breeding pairs.
              </p>
              
              <Button 
                variant="outline" 
                className="w-full"
                onClick={handleViewGeneticCompatibility}
              >
                <Dna className="h-4 w-4 mr-2" />
                Analyze Specific Pair
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BreedingSection;
