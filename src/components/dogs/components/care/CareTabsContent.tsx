
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import CareCardsView from './CareCardsView';
import DogCareTable from './DogCareTable';

interface CareTabsContentProps {
  activeTab: string;
  dogsStatus: DogCareStatus[];
  onLogCare: (dogId: string) => void;
  selectedDogId: string | null;
  dialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
  onCareLogSuccess: () => void;
}

const CareTabsContent: React.FC<CareTabsContentProps> = ({
  activeTab,
  dogsStatus,
  onLogCare,
  selectedDogId,
  dialogOpen,
  setDialogOpen,
  onCareLogSuccess,
}) => {
  return (
    <>
      <TabsContent value="cards" className="mt-4">
        <CareCardsView
          dogsStatus={dogsStatus}
          onLogCare={onLogCare}
          selectedDogId={selectedDogId}
          dialogOpen={dialogOpen}
          setDialogOpen={setDialogOpen}
          onCareLogSuccess={onCareLogSuccess}
        />
      </TabsContent>

      <TabsContent value="table" className="mt-4">
        <DogCareTable
          dogsStatus={dogsStatus}
          onLogCare={onLogCare}
          selectedDogId={selectedDogId}
          dialogOpen={dialogOpen}
          setDialogOpen={setDialogOpen}
          onCareLogSuccess={onCareLogSuccess}
        />
      </TabsContent>
    </>
  );
};

export default CareTabsContent;
