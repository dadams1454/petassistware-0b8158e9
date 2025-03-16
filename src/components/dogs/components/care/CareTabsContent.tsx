
import React, { memo, useEffect } from 'react';
import { TabsContent } from '@/components/ui/tabs';
import CareCardsView from './CareCardsView';
import DogCareTable from './DogCareTable';
import { DogCareStatus } from '@/types/dailyCare';

interface CareTabsContentProps {
  activeTab: string;
  dogsStatus: DogCareStatus[];
  onLogCare: (dogId: string) => void;
  selectedDogId: string | null;
  dialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
  onCareLogSuccess: () => void;
  selectedCategory: string;
}

// Memoize the component to prevent unnecessary re-renders
const CareTabsContent: React.FC<CareTabsContentProps> = memo(({
  activeTab,
  dogsStatus,
  onLogCare,
  selectedDogId,
  dialogOpen,
  setDialogOpen,
  onCareLogSuccess,
  selectedCategory,
}) => {
  // Add effects to debug rendering issues
  useEffect(() => {
    console.log(`🔍 CareTabsContent render - activeTab: ${activeTab}, dogsStatus: ${dogsStatus.length}, selectedCategory: ${selectedCategory}`);
    
    if (dogsStatus.length > 0) {
      console.log('🐕 First dog from CareTabsContent:', dogsStatus[0].dog_name);
    } else {
      console.warn('⚠️ No dogs available in CareTabsContent');
    }
  }, [activeTab, dogsStatus, selectedCategory]);

  return (
    <>
      <TabsContent value="cards" className="mt-4">
        <div className="p-2 mb-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded">
          <p>🎴 Showing {dogsStatus.length} dogs in card view</p>
        </div>
        <CareCardsView
          dogsStatus={dogsStatus}
          onLogCare={onLogCare}
          selectedDogId={selectedDogId}
          dialogOpen={dialogOpen}
          setDialogOpen={setDialogOpen}
          onCareLogSuccess={onCareLogSuccess}
          selectedCategory={selectedCategory}
        />
      </TabsContent>

      <TabsContent value="table" className="mt-4">
        <div className="p-2 mb-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded">
          <p>📋 Showing {dogsStatus.length} dogs in table view</p>
        </div>
        <DogCareTable
          dogsStatus={dogsStatus}
          onLogCare={onLogCare}
          selectedDogId={selectedDogId}
          dialogOpen={dialogOpen}
          setDialogOpen={setDialogOpen}
          onCareLogSuccess={onCareLogSuccess}
          selectedCategory={selectedCategory}
        />
      </TabsContent>
    </>
  );
});

// Add display name for debugging purposes
CareTabsContent.displayName = 'CareTabsContent';

export default CareTabsContent;
