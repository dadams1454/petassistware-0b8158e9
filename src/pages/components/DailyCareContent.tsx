
import React from 'react';
import { Card } from '@/components/ui/card';
import PottyBreakReminderCard from '@/components/dogs/components/care/potty/PottyBreakReminderCard';
import DogTimeTable from '@/components/dogs/components/care/table/DogTimeTable';
import { DogCareStatus } from '@/types/dailyCare';

interface DailyCareContentProps {
  dogStatuses: DogCareStatus[] | undefined;
  currentDate: Date;
}

const DailyCareContent: React.FC<DailyCareContentProps> = ({
  dogStatuses,
  currentDate
}) => {
  if (!dogStatuses || dogStatuses.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">No dogs found. Dogs will automatically appear here when added to the system.</p>
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
      
      {/* Time Table - no more refresh button */}
      <div id="dog-time-table">
        <DogTimeTable 
          dogsStatus={dogStatuses}
          currentDate={currentDate}
        />
      </div>
    </div>
  );
};

export default DailyCareContent;
