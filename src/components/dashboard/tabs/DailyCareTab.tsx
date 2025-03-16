
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CareDashboard from '@/components/dogs/components/care/CareDashboard';
import DogTimeTable from '@/components/dogs/components/care/table/DogTimeTable';
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
          <TabsTrigger value="dashboard">Care Dashboard</TabsTrigger>
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
        
        <TabsContent value="dashboard">
          {/* Recent Care History Card */}
          {dogsWithCareToday.length > 0 && (
            <Card className="mb-4">
              <CardHeader className="pb-2">
                <CardTitle className="text-md flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  Dogs Cared For Today ({dogsWithCareToday.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {dogsWithCareToday.map(dog => (
                    <div key={dog.dog_id} className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-800 rounded-md">
                      <div className="flex items-center">
                        {dog.dog_photo ? (
                          <img src={dog.dog_photo} alt={dog.dog_name} className="h-8 w-8 rounded-full mr-2 object-cover" />
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-2">
                            <Dog className="h-4 w-4 text-primary" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium">{dog.dog_name}</p>
                          <p className="text-xs text-muted-foreground">{dog.last_care?.category}: {dog.last_care?.task_name}</p>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {dog.last_care && format(parseISO(dog.last_care.timestamp), 'h:mm a')}
                      </div>
                    </div>
                  ))}
                </div>
                
                {dogsWithCareToday.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-2">
                    No dogs have been recorded for care today.
                  </p>
                )}
              </CardContent>
            </Card>
          )}
          
          <CareDashboard />
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
