
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import DogHealthSection from '../../DogHealthSection';
import UpcomingEvents from '../details/UpcomingEvents';
import { OverviewTabProps } from '../profile/DogProfileTabs';

const OverviewTab: React.FC<OverviewTabProps> = ({
  dog
}) => {
  // Placeholder for events until we implement fetching them
  const events = [];
  const onViewEvent = (event: any) => console.log('View event', event);
  const onAddAppointment = () => console.log('Add appointment');

  return (
    <>
      <Card>
        <CardHeader className="py-4">
          <CardTitle className="text-base">Health {dog.gender === 'Female' ? '& Breeding' : ''}</CardTitle>
        </CardHeader>
        <CardContent className="py-0">
          <DogHealthSection dog={dog} />
        </CardContent>
      </Card>
      
      {events && events.length > 0 && (
        <UpcomingEvents 
          events={events}
          onViewEvent={onViewEvent}
          onAddAppointment={onAddAppointment}
        />
      )}
      
      {dog.notes && (
        <div className="mt-4">
          <h3 className="text-lg font-medium mb-2">Notes</h3>
          <p className="text-muted-foreground whitespace-pre-line">{dog.notes}</p>
        </div>
      )}
    </>
  );
};

export default OverviewTab;
