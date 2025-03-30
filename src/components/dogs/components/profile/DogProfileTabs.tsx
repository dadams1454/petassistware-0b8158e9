
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DogProfile } from '@/types/dog';
import DogProfileDetails from '@/components/dogs/components/profile/DogProfileDetails';
import DogHealthRecords from '@/components/dogs/components/profile/DogHealthRecords';
import DogCareHistory from '@/components/dogs/components/profile/DogCareHistory';
import GeneticsTab from '@/components/dogs/components/tabs/GeneticsTab';
import PedigreeTab from '@/components/dogs/components/tabs/PedigreeTab';

interface DogProfileTabsProps {
  dog: DogProfile;
}

const DogProfileTabs: React.FC<DogProfileTabsProps> = ({ dog }) => {
  return (
    <Tabs defaultValue="details" className="mt-6">
      <TabsList>
        <TabsTrigger value="details">Details</TabsTrigger>
        <TabsTrigger value="health">Health Records</TabsTrigger>
        <TabsTrigger value="care">Care History</TabsTrigger>
        <TabsTrigger value="pedigree">Pedigree</TabsTrigger>
        <TabsTrigger value="genetics">Genetics</TabsTrigger>
      </TabsList>
      
      <TabsContent value="details" className="mt-4">
        <DogProfileDetails dog={dog} />
      </TabsContent>
      
      <TabsContent value="health" className="mt-4">
        <DogHealthRecords dogId={dog.id} />
      </TabsContent>
      
      <TabsContent value="care" className="mt-4">
        <DogCareHistory dogId={dog.id} />
      </TabsContent>

      <TabsContent value="pedigree" className="mt-4">
        <PedigreeTab dogId={dog.id} currentDog={dog} />
      </TabsContent>
      
      <TabsContent value="genetics" className="mt-4">
        <GeneticsTab dogId={dog.id} dogName={dog.name} />
      </TabsContent>
    </Tabs>
  );
};

export default DogProfileTabs;
