
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import VaccinationsTab from '../VaccinationsTab';
import PedigreeTab from '../tabs/PedigreeTab';
import GalleryTab from '../tabs/GalleryTab';
import OverviewTab from '../tabs/OverviewTab';
import DocumentationTab from '../tabs/DocumentationTab';

interface DogDetailsTabsProps {
  dog: any;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  events: any[];
  onViewEvent: (eventId: string) => void;
  onAddAppointment: () => void;
  isFullPage?: boolean;
}

const DogDetailsTabs: React.FC<DogDetailsTabsProps> = ({
  dog,
  activeTab,
  setActiveTab,
  events,
  onViewEvent,
  onAddAppointment,
  isFullPage = false
}) => {
  return (
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
          onViewEvent={onViewEvent}
          onAddAppointment={onAddAppointment}
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
  );
};

export default DogDetailsTabs;
