
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DogProfile } from '@/types/dog';
import OverviewTab from '../tabs/OverviewTab';
import HealthTab from '../tabs/HealthTab';
import BreedingTab from '../tabs/BreedingTab';
import GalleryTab from '../tabs/GalleryTab';
import DocumentsTab from '../tabs/DocumentsTab';
import NotesTab from '../tabs/NotesTab';
import PedigreeTab from '../tabs/PedigreeTab';
import GeneticsTab from '../tabs/GeneticsTab';
import CareTab from '../tabs/CareTab';
import DailyCareTab from '../tabs/DailyCareTab';
import ExerciseTab from '../tabs/ExerciseTab';

interface DogProfileTabsProps {
  dog: DogProfile;
  activeTab?: string;
  onTabChange?: (value: string) => void;
}

export interface OverviewTabProps {
  currentDog: DogProfile;
}

export interface HealthTabProps {
  currentDog: DogProfile;
}

export interface CareTabProps {
  dog: DogProfile;
}

export interface BreedingTabProps {
  currentDog: DogProfile;
}

export interface GalleryTabProps {
  dog: DogProfile;
}

export interface DocumentsTabProps {
  dog: DogProfile;
}

export interface NotesTabProps {
  dog: DogProfile;
}

export interface PedigreeTabProps {
  dog: DogProfile;
}

export interface GeneticsTabProps {
  dog: DogProfile;
}

export interface DailyCareTabProps {
  dog: DogProfile;
}

export interface ExerciseTabProps {
  dog: DogProfile;
}

const DogProfileTabs: React.FC<DogProfileTabsProps> = ({
  dog,
  activeTab = 'overview',
  onTabChange
}) => {
  const [value, setValue] = useState(activeTab);

  const handleValueChange = (newValue: string) => {
    setValue(newValue);
    if (onTabChange) {
      onTabChange(newValue);
    }
  };

  return (
    <Tabs value={value} onValueChange={handleValueChange} className="mt-6">
      <TabsList className="grid grid-cols-5 md:w-[600px]">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="health">Health</TabsTrigger>
        <TabsTrigger value="breeding">Breeding</TabsTrigger>
        <TabsTrigger value="care">Care</TabsTrigger>
        <TabsTrigger value="gallery">Gallery</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="mt-6">
        <OverviewTab currentDog={dog} />
      </TabsContent>

      <TabsContent value="health" className="mt-6">
        <HealthTab currentDog={dog} />
      </TabsContent>

      <TabsContent value="breeding" className="mt-6">
        <BreedingTab currentDog={dog} />
      </TabsContent>

      <TabsContent value="care" className="mt-6">
        <CareTab dog={dog} />
      </TabsContent>

      <TabsContent value="gallery" className="mt-6">
        <GalleryTab dog={dog} />
      </TabsContent>

      <TabsContent value="documents" className="mt-6">
        <DocumentsTab dog={dog} />
      </TabsContent>

      <TabsContent value="notes" className="mt-6">
        <NotesTab dog={dog} />
      </TabsContent>

      <TabsContent value="pedigree" className="mt-6">
        <PedigreeTab dog={dog} />
      </TabsContent>

      <TabsContent value="genetics" className="mt-6">
        <GeneticsTab dog={dog} />
      </TabsContent>

      <TabsContent value="daily-care" className="mt-6">
        <DailyCareTab dog={dog} />
      </TabsContent>

      <TabsContent value="exercise" className="mt-6">
        <ExerciseTab dog={dog} />
      </TabsContent>
    </Tabs>
  );
};

export default DogProfileTabs;
