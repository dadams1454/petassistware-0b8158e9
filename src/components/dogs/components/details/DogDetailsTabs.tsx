
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DogProfile } from '@/types/dog';

// Import tabs
import OverviewTab from '../tabs/OverviewTab';
import HealthTab from '../tabs/HealthTab';
import PedigreeTab from '../tabs/PedigreeTab';
import BreedingTab from '../tabs/BreedingTab';
import DocumentsTab from '../tabs/DocumentsTab';
import GalleryTab from '../tabs/GalleryTab';
import NotesTab from '../tabs/NotesTab';
import GeneticsTab from '../tabs/GeneticsTab';

export interface DogDetailsTabsProps {
  dog: DogProfile;
  events?: any[];
  onViewEvent?: (event: any) => void;
  onAddAppointment?: () => void;
  isFullPage?: boolean;
  onEdit?: () => void;
}

const DogDetailsTabs: React.FC<DogDetailsTabsProps> = ({
  dog,
  events = [],
  onViewEvent = () => {},
  onAddAppointment = () => {},
  isFullPage = false,
  onEdit
}) => {
  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="health">Health</TabsTrigger>
        <TabsTrigger value="pedigree">Pedigree</TabsTrigger>
        <TabsTrigger value="breeding">Breeding</TabsTrigger>
        <TabsTrigger value="genetics">Genetics</TabsTrigger>
        <TabsTrigger value="documents">Documents</TabsTrigger>
        <TabsTrigger value="gallery">Gallery</TabsTrigger>
        <TabsTrigger value="notes">Notes</TabsTrigger>
      </TabsList>

      <TabsContent value="overview">
        <OverviewTab 
          dog={dog} 
          events={events} 
          onViewEvent={onViewEvent} 
          onAddAppointment={onAddAppointment} 
        />
      </TabsContent>

      <TabsContent value="health">
        <HealthTab 
          dogId={dog.id} 
        />
      </TabsContent>

      <TabsContent value="pedigree">
        <PedigreeTab 
          dogId={dog.id}
          currentDog={dog}
        />
      </TabsContent>

      <TabsContent value="breeding">
        <BreedingTab 
          dog={dog}
          onEdit={onEdit}
        />
      </TabsContent>

      <TabsContent value="genetics">
        <GeneticsTab 
          dogId={dog.id} 
          dogName={dog.name} 
        />
      </TabsContent>

      <TabsContent value="documents">
        <DocumentsTab 
          dogId={dog.id} 
        />
      </TabsContent>

      <TabsContent value="gallery">
        <GalleryTab 
          dogId={dog.id} 
        />
      </TabsContent>

      <TabsContent value="notes">
        <NotesTab 
          dogId={dog.id}
        />
      </TabsContent>
    </Tabs>
  );
};

export default DogDetailsTabs;
