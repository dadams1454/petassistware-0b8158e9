
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import OverviewTab from '../tabs/OverviewTab';
import HealthTab from '../tabs/HealthTab';
import DocumentsTab from '../tabs/DocumentsTab';
import GeneticsTab from '../tabs/GeneticsTab';
import NotesTab from '../tabs/NotesTab';
import BreedingTab from '../tabs/BreedingTab';
import GalleryTab from '../tabs/GalleryTab';
import DailyCareTab from '../tabs/DailyCareTab';
import { DogProfile } from '@/types/dog';

// Define custom UserWithAuth type here instead of importing from @/types
interface UserWithAuth {
  id: string;
  email?: string;
  role?: string;
}

// Update all tab props to include currentDog
export interface OverviewTabProps {
  currentDog: DogProfile;
}

export interface HealthTabProps {
  currentDog: DogProfile;
}

export interface BreedingTabProps {
  currentDog: DogProfile;
}

interface DogProfileTabsProps {
  currentDog: DogProfile;
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
        <TabsTrigger value="care">Daily Care</TabsTrigger>
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

      <TabsContent value="care" className="py-4">
        <DailyCareTab dogId={currentDog?.id} dogName={currentDog?.name} />
      </TabsContent>

      <TabsContent value="gallery" className="py-4">
        <GalleryTab dogId={currentDog?.id} />
      </TabsContent>

      <TabsContent value="documents" className="py-4">
        <DocumentsTab dogId={currentDog?.id} />
      </TabsContent>

      <TabsContent value="notes" className="py-4">
        <NotesTab dogId={currentDog?.id} />
      </TabsContent>
    </Tabs>
  );
};

export default DogProfileTabs;
