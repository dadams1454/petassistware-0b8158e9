
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { InfoCircle } from 'lucide-react';

export interface PedigreeTabProps {
  dogId: string;
  currentDog: any;
}

const PedigreeTab: React.FC<PedigreeTabProps> = ({ dogId, currentDog }) => {
  return (
    <div className="space-y-6">
      <Alert variant="default" className="bg-muted">
        <AlertDescription>
          View and manage pedigree information for this dog.
        </AlertDescription>
      </Alert>
      
      <Card>
        <CardHeader>
          <CardTitle>Pedigree Chart</CardTitle>
          <CardDescription>Visual representation of ancestry</CardDescription>
        </CardHeader>
        <CardContent className="min-h-[300px] flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <InfoCircle className="h-12 w-12 mx-auto mb-2" />
            <p>Pedigree visualization coming soon.</p>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Sire Information</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">No sire information available.</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Dam Information</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">No dam information available.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PedigreeTab;
