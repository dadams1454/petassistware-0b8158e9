
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DogProfile } from '@/types/dog';
import DogOverviewSection from './DogOverviewSection';
import DogHealthSection from '../DogHealthSection';
import ReproductiveCycleDashboard from '@/components/breeding/reproductive/ReproductiveCycleDashboard';
import { User } from '@supabase/supabase-js';
import DogCareSection from '../care/DogCareSection';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';

export interface DogProfileTabsProps {
  dog: DogProfile;
  activeTab: string;
  onTabChange: (tab: string) => void;
  currentUser: User | null;
}

export interface BreedingTabProps {
  dog: DogProfile;
  form?: any; // Form is now optional
}

const DogProfileTabs: React.FC<DogProfileTabsProps> = ({ dog, activeTab, onTabChange, currentUser }) => {
  // Save the tab to localStorage
  useEffect(() => {
    localStorage.setItem(`lastDogTab_${dog.id}`, activeTab);
  }, [activeTab, dog.id]);

  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="grid grid-cols-4 w-full">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="health">Health</TabsTrigger>
        {dog.gender === 'Female' && (
          <TabsTrigger value="breeding">Breeding</TabsTrigger>
        )}
        <TabsTrigger value="care">Care</TabsTrigger>
      </TabsList>
      
      <TabsContent value="overview" className="space-y-6 pt-4">
        <DogOverviewSection dog={dog} />
      </TabsContent>
      
      <TabsContent value="health" className="space-y-6 pt-4">
        <DogHealthSection dog={dog} />
      </TabsContent>
      
      {dog.gender === 'Female' && (
        <TabsContent value="breeding" className="space-y-6 pt-4">
          <ReproductiveCycleDashboard dogId={dog.id} dogName={dog.name} />
        </TabsContent>
      )}

      <TabsContent value="care" className="space-y-6 pt-4">
        <DogCareSection dogId={dog.id} />
      </TabsContent>
    </Tabs>
  );
};

export default DogProfileTabs;
