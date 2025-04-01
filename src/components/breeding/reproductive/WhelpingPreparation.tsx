
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

interface WhelpingPreparationProps {
  dog: any;
}

const WhelpingPreparation: React.FC<WhelpingPreparationProps> = ({ dog }) => {
  const isPregnant = dog.breeding_status === 'pregnant';

  if (!isPregnant) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Not Currently Pregnant</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Whelping preparation features will be available when this dog's status is updated to pregnant.
          </p>
        </CardContent>
      </Card>
    );
  }

  // In a real implementation, we would have checklists and preparation guidelines
  // For now, we'll just display a placeholder

  return (
    <Card>
      <CardHeader>
        <CardTitle>Whelping Preparation Checklist</CardTitle>
      </CardHeader>
      <CardContent className="py-6 text-center">
        <p className="text-muted-foreground mb-4">
          Whelping preparation checklist feature is currently under development. 
          Check back soon for detailed guidance on preparing for your dog's whelping!
        </p>
      </CardContent>
    </Card>
  );
};

export default WhelpingPreparation;
