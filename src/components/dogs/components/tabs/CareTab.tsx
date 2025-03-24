
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { InfoIcon, PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Separator } from '@/components/ui/separator';

interface CareTabProps {
  dogId: string;
  dogName: string;
  isFullPage?: boolean;
}

const CareTab: React.FC<CareTabProps> = ({ dogId, dogName, isFullPage = false }) => {
  return (
    <div className="space-y-6">
      <Alert className="bg-primary/10 border-primary/20">
        <InfoIcon className="h-4 w-4 text-primary" />
        <AlertTitle>Daily care tracking</AlertTitle>
        <AlertDescription>
          Track feeding, medications, exercise, and other care activities for {dogName}.
        </AlertDescription>
      </Alert>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Quick Actions</CardTitle>
            <CardDescription>Record care activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-2">
              <Button variant="outline" className="justify-start" asChild>
                <Link to={`/care?dogId=${dogId}`}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Log Care Activity
                </Link>
              </Button>
              
              <Button variant="outline" className="justify-start" asChild>
                <Link to={`/potty-breaks?dogId=${dogId}`}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Record Potty Break
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Recent Care</CardTitle>
            <CardDescription>Latest care activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              No recent care activities found.
            </div>
            
            <Separator className="my-4" />
            
            <Button variant="link" className="p-0" asChild>
              <Link to={`/care?dogId=${dogId}`}>
                View all care activities
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
      
      {isFullPage && (
        <div className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Care Schedule</CardTitle>
              <CardDescription>Upcoming care activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                No scheduled care activities found.
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CareTab;
