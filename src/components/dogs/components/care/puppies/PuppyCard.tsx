import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PuppyWithAge, PuppyAgeGroupData } from '@/types/puppyTracking';
import { CheckCircle2, AlertCircle } from 'lucide-react';

interface PuppyCardProps {
  puppy: PuppyWithAge;
  ageGroup: PuppyAgeGroupData;
  onRefresh: () => void;
}

const PuppyCard: React.FC<PuppyCardProps> = ({ puppy, ageGroup, onRefresh }) => {
  // For now just a placeholder component
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex justify-between items-center">
          <span>{puppy.name || 'Unnamed Puppy'}</span>
          <span className="text-xs font-normal bg-primary/10 px-2 py-1 rounded-full">
            {puppy.ageInDays} days
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          <div className="text-sm text-muted-foreground">
            <span className="font-medium">Color:</span> {puppy.color || 'Not specified'}
          </div>
          <div className="text-sm text-muted-foreground">
            <span className="font-medium">Gender:</span> {puppy.gender || 'Not specified'}
          </div>
          
          {/* Status indicators - to be implemented later */}
          <div className="flex flex-col gap-1 mt-3">
            <div className="flex items-center text-xs text-green-600">
              <CheckCircle2 className="h-3 w-3 mr-1" /> Weight tracked
            </div>
            <div className="flex items-center text-xs text-amber-600">
              <AlertCircle className="h-3 w-3 mr-1" /> Needs wellness check
            </div>
          </div>
          
          <Button 
            size="sm" 
            className="w-full mt-3"
            variant="outline"
            onClick={() => {}}
          >
            Log Care
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PuppyCard;
