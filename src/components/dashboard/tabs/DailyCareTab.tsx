
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useDailyCare } from '@/contexts/dailyCare';
import PottyBreakReminderCard from '@/components/dogs/components/care/potty/PottyBreakReminderCard';
import DogTimeTable from '@/components/dogs/components/care/table/DogTimeTable';
import { Button } from '@/components/ui/button';
import { Clock } from 'lucide-react';

interface DailyCareTabProps {
  onRefreshDogs: () => void;
  isRefreshing: boolean;
}

const DailyCareTab: React.FC<DailyCareTabProps> = ({ onRefreshDogs, isRefreshing }) => {
  const { dogStatuses } = useDailyCare();
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  
  // Auto-refresh every 15 minutes
  useEffect(() => {
    const intervalId = setInterval(() => {
      console.log('🔄 Auto refresh triggered in DailyCareTab');
      onRefreshDogs();
      setLastRefresh(new Date());
    }, 15 * 60 * 1000); // 15 minutes
    
    return () => clearInterval(intervalId);
  }, [onRefreshDogs]);
  
  // Handle manual refresh
  const handleRefresh = () => {
    onRefreshDogs();
    setLastRefresh(new Date());
  };
  
  if (!dogStatuses || dogStatuses.length === 0) {
    return (
      <Card className="p-8 text-center">
        <CardContent>
          <p className="text-muted-foreground mb-4">No dogs found. Please refresh or add dogs to the system.</p>
          <Button onClick={handleRefresh}>Refresh Dogs</Button>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-end">
        <span className="text-xs flex items-center gap-1 text-slate-500 dark:text-slate-400">
          <Clock className="h-3 w-3" />
          Auto-refreshes every 15 minutes
        </span>
      </div>
      
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
          onRefresh={handleRefresh} 
        />
      </div>
    </div>
  );
};

export default DailyCareTab;
