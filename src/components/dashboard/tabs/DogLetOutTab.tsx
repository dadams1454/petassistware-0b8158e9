
import React, { useState } from 'react';
import { useDailyCare } from '@/contexts/dailyCare';
import DogLetOutManager from '@/components/facility/dogletout/DogLetOutManager';
import DogLetOutReminderCard from '@/components/facility/dogletout/DogLetOutReminderCard';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, FileText } from 'lucide-react';
import DogGroupManagement from '@/components/facility/dogletout/DogGroupManagement';
import { DogCareStatus } from '@/types/dailyCare';

interface DogLetOutTabProps {
  onRefreshDogs: () => void;
  dogStatuses?: DogCareStatus[];
}

const DogLetOutTab: React.FC<DogLetOutTabProps> = ({ 
  onRefreshDogs,
  dogStatuses = []
}) => {
  const { dogStatuses: contextDogStatuses, loading } = useDailyCare();
  const [activeTab, setActiveTab] = useState<string>('dogletout');
  
  // Use provided dogStatuses if available, otherwise use context
  const effectiveDogStatuses = dogStatuses.length > 0 
    ? dogStatuses 
    : contextDogStatuses || [];
  
  // Handler for dog let out reminder button
  const handleDogLetOutButtonClick = () => {
    // Open the dog let out dialog or scroll to the dog let out section
    const dogLetOutSection = document.getElementById('dog-let-out-manager');
    if (dogLetOutSection) {
      dogLetOutSection.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  return (
    <div className="space-y-6 w-full max-w-full overflow-x-hidden">
      {/* Reminder Card with Enhanced Observation Capabilities */}
      {effectiveDogStatuses && effectiveDogStatuses.length > 0 && (
        <DogLetOutReminderCard 
          dogs={effectiveDogStatuses}
          onLogDogLetOut={handleDogLetOutButtonClick}
        />
      )}
      
      {/* Tab navigation for dog let out and groups */}
      <Tabs defaultValue="dogletout" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="overflow-x-auto pb-1">
          <TabsList className="w-auto min-w-[240px]">
            <TabsTrigger value="dogletout">
              <FileText className="h-4 w-4 mr-2" />
              Dog Let Out Log
            </TabsTrigger>
            <TabsTrigger value="groups">
              <Users className="h-4 w-4 mr-2" />
              Dog Groups
            </TabsTrigger>
          </TabsList>
        </div>
        
        {/* Dog Let Out Manager Tab */}
        <TabsContent value="dogletout" className="w-full">
          {effectiveDogStatuses && effectiveDogStatuses.length > 0 ? (
            <div id="dog-let-out-manager" className="w-full">
              <DogLetOutManager 
                dogs={effectiveDogStatuses}
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
        <TabsContent value="groups" className="w-full">
          {effectiveDogStatuses && effectiveDogStatuses.length > 0 ? (
            <DogGroupManagement 
              dogs={effectiveDogStatuses}
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

export default DogLetOutTab;
