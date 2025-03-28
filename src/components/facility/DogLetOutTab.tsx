
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dog, Clock, Plus, RefreshCw } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DogLetOutTimetable from './dogletout/DogLetOutTimetable';
import DogGroupsPanel from './dogletout/DogGroupsPanel';
import { useDailyCare } from '@/contexts/dailyCare';

interface DogLetOutTabProps {
  onRefreshDogs?: () => void;
}

const DogLetOutTab: React.FC<DogLetOutTabProps> = ({ onRefreshDogs }) => {
  const { dogStatuses, loading } = useDailyCare();
  const [activeView, setActiveView] = useState<string>('timetable');
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  
  const handleRefresh = () => {
    if (onRefreshDogs) {
      onRefreshDogs();
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Dog Let Out Tracker</h2>
          <p className="text-muted-foreground">
            Schedule and track when dogs go outside
          </p>
        </div>
        
        <Button 
          onClick={handleRefresh} 
          variant="outline" 
          className="gap-2"
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>
      
      <Tabs value={activeView} onValueChange={setActiveView}>
        <TabsList>
          <TabsTrigger value="timetable">
            <Clock className="h-4 w-4 mr-2" />
            Timetable View
          </TabsTrigger>
          <TabsTrigger value="groups">
            <Dog className="h-4 w-4 mr-2" />
            Dog Groups
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="timetable" className="mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl flex items-center">
                <Clock className="mr-2 h-5 w-5" />
                Dog Let Out Timetable
              </CardTitle>
            </CardHeader>
            <CardContent>
              <DogLetOutTimetable 
                dogsData={dogStatuses || []} 
                date={currentDate} 
                onRefresh={handleRefresh}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="groups" className="mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl flex items-center">
                <Dog className="mr-2 h-5 w-5" />
                Dog Groups
              </CardTitle>
            </CardHeader>
            <CardContent>
              <DogGroupsPanel 
                dogsData={dogStatuses || []} 
                onGroupsUpdated={handleRefresh}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DogLetOutTab;
