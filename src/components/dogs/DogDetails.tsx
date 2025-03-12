
import React, { useState } from 'react';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import VaccinationsTab from './components/VaccinationsTab';
import PedigreeTab from './components/tabs/PedigreeTab';
import GalleryTab from './components/tabs/GalleryTab';
import DogHeader from './components/details/DogHeader';
import OverviewTab from './components/tabs/OverviewTab';
import DocumentationTab from './components/tabs/DocumentationTab';
import EditDogDialog from './components/details/EditDogDialog';
import { useDogEvents } from './hooks/useDogEvents';

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
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className={isFullPage ? "mt-8" : ""}>
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="vaccinations">Vaccinations</TabsTrigger>
          <TabsTrigger value="gallery">Gallery</TabsTrigger>
          <TabsTrigger value="pedigree">Pedigree</TabsTrigger>
          <TabsTrigger value="documentation">Documentation</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <OverviewTab 
            dog={dog} 
            events={events}
            onViewEvent={handleViewEvent}
            onAddAppointment={handleAddAppointment}
          />
        </TabsContent>
        
        <TabsContent value="vaccinations">
          <VaccinationsTab dogId={dog.id} />
        </TabsContent>

        <TabsContent value="gallery">
          <GalleryTab dogId={dog.id} mainPhotoUrl={dog.photo_url} />
        </TabsContent>
        
        <TabsContent value="pedigree">
          <PedigreeTab dogId={dog.id} currentDog={dog} />
        </TabsContent>
        
        <TabsContent value="documentation">
          <DocumentationTab dog={dog} />
        </TabsContent>
      </Tabs>

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
