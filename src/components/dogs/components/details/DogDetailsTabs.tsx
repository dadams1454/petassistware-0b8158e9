
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import OverviewTab from '../tabs/OverviewTab';
import HealthTab from '../tabs/HealthTab';
import NotesTab from '../tabs/NotesTab';
import GalleryTab from '../tabs/GalleryTab';
import CareTsbs from '../tabs/CareTab';
import DocumentsTab from '../tabs/DocumentsTab';
import PedigreeTab from '../tabs/PedigreeTab';

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
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="mb-4 flex overflow-x-auto">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="health">Health</TabsTrigger>
        <TabsTrigger value="notes">Notes</TabsTrigger>
        <TabsTrigger value="gallery">Gallery</TabsTrigger>
        <TabsTrigger value="care">Care</TabsTrigger>
        <TabsTrigger value="documents">Documents</TabsTrigger>
        {dog.pedigree && <TabsTrigger value="pedigree">Pedigree</TabsTrigger>}
      </TabsList>
      
      <TabsContent value="overview" className="space-y-4">
        <OverviewTab 
          dog={dog} 
          events={events}
          onViewEvent={onViewEvent}
          onAddAppointment={onAddAppointment}
        />
      </TabsContent>
      
      <TabsContent value="health" className="space-y-4">
        <HealthTab dogId={dog.id} />
      </TabsContent>
      
      <TabsContent value="notes" className="space-y-4">
        <NotesTab dogId={dog.id} initialNotes={dog.notes} />
      </TabsContent>
      
      <TabsContent value="gallery" className="space-y-4">
        <GalleryTab dogId={dog.id} mainPhotoUrl={dog.photo_url} />
      </TabsContent>
      
      <TabsContent value="care" className="space-y-4">
        <CareTsbs dogId={dog.id} dogName={dog.name} isFullPage={isFullPage} />
      </TabsContent>
      
      <TabsContent value="documents" className="space-y-4">
        <DocumentsTab dogId={dog.id} />
      </TabsContent>
      
      {dog.pedigree && (
        <TabsContent value="pedigree" className="space-y-4">
          <PedigreeTab dogId={dog.id} />
        </TabsContent>
      )}
    </Tabs>
  );
};

export default DogDetailsTabs;
