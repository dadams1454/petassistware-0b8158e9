
import React, { useState } from 'react';
import { useDailyCare } from '@/contexts/dailyCare';
import PottyBreakManager from '@/components/dogs/components/care/potty/PottyBreakManager';
import PottyBreakReminderCard from '@/components/dogs/components/care/potty/PottyBreakReminderCard';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, FileText } from 'lucide-react';
import DogGroupManagement from '@/components/dogs/components/care/potty/DogGroupManagement';

interface PottyBreaksTabProps {
  onRefreshDogs: () => void;
}

const PottyBreaksTab: React.FC<PottyBreaksTabProps> = ({ onRefreshDogs }) => {
  const { dogStatuses, loading } = useDailyCare();
  const [activeTab, setActiveTab] = useState<string>('pottybreaks');
  
  // Handler for potty break reminder button
  const handlePottyBreakButtonClick = () => {
    // Open the potty break dialog or scroll to the potty break section
    const pottyBreakSection = document.getElementById('potty-break-manager');
    if (pottyBreakSection) {
      pottyBreakSection.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Reminder Card with Enhanced Observation Capabilities */}
      {dogStatuses && dogStatuses.length > 0 && (
        <PottyBreakReminderCard 
          dogs={dogStatuses}
          onLogPottyBreak={handlePottyBreakButtonClick}
        />
      )}
      
      {/* Tab navigation for potty breaks and groups */}
      <Tabs defaultValue="pottybreaks" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="pottybreaks">
            <FileText className="h-4 w-4 mr-2" />
            Potty Break Log
          </TabsTrigger>
          <TabsTrigger value="groups">
            <Users className="h-4 w-4 mr-2" />
            Dog Groups
          </TabsTrigger>
        </TabsList>
        
        {/* Potty Break Manager Tab */}
        <TabsContent value="pottybreaks">
          {dogStatuses && dogStatuses.length > 0 ? (
            <div id="potty-break-manager">
              <PottyBreakManager 
                dogs={dogStatuses}
                onRefresh={onRefreshDogs}
              />
            </div>
          ) : (
            <Card className="p-8 text-center">
              <CardContent>
                <p className="text-muted-foreground mb-4">No dogs found. Please refresh or add dogs to the system.</p>
                <Button onClick={onRefreshDogs}>Refresh Dogs</Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        {/* Dog Groups Management Tab */}
        <TabsContent value="groups">
          {dogStatuses && dogStatuses.length > 0 ? (
            <DogGroupManagement 
              dogs={dogStatuses}
              onGroupsUpdated={onRefreshDogs}
            />
          ) : (
            <Card className="p-8 text-center">
              <CardContent>
                <p className="text-muted-foreground mb-4">No dogs found. Please add dogs before creating groups.</p>
                <Button onClick={onRefreshDogs}>Refresh Dogs</Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PottyBreaksTab;
