
import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { format, isSameDay } from 'date-fns';
import { 
  HoverCard, 
  HoverCardContent, 
  HoverCardTrigger 
} from '@/components/ui/hover-card';
import { VaccinationScheduleItem, VaccinationRecord } from '@/types/puppyTracking';
import { Syringe } from 'lucide-react';

interface VaccinationCalendarProps {
  vaccinations: VaccinationRecord[];
  scheduledVaccinations: VaccinationScheduleItem[];
}

const VaccinationCalendar: React.FC<VaccinationCalendarProps> = ({ 
  vaccinations, 
  scheduledVaccinations 
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  
  // Find events for a specific day
  const getVaccinationsForDate = (date: Date): VaccinationRecord[] => {
    return vaccinations.filter(v => 
      isSameDay(new Date(v.vaccination_date), date)
    );
  };
  
  // Find scheduled vaccinations for a specific day
  const getScheduledVaccinationsForDate = (date: Date): VaccinationScheduleItem[] => {
    return scheduledVaccinations.filter(v => 
      isSameDay(new Date(v.due_date), date)
    );
  };
  
  // Custom day rendering
  const renderDay = (day: Date, isSelected: boolean, props: React.HTMLAttributes<HTMLButtonElement>) => {
    const completedVaccinations = getVaccinationsForDate(day);
    const scheduledVaccinations = getScheduledVaccinationsForDate(day);
    
    const hasCompletedVaccination = completedVaccinations.length > 0;
    const hasScheduledVaccination = scheduledVaccinations.length > 0;
    
    // If no vaccinations on this day, return default rendering
    if (!hasCompletedVaccination && !hasScheduledVaccination) {
      return <>{day.getDate()}</>;
    }
    
    // Custom rendering for days with vaccinations
    return (
      <HoverCard>
        <HoverCardTrigger asChild>
          <div className="relative flex items-center justify-center w-full h-full">
            <span>{day.getDate()}</span>
            <div className="absolute bottom-0 left-0 right-0 flex justify-center">
              {hasCompletedVaccination && (
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 mx-0.5" />
              )}
              {hasScheduledVaccination && (
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mx-0.5" />
              )}
            </div>
          </div>
        </HoverCardTrigger>
        <HoverCardContent side="right" align="start" className="w-80 p-0">
          <div className="p-3">
            <h4 className="font-medium mb-2">{format(day, 'EEEE, MMMM d, yyyy')}</h4>
            
            {hasCompletedVaccination && (
              <div className="mb-2">
                <h5 className="text-sm font-medium text-green-600 flex items-center gap-1 mb-1">
                  <Syringe className="h-3 w-3" />
                  Completed Vaccinations
                </h5>
                <ul className="text-sm space-y-1">
                  {completedVaccinations.map(v => (
                    <li key={v.id}>
                      {v.vaccination_type}
                      {v.administered_by && ` - by ${v.administered_by}`}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {hasScheduledVaccination && (
              <div>
                <h5 className="text-sm font-medium text-blue-600 flex items-center gap-1 mb-1">
                  <Syringe className="h-3 w-3" />
                  Scheduled Vaccinations
                </h5>
                <ul className="text-sm space-y-1">
                  {scheduledVaccinations.map(v => (
                    <li key={v.id}>{v.vaccination_type}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </HoverCardContent>
      </HoverCard>
    );
  };
  
  return (
    <div className="p-3 border rounded-md bg-card">
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={setSelectedDate}
        className="rounded-md border"
        components={{
          Day: ({ day, selected, ...props }) => (
            <button
              {...props}
              className={`${props.className} ${
                selected ? 'bg-primary text-primary-foreground' : ''
              }`}
            >
              {renderDay(day, selected, props)}
            </button>
          )
        }}
      />
    </div>
  );
};

export default VaccinationCalendar;
