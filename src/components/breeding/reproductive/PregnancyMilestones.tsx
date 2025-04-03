
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';
import { Dog } from '@/types/litter';
import { ReproductiveStatus } from '@/types/reproductive';

interface PregnancyMilestonesProps {
  dog: Dog;
}

const PregnancyMilestones: React.FC<PregnancyMilestonesProps> = ({ dog }) => {
  // Type-safe check for pregnancy status
  const isPregnant = dog.is_pregnant === true || 
                    (dog.reproductive_status === ReproductiveStatus.Pregnant);

  if (!isPregnant) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Not Currently Pregnant</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Pregnancy tracking features will be available when this dog's status is updated to pregnant.
          </p>
        </CardContent>
      </Card>
    );
  }

  // In a real implementation, we would calculate milestone dates based on breeding date
  // For now, we'll just display a placeholder

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pregnancy Milestone Tracker</CardTitle>
      </CardHeader>
      <CardContent className="py-6 text-center">
        <p className="text-muted-foreground mb-4">
          Pregnancy milestone tracking feature is currently under development. 
          Check back soon for detailed monitoring of your pregnant dog's progress!
        </p>
      </CardContent>
    </Card>
  );
};

export default PregnancyMilestones;
