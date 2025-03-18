
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useDailyCare } from '@/contexts/dailyCare';
import PottyBreakReminderCard from '@/components/dogs/components/care/potty/PottyBreakReminderCard';
import DogTimeTable from '@/components/dogs/components/care/table/DogTimeTable';
import { Button } from '@/components/ui/button';

interface DailyCareTabProps {
  onRefreshDogs: () => void;
  isRefreshing: boolean;
}

const DailyCareTab: React.FC<DailyCareTabProps> = ({ onRefreshDogs, isRefreshing }) => {
  const { dogStatuses } = useDailyCare();
  
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
        onLogPottyBreak={() => {
          // Just scroll to the timetable on click
          const timeTableSection = document.getElementById('dog-time-table');
          if (timeTableSection) {
            timeTableSection.scrollIntoView({ behavior: 'smooth' });
          }
        }}
      />
      
      {/* Time Table (now the main and only component) */}
      <div id="dog-time-table">
        <DogTimeTable 
          dogsStatus={dogStatuses} 
          onRefresh={onRefreshDogs} 
        />
      </div>
    </div>
  );
};

export default DailyCareTab;
