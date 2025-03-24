
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface HealthTabProps {
  dogId: string;
}

const HealthTab: React.FC<HealthTabProps> = ({ dogId }) => {
  return (
    <div className="space-y-6">
      <Alert variant="default" className="bg-muted">
        <AlertDescription>
          Track health records, vaccinations, and medical history.
        </AlertDescription>
      </Alert>
      
      <Card>
        <CardHeader>
          <CardTitle>Health Records</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Health records will be displayed here. You can add vaccinations, vet visits, and other health information.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default HealthTab;
