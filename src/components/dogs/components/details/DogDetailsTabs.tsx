
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import OverviewTab from '../tabs/OverviewTab';
import HealthTab from '../tabs/HealthTab';
import GalleryTab from '../tabs/GalleryTab';
import NotesTab from '../tabs/NotesTab';
import PedigreeTab from '../tabs/PedigreeTab';
import BreedingTab from '../tabs/BreedingTab';
import GeneticsTab from '../tabs/GeneticsTab';
import { DogProfile } from '@/types/dog';

interface DogDetailsTabsProps {
  dog: DogProfile;
  onEdit?: () => void;
}

const DogDetailsTabs: React.FC<DogDetailsTabsProps> = ({ dog, onEdit }) => {
  return (
    <Tabs defaultValue="overview" className="mt-6">
      <TabsList className="mb-4 grid grid-cols-2 md:grid-cols-7 w-full">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="health">Health</TabsTrigger>
        <TabsTrigger value="pedigree">Pedigree</TabsTrigger>
        <TabsTrigger value="breeding">Breeding</TabsTrigger>
        <TabsTrigger value="genetics">Genetics</TabsTrigger>
        <TabsTrigger value="gallery">Gallery</TabsTrigger>
        <TabsTrigger value="notes">Notes</TabsTrigger>
      </TabsList>

      <TabsContent value="overview">
        <OverviewTab dog={dog} />
      </TabsContent>

      <TabsContent value="health">
        <HealthTab dogId={dog.id} dogName={dog.name} />
      </TabsContent>

      <TabsContent value="pedigree">
        <PedigreeTab dogId={dog.id} dogName={dog.name} />
      </TabsContent>

      <TabsContent value="breeding">
        <BreedingTab dog={dog} onEdit={onEdit} />
      </TabsContent>

      <TabsContent value="genetics">
        <GeneticsTab dogId={dog.id} dogName={dog.name} />
      </TabsContent>

      <TabsContent value="gallery">
        <GalleryTab dogId={dog.id} dogName={dog.name} />
      </TabsContent>

      <TabsContent value="notes">
        <NotesTab dogId={dog.id} notes={dog.notes} />
      </TabsContent>
    </Tabs>
  );
};

export default DogDetailsTabs;
