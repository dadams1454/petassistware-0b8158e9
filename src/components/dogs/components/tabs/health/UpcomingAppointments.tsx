
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

const UpcomingAppointments: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Appointments</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center py-6 text-center text-muted-foreground">
          <AlertCircle className="mb-2 h-8 w-8" />
          <p>No upcoming appointments</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default UpcomingAppointments;
