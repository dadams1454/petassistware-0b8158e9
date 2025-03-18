
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDailyCare } from '@/contexts/dailyCare';
import PottyBreakManager from '@/components/dogs/components/care/potty/PottyBreakManager';
import PottyBreakReminderCard from '@/components/dogs/components/care/potty/PottyBreakReminderCard';
import DogTimeTable from '@/components/dogs/components/care/table/DogTimeTable';
import { Button } from '@/components/ui/button';

interface DailyCareTabProps {
  onRefreshDogs: () => void;
  isRefreshing: boolean;
}

const DailyCareTab: React.FC<DailyCareTabProps> = ({ onRefreshDogs, isRefreshing }) => {
  const { dogStatuses } = useDailyCare();
  const [activeSubTab, setActiveSubTab] = useState('pottybreaks');
  
  // Handler for potty break reminder button
  const handlePottyBreakButtonClick = () => {
    // Open the potty break dialog or scroll to the potty break section
    setActiveSubTab('pottybreaks');
    const pottyBreakSection = document.getElementById('potty-break-manager');
    if (pottyBreakSection) {
      pottyBreakSection.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  if (!dogStatuses || dogStatuses.length === 0) {
    return (
      <Card className="p-8 text-center">
        <CardContent>
          <p className="text-muted-foreground mb-4">No dogs found. Please refresh or add dogs to the system.</p>
          <Button onClick={onRefreshDogs}>Refresh Dogs</Button>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Reminder Card */}
      <PottyBreakReminderCard 
        dogs={dogStatuses}
        onLogPottyBreak={handlePottyBreakButtonClick}
      />
      
      {/* Sub-tabs for the different daily care functions */}
      <Tabs value={activeSubTab} onValueChange={setActiveSubTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="pottybreaks">Potty Breaks</TabsTrigger>
          <TabsTrigger value="timetable">Time Table</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pottybreaks">
          <div id="potty-break-manager">
            <PottyBreakManager 
              dogs={dogStatuses}
              onRefresh={onRefreshDogs}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="timetable">
          <DogTimeTable 
            dogsStatus={dogStatuses} 
            onRefresh={onRefreshDogs} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DailyCareTab;
