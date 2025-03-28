
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DogLetOutTimetable from './DogLetOutTimetable';
import { Button } from '@/components/ui/button';
import { Calendar, ArrowLeft, ArrowRight, Clock } from 'lucide-react';
import { DogCareStatus } from '@/types/dailyCare';
import { format, addDays, subDays } from 'date-fns';

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

  // Handle date navigation
  const goToPreviousDay = () => {
    setCurrentDate(prev => subDays(prev, 1));
  };

  const goToNextDay = () => {
    setCurrentDate(prev => addDays(prev, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

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
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="icon" onClick={goToPreviousDay}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" onClick={goToToday}>
                Today
              </Button>
              <Button variant="outline" size="icon" onClick={goToNextDay}>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="text-lg font-medium">
              {format(currentDate, 'MMMM d, yyyy')}
            </div>
          </div>
          
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
