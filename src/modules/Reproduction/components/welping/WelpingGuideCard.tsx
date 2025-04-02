
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, BookOpen, CheckCircle } from 'lucide-react';

interface WelpingGuideCardProps {
  onStartBreedingPrep: () => void;
}

const WelpingGuideCard: React.FC<WelpingGuideCardProps> = ({
  onStartBreedingPrep
}) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <BookOpen className="h-5 w-5 mr-2 text-muted-foreground" />
          Whelping Preparation Guide
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex gap-2">
            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-sm">Start with Breeding Prep</h4>
              <p className="text-xs text-muted-foreground">Plan breeding, pair compatible dogs, and track heat cycles</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-sm">Monitor Pregnancy</h4>
              <p className="text-xs text-muted-foreground">Track pregnancy progress, record vet visits, and prepare for whelping</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-sm">Record Whelping</h4>
              <p className="text-xs text-muted-foreground">Document births, track puppies, and record health information</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-sm">Manage Litters</h4>
              <p className="text-xs text-muted-foreground">Organize puppies by litter, track development, and manage sales</p>
            </div>
          </div>
        </div>
        
        <div className="bg-amber-50 border border-amber-200 rounded-md p-3 flex gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-sm">Important Reminder</h4>
            <p className="text-xs text-muted-foreground">Always consult with a veterinarian for professional health guidance during breeding and whelping.</p>
          </div>
        </div>
        
        <Button 
          variant="outline" 
          className="w-full mt-2"
          onClick={onStartBreedingPrep}
        >
          Start Breeding Preparation
        </Button>
      </CardContent>
    </Card>
  );
};

export default WelpingGuideCard;
