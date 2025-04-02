
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BreedingPrepTab: React.FC = () => {
  const navigate = useNavigate();
  
  const handleGoToBreeding = () => {
    navigate('/reproduction/breeding');
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Breeding Preparation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="font-medium text-lg">Steps for Breeding Preparation</h3>
            
            <div className="space-y-3">
              <div className="border-l-4 border-primary pl-4 py-1">
                <h4 className="font-medium">1. Heat Cycle Tracking</h4>
                <p className="text-muted-foreground text-sm">
                  Track your female dog's heat cycles to determine optimal breeding time.
                </p>
              </div>
              
              <div className="border-l-4 border-primary pl-4 py-1">
                <h4 className="font-medium">2. Health Clearances</h4>
                <p className="text-muted-foreground text-sm">
                  Ensure all necessary health tests and genetic screenings are completed for both dam and sire.
                </p>
              </div>
              
              <div className="border-l-4 border-primary pl-4 py-1">
                <h4 className="font-medium">3. Select Compatible Mate</h4>
                <p className="text-muted-foreground text-sm">
                  Choose a suitable sire based on temperament, health, conformation, and genetic compatibility.
                </p>
              </div>
              
              <div className="border-l-4 border-primary pl-4 py-1">
                <h4 className="font-medium">4. Plan Breeding Timeline</h4>
                <p className="text-muted-foreground text-sm">
                  Schedule the breeding, arrange logistics, and prepare for progesterone testing if needed.
                </p>
              </div>
              
              <div className="border-l-4 border-primary pl-4 py-1">
                <h4 className="font-medium">5. Document Breeding</h4>
                <p className="text-muted-foreground text-sm">
                  Record breeding dates, methods, and any relevant observations.
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center">
            <Button onClick={handleGoToBreeding}>
              Go To Breeding Management
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BreedingPrepTab;
