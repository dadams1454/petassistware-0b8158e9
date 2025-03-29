
import React, { useState } from 'react';
import { Separator } from '@/components/ui/separator';
import DogHeader from './components/details/DogHeader';
import EditDogDialog from './components/details/EditDogDialog';
import { useDogEvents } from './hooks/useDogEvents';
import DogDetailsTabs from './components/details/DogDetailsTabs';

interface DogDetailsProps {
  dog: any;
  isFullPage?: boolean;
}

const DogDetails: React.FC<DogDetailsProps> = ({ dog, isFullPage = false }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  // Use our custom hook to manage events
  const { 
    events, 
    upcomingEvents, 
    handleAddAppointment, 
    handleViewEvent, 
    handleViewFirstEvent 
  } = useDogEvents(dog);

  return (
    <div className="space-y-6">
      <DogHeader 
        dog={dog}
        upcomingEvents={upcomingEvents}
        onEdit={() => setIsEditDialogOpen(true)}
        onViewFirstEvent={handleViewFirstEvent}
        onAddAppointment={handleAddAppointment}
      />
      
      <Separator />
      
      <DogDetailsTabs
        dog={dog}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        events={events}
        onViewEvent={handleViewEvent}
        onAddAppointment={handleAddAppointment}
        isFullPage={isFullPage}
        onEdit={() => setIsEditDialogOpen(true)}
      />

      {/* Edit Dialog */}
      <EditDogDialog 
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        dog={dog}
      />
    </div>
  );
};

export default DogDetails;
