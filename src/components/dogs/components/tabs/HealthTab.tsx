
import React from 'react';
import { Separator } from '@/components/ui/separator';

const HealthTab = () => {
  return (
    <div className="space-y-4 py-4">
      <div className="mt-2">
        <h3 className="text-lg font-medium mb-4">Vaccination Information</h3>
        <Separator className="mb-4" />
        
        <p className="text-sm text-muted-foreground mb-4">
          Add vaccination information after saving the dog profile. Multiple vaccinations can be added in the dog details view.
        </p>
      </div>
    </div>
  );
};

export default HealthTab;
