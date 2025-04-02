
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface WelpingGuideCardProps {
  onStartBreedingPrep: () => void;
}

const WelpingGuideCard: React.FC<WelpingGuideCardProps> = ({ onStartBreedingPrep }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Reproduction Workflow</CardTitle>
        <CardDescription>
          Follow this process for successful breeding and whelping
        </CardDescription>
      </CardHeader>
      <CardContent className="text-sm space-y-2">
        <div className="flex items-start gap-2">
          <div className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs mt-0.5">1</div>
          <div>
            <p className="font-medium">Breeding Preparation</p>
            <p className="text-muted-foreground">Record heat cycles, plan breeding, perform health checks</p>
          </div>
        </div>
        
        <div className="flex items-start gap-2">
          <div className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs mt-0.5">2</div>
          <div>
            <p className="font-medium">Pregnancy Tracking</p>
            <p className="text-muted-foreground">Confirm pregnancy, track progress, prepare for whelping</p>
          </div>
        </div>
        
        <div className="flex items-start gap-2">
          <div className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs mt-0.5">3</div>
          <div>
            <p className="font-medium">Whelping Management</p>
            <p className="text-muted-foreground">Record birth details, monitor dam and puppies</p>
          </div>
        </div>
        
        <div className="flex items-start gap-2">
          <div className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs mt-0.5">4</div>
          <div>
            <p className="font-medium">Litter Management</p>
            <p className="text-muted-foreground">Track growth, health, and development milestones</p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full" onClick={onStartBreedingPrep}>
          Start Breeding Preparation
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default WelpingGuideCard;
