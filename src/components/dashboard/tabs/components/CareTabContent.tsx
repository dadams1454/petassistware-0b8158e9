
import React from 'react';
import { DogCareStatus } from '@/types/dailyCare';
import FeedingTab from '@/components/dashboard/tabs/FeedingTab';
import DogLetOutTab from '@/components/dashboard/tabs/DogLetOutTab';
import MedicationsTab from '@/components/dashboard/tabs/MedicationsTab';
import GroomingTab from '@/components/dashboard/tabs/GroomingTab';
import NotesTab from '@/components/dashboard/tabs/NotesTab';
import FacilityTab from '@/components/dashboard/tabs/FacilityTab';
import PuppiesTab from '@/components/dogs/components/care/puppies/PuppiesTab';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CareTabContentProps {
  category: string;
  dogStatuses: DogCareStatus[];
  onRefresh: () => void;
}

const CareTabContent: React.FC<CareTabContentProps> = ({ 
  category, 
  dogStatuses, 
  onRefresh 
}) => {
  switch (category) {
    case 'dogletout':
      return (
        <DogLetOutTab 
          onRefreshDogs={onRefresh}
          dogStatuses={dogStatuses}
        />
      );
    case 'feeding':
      return (
        <FeedingTab 
          dogStatuses={dogStatuses} 
          onRefreshDogs={onRefresh}
        />
      );
    case 'medication':
      return (
        <MedicationsTab 
          dogStatuses={dogStatuses} 
          onRefreshDogs={onRefresh}
        />
      );
    case 'grooming':
      return (
        <GroomingTab 
          dogStatuses={dogStatuses} 
          onRefreshDogs={onRefresh}
        />
      );
    case 'notes':
      return (
        <NotesTab
          dogStatuses={dogStatuses}
          onRefreshDogs={onRefresh}
        />
      );
    case 'facility':
      return (
        <FacilityTab
          onRefreshData={onRefresh}
          dogStatuses={dogStatuses}
        />
      );
    case 'puppies':
      return (
        <PuppiesTab onRefresh={onRefresh} />
      );
    default:
      return (
        <Card>
          <CardHeader>
            <CardTitle>Coming Soon</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              This feature is coming soon! Check back for updates.
            </p>
          </CardContent>
        </Card>
      );
  }
};

export default CareTabContent;
