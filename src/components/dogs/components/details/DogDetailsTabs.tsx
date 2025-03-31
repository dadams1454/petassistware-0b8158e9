
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { DogProfile } from '@/types/dog';
import { ArrowRight, Calendar, Heart, Baby, Stethoscope, ActivitySquare, Dumbbell } from 'lucide-react';
import DailyCareLogs from '../../components/care/DailyCareLogs';
import DogHealthSection from '../../DogHealthSection';
import BreedingDashboard from '../breeding/BreedingDashboard';
import ExerciseTab from '../tabs/ExerciseTab';

interface DogDetailsTabsProps {
  dog: DogProfile;
  events: any[];
  onViewEvent: (eventId: string) => void;
  onAddAppointment: () => void;
  isFullPage?: boolean;
  onEdit: () => void;
}

const DogDetailsTabs: React.FC<DogDetailsTabsProps> = ({ 
  dog, 
  events, 
  onViewEvent, 
  onAddAppointment,
  isFullPage = false,
  onEdit
}) => {
  return (
    <Tabs defaultValue="health" className="w-full">
      <TabsList className="grid grid-cols-5 mb-8">
        <TabsTrigger value="health">
          <Stethoscope className="h-4 w-4 mr-2" />
          Health
        </TabsTrigger>
        <TabsTrigger value="care">
          <ActivitySquare className="h-4 w-4 mr-2" />
          Daily Care
        </TabsTrigger>
        <TabsTrigger value="exercise">
          <Dumbbell className="h-4 w-4 mr-2" />
          Exercise
        </TabsTrigger>
        <TabsTrigger value="breeding">
          <Heart className="h-4 w-4 mr-2" />
          Breeding
        </TabsTrigger>
        <TabsTrigger value="calendar">
          <Calendar className="h-4 w-4 mr-2" />
          Calendar
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="health" className="space-y-6">
        <DogHealthSection dog={dog} />
      </TabsContent>
      
      <TabsContent value="care">
        <DailyCareLogs dogId={dog.id} />
      </TabsContent>
      
      <TabsContent value="exercise">
        <ExerciseTab dog={dog} />
      </TabsContent>
      
      <TabsContent value="breeding">
        <BreedingDashboard dog={dog} />
      </TabsContent>
      
      <TabsContent value="calendar">
        <CalendarTab 
          events={events} 
          onAddAppointment={onAddAppointment} 
          onViewEvent={onViewEvent}
        />
      </TabsContent>
    </Tabs>
  );
};

const CalendarTab: React.FC<{ 
  events: any[]; 
  onAddAppointment: () => void; 
  onViewEvent: (eventId: string) => void;
}> = ({ events, onAddAppointment, onViewEvent }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Calendar & Events</h2>
        
        <button 
          onClick={onAddAppointment}
          className="text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center"
        >
          Add Appointment
          <ArrowRight className="ml-1 h-4 w-4" />
        </button>
      </div>
      
      {events.length > 0 ? (
        <div className="grid gap-4">
          {events.map((event) => (
            <div 
              key={event.id} 
              className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
              onClick={() => onViewEvent(event.id)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{event.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {new Date(event.event_date).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    event.status === 'completed' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                      : event.status === 'cancelled'
                        ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                        : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                  }`}>
                    {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                  </span>
                </div>
              </div>
              {event.description && (
                <p className="text-sm mt-2 line-clamp-2">{event.description}</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border border-dashed rounded-lg">
          <Calendar className="h-12 w-12 mx-auto text-gray-300 dark:text-gray-600" />
          <h3 className="mt-4 text-lg font-medium">No Events</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            No upcoming events for this dog.
          </p>
          <button
            onClick={onAddAppointment}
            className="mt-4 inline-flex items-center justify-center rounded-md text-sm font-medium h-9 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Add Your First Event
          </button>
        </div>
      )}
    </div>
  );
};

export default DogDetailsTabs;
