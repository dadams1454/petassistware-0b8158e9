
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DatePicker } from '@/components/ui/date-picker';
import WeightTracker from './weight/WeightTracker';

interface WeightTabProps {
  puppyId: string;
  birthDate?: string;
}

const WeightTab: React.FC<WeightTabProps> = ({ puppyId, birthDate }) => {
  const [date, setDate] = useState<Date>(new Date());
  const [isAddingWeight, setIsAddingWeight] = useState(false);
  
  const handleDateChange = (newDate: Date | undefined) => {
    if (newDate) {
      setDate(newDate);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold">Weight Tracking</h2>
        
        <div className="flex items-center gap-2">
          <DatePicker date={date} onSelect={handleDateChange} />
          
          <Button onClick={() => setIsAddingWeight(true)} disabled={isAddingWeight}>
            Add Weight
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Growth Chart</CardTitle>
          <CardDescription>Track puppy weight over time</CardDescription>
        </CardHeader>
        <CardContent>
          <WeightTracker 
            puppyId={puppyId} 
            birthDate={birthDate}
            isAddingWeight={isAddingWeight}
            onCancelAdd={() => setIsAddingWeight(false)}
            onWeightAdded={() => setIsAddingWeight(false)}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default WeightTab;
