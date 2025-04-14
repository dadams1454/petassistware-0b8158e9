
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Check, Plus, AlertTriangle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ActionButton } from '@/components/ui/standardized';

interface TimeStep {
  id: string;
  label: string;
  time: string;
}

interface DogLetOutTimeStepperProps {
  dogId: string;
  dogName: string;
  lastPottyTime?: string;
  onTimeSelected: (time: string) => void;
}

const DEFAULT_TIME_STEPS: TimeStep[] = [
  { id: 'morning', label: 'Morning', time: '7:00 AM' },
  { id: 'midday', label: 'Mid-day', time: '12:00 PM' },
  { id: 'afternoon', label: 'Afternoon', time: '3:00 PM' },
  { id: 'evening', label: 'Evening', time: '7:00 PM' },
  { id: 'night', label: 'Night', time: '10:00 PM' },
];

const DogLetOutTimeStepper: React.FC<DogLetOutTimeStepperProps> = ({
  dogId,
  dogName,
  lastPottyTime,
  onTimeSelected
}) => {
  const [selectedTimeStep, setSelectedTimeStep] = useState<string | null>(null);
  const [customTimeVisible, setCustomTimeVisible] = useState(false);

  const handleTimeStepClick = (timeStep: TimeStep) => {
    setSelectedTimeStep(timeStep.id);
    onTimeSelected(timeStep.time);
  };

  const getTimeSince = (timestamp: string | undefined) => {
    if (!timestamp) return 'No records';
    
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch (e) {
      return 'Invalid date';
    }
  };

  const lastPottyTimeFormatted = getTimeSince(lastPottyTime);
  const hasAlert = lastPottyTime && 
    (new Date().getTime() - new Date(lastPottyTime).getTime()) > 8 * 60 * 60 * 1000; // 8 hours

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center justify-between">
          <div className="flex items-center">
            <Clock className="mr-2 h-5 w-5 text-blue-500" />
            Dog Let Out Time
          </div>
          {lastPottyTime && (
            <div className="text-sm font-normal flex items-center">
              Last: {lastPottyTimeFormatted}
              {hasAlert && (
                <AlertTriangle className="ml-2 h-4 w-4 text-amber-500" />
              )}
            </div>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
            {DEFAULT_TIME_STEPS.map((timeStep) => (
              <Button
                key={timeStep.id}
                variant={selectedTimeStep === timeStep.id ? "default" : "outline"}
                size="sm"
                className="w-full justify-start"
                onClick={() => handleTimeStepClick(timeStep)}
              >
                {selectedTimeStep === timeStep.id && (
                  <Check className="mr-1 h-4 w-4" />
                )}
                <span>{timeStep.label}</span>
              </Button>
            ))}
          </div>
          
          {!customTimeVisible ? (
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full mt-2 border border-dashed border-gray-300 text-gray-500"
              onClick={() => setCustomTimeVisible(true)}
            >
              <Plus className="mr-1 h-4 w-4" />
              Custom Time
            </Button>
          ) : (
            <div className="flex items-center space-x-2 mt-2">
              <input
                type="time"
                className="px-3 py-1 border rounded-md"
                onChange={(e) => {
                  const timeValue = e.target.value;
                  if (timeValue) {
                    // Convert 24h format to 12h format with AM/PM
                    const [hours, minutes] = timeValue.split(':');
                    const hour = parseInt(hours, 10);
                    const ampm = hour >= 12 ? 'PM' : 'AM';
                    const hour12 = hour % 12 || 12;
                    const formattedTime = `${hour12}:${minutes} ${ampm}`;
                    
                    setSelectedTimeStep('custom');
                    onTimeSelected(formattedTime);
                  }
                }}
              />
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setCustomTimeVisible(false)}
              >
                Cancel
              </Button>
            </div>
          )}
          
          <div className="pt-3 flex justify-end">
            <ActionButton
              label="Log Break"
              onClick={() => {
                if (selectedTimeStep) {
                  const selectedTime = DEFAULT_TIME_STEPS.find(ts => ts.id === selectedTimeStep)?.time || '';
                  console.log(`Dog ${dogName} (${dogId}) was let out at ${selectedTime}`);
                }
              }}
              icon={<Check className="h-4 w-4" />}
              disabled={!selectedTimeStep}
              variant="default"
              size="sm"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DogLetOutTimeStepper;
