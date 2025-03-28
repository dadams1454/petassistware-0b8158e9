
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DogLetOutTimetable from './DogLetOutTimetable';
import { Calendar, Clock } from 'lucide-react';
import { DogCareStatus } from '@/types/dailyCare';

interface DogLetOutManagerProps {
  dogs: DogCareStatus[];
  onRefresh?: () => void;
}

const DogLetOutManager: React.FC<DogLetOutManagerProps> = ({ 
  dogs, 
  onRefresh 
}) => {
  const [activeTab, setActiveTab] = useState('timetable');
  const [currentDate, setCurrentDate] = useState(new Date());

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="timetable">
            <Clock className="h-4 w-4 mr-2" />
            Timetable View
          </TabsTrigger>
          <TabsTrigger value="calendar">
            <Calendar className="h-4 w-4 mr-2" />
            Calendar View
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="timetable" className="mt-4">
          <DogLetOutTimetable
            dogsData={dogs}
            date={currentDate}
            onRefresh={onRefresh}
          />
        </TabsContent>
        
        <TabsContent value="calendar" className="mt-4">
          <div className="flex items-center justify-center h-48 border rounded-md bg-muted/10">
            <p className="text-muted-foreground">Calendar view coming soon...</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DogLetOutManager;
