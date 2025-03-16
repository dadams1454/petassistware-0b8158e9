
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DogTimeTable from '@/components/dogs/components/care/table/DogTimeTable';
import ExerciseLog from '@/components/dogs/components/care/exercise/ExerciseLog';
import { useDailyCare } from '@/contexts/dailyCare';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { format, parseISO } from 'date-fns';
import { Dog, Calendar } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface DailyCareTabProps {
  onRefreshDogs: () => void;
  isRefreshing: boolean;
}

const DailyCareTab: React.FC<DailyCareTabProps> = ({ onRefreshDogs, isRefreshing }) => {
  const [careView, setCareView] = useState('timetable'); // Default to timetable view
  const { dogStatuses } = useDailyCare();
  
  // Filter dogs that have received care today
  const dogsWithCareToday = dogStatuses?.filter(dog => dog.last_care !== null) || [];

  return (
    <>
      <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded-md mb-4">
        <p className="text-sm text-green-600 dark:text-green-400">
          🐕 Daily Care Dashboard - {dogStatuses?.length || 0} dogs available
        </p>
      </div>
      
      {/* Care View Tabs */}
      <Tabs value={careView} onValueChange={setCareView} className="mb-4">
        <TabsList>
          <TabsTrigger value="timetable">Time Table</TabsTrigger>
          <TabsTrigger value="history">Care History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="timetable" className="mt-4">
          {dogStatuses && dogStatuses.length > 0 ? (
            <DogTimeTable 
              dogsStatus={dogStatuses} 
              onRefresh={onRefreshDogs} 
            />
          ) : (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">No dogs found. Please refresh or add dogs to the system.</p>
              <Button onClick={onRefreshDogs} className="mt-4">Refresh Dogs</Button>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Care History</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Recent care logs will appear here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
};

export default DailyCareTab;
