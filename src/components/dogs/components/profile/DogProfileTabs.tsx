
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dog } from 'lucide-react';
import DogBasicInfo from './DogBasicInfo';
import DogHealthRecords from './DogHealthRecords';
import DogBreedingInfo from './DogBreedingInfo';
import DogDocuments from './DogDocuments';
import GeneticAnalysisTab from '../tabs/GeneticAnalysisTab';
import MedicalExpenses from '@/components/finances/MedicalExpenses';

interface DogProfileTabsProps {
  dog: any;
}

const DogProfileTabs: React.FC<DogProfileTabsProps> = ({ dog }) => {
  const [activeTab, setActiveTab] = useState('overview');
  
  return (
    <Tabs 
      value={activeTab} 
      onValueChange={setActiveTab}
      className="mt-6"
    >
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="health">Health</TabsTrigger>
        <TabsTrigger value="genetics">Genetics</TabsTrigger>
        <TabsTrigger value="breeding">Breeding</TabsTrigger>
        <TabsTrigger value="documents">Documents</TabsTrigger>
      </TabsList>
      
      <TabsContent value="overview" className="mt-6">
        <DogBasicInfo dog={dog} />
      </TabsContent>
      
      <TabsContent value="health" className="mt-6 space-y-8">
        <DogHealthRecords dogId={dog.id} />
        
        <div className="pt-4">
          <MedicalExpenses dogId={dog.id} />
        </div>
      </TabsContent>
      
      <TabsContent value="genetics" className="mt-6">
        <GeneticAnalysisTab dogId={dog.id} currentDog={dog} />
      </TabsContent>
      
      <TabsContent value="breeding" className="mt-6">
        <DogBreedingInfo dog={dog} />
      </TabsContent>
      
      <TabsContent value="documents" className="mt-6">
        <DogDocuments dogId={dog.id} />
      </TabsContent>
    </Tabs>
  );
};

export default DogProfileTabs;
