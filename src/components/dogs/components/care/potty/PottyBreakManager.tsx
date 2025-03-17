
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Check } from 'lucide-react';
import { DialogContent, DialogHeader, DialogTitle, Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { DogCareStatus } from '@/types/dailyCare';
import PottyBreakDogSelection from './PottyBreakDogSelection';
import { usePottyBreakManager } from './hooks/usePottyBreakManager';
import QuickPottyBreakTab from './tabs/QuickPottyBreakTab';
import GroupPottyBreakTab from './tabs/GroupPottyBreakTab';
import PottyBreakHistoryTab from './tabs/PottyBreakHistoryTab';

interface PottyBreakManagerProps {
  dogs: DogCareStatus[];
  onRefresh: () => void;
}

const PottyBreakManager: React.FC<PottyBreakManagerProps> = ({ dogs, onRefresh }) => {
  const {
    activeTab,
    setActiveTab,
    dialogOpen,
    setDialogOpen,
    selectedDogs,
    setSelectedDogs,
    recentSessions,
    isLoading,
    refreshTrigger,
    setRefreshTrigger,
    handleQuickPottyBreak,
    handleGroupPottyBreak,
    getTimeSinceLastPottyBreak,
    sortedDogs
  } = usePottyBreakManager(dogs, onRefresh);

  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-xl">
          <Users className="h-5 w-5 mr-2" />
          Dog Potty Break Manager
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="quick">Quick Potty Break</TabsTrigger>
            <TabsTrigger value="group">Group Potty Break</TabsTrigger>
            <TabsTrigger value="history">Recent History</TabsTrigger>
          </TabsList>

          <TabsContent value="quick" className="p-2">
            <QuickPottyBreakTab 
              dogs={sortedDogs}
              getTimeSinceLastPottyBreak={getTimeSinceLastPottyBreak}
              handleQuickPottyBreak={handleQuickPottyBreak}
              isLoading={isLoading}
            />
          </TabsContent>

          <TabsContent value="group">
            <GroupPottyBreakTab 
              dogs={dogs}
              onOpenDialog={() => setDialogOpen(true)}
              onGroupSelected={(dogIds) => {
                setSelectedDogs(dogIds);
                setDialogOpen(true);
              }}
            />
          </TabsContent>

          <TabsContent value="history">
            <PottyBreakHistoryTab 
              sessions={recentSessions}
              isLoading={isLoading}
              onRefresh={() => setRefreshTrigger(prev => prev + 1)}
            />
          </TabsContent>
        </Tabs>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Select dogs for potty break</DialogTitle>
            </DialogHeader>
            
            <PottyBreakDogSelection
              dogs={dogs}
              selectedDogs={selectedDogs}
              onChange={setSelectedDogs}
            />
            
            <div className="flex justify-end gap-2 mt-4">
              <Button
                variant="outline"
                onClick={() => setDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleGroupPottyBreak}
                disabled={selectedDogs.length === 0 || isLoading}
                className="gap-2"
              >
                <Check className="h-4 w-4" />
                {isLoading ? 'Logging...' : 'Log Potty Break'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default PottyBreakManager;
