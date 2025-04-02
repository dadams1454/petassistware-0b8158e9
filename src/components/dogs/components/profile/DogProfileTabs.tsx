
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import OverviewTab from '../tabs/OverviewTab';
import HealthTab from '../tabs/HealthTab';
import DocumentsTab from '../tabs/DocumentsTab';
import GeneticsTab from '../tabs/GeneticsTab';
import NotesTab from '../tabs/NotesTab';
import BreedingTab from '../tabs/BreedingTab';
import GalleryTab from '../tabs/GalleryTab';
import OwnershipTab from '../tabs/OwnershipTab';
import { UserWithAuth } from '@/types';

interface DogProfileTabsProps {
  currentDog: any;
  activeTab?: string;
  onTabChange?: (value: string) => void;
  currentUser?: UserWithAuth;
}

const DogProfileTabs: React.FC<DogProfileTabsProps> = ({
  currentDog,
  activeTab = 'overview',
  onTabChange,
  currentUser
}) => {
  const dogId = currentDog?.id || '';
  const dogName = currentDog?.name || 'Dog';
  
  const handleTabChange = (value: string) => {
    if (onTabChange) {
      onTabChange(value);
    }
    
    // Save last tab in localStorage
    if (dogId) {
      localStorage.setItem(`lastDogTab_${dogId}`, value);
    }
  };

  return (
    <Tabs defaultValue={activeTab} onValueChange={handleTabChange} className="w-full">
      <TabsList className="grid w-full grid-cols-4 md:grid-cols-8">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="health">Health</TabsTrigger>
        <TabsTrigger value="genetics">Genetics</TabsTrigger>
        <TabsTrigger value="breeding">Breeding</TabsTrigger>
        <TabsTrigger value="ownership">Ownership</TabsTrigger>
        <TabsTrigger value="gallery">Gallery</TabsTrigger>
        <TabsTrigger value="documents">Documents</TabsTrigger>
        <TabsTrigger value="notes">Notes</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="py-4">
        <OverviewTab currentDog={currentDog} />
      </TabsContent>

      <TabsContent value="health" className="py-4">
        <HealthTab currentDog={currentDog} />
      </TabsContent>

      <TabsContent value="genetics" className="py-4">
        <GeneticsTab dogId={currentDog?.id} dogName={currentDog?.name} />
      </TabsContent>

      <TabsContent value="breeding" className="py-4">
        <BreedingTab currentDog={currentDog} />
      </TabsContent>

      <TabsContent value="ownership" className="py-4">
        <OwnershipTab currentDog={currentDog} currentUser={currentUser} />
      </TabsContent>

      <TabsContent value="gallery" className="py-4">
        <GalleryTab dogId={currentDog?.id} />
      </TabsContent>

      <TabsContent value="documents" className="py-4">
        <DocumentsTab dogId={currentDog?.id} dogName={currentDog?.name} />
      </TabsContent>

      <TabsContent value="notes" className="py-4">
        <NotesTab dogId={currentDog?.id} />
      </TabsContent>
    </Tabs>
  );
};

export default DogProfileTabs;
