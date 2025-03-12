
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import DogHealthSection from '../../DogHealthSection';
import UpcomingEvents from '../details/UpcomingEvents';

interface OverviewTabProps {
  dog: any;
  events: any[];
  onViewEvent: (event: any) => void;
  onAddAppointment: () => void;
}

const OverviewTab: React.FC<OverviewTabProps> = ({
  dog,
  events,
  onViewEvent,
  onAddAppointment
}) => {
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
