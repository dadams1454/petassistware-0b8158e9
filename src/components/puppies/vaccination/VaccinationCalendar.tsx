
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { Check, AlertTriangle } from 'lucide-react';
import { usePuppyVaccinations } from '@/hooks/usePuppyVaccinations';
import { LoadingState } from '@/components/ui/standardized';
import { format, isSameDay, parseISO } from 'date-fns';
import { VaccinationScheduleItem } from '@/types/puppyTracking';

interface VaccinationCalendarProps {
  puppyId: string;
  onAddVaccination: () => void;
}

const VaccinationCalendar: React.FC<VaccinationCalendarProps> = ({ 
  puppyId,
  onAddVaccination
}) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  
  const { 
    vaccinations, 
    isLoading, 
    error,
    addVaccination
  } = usePuppyVaccinations(puppyId);
  
  const handleMarkComplete = (vaccination: VaccinationScheduleItem) => {
    addVaccination({
      vaccination_type: vaccination.vaccination_type,
      vaccination_date: date ? format(date, 'yyyy-MM-dd') : new Date().toISOString().split('T')[0],
      notes: vaccination.notes
    });
  };
  
  if (isLoading) {
    return <LoadingState message="Loading vaccination calendar..." />;
  }
  
  // Function to find vaccinations on a specific date
  const getVaccinationsForDay = (day: Date) => {
    const completedOnDay = vaccinations.filter(vax => 
      vax.is_completed && 
      vax.vaccination_date && 
      isSameDay(parseISO(vax.vaccination_date), day)
    );
    
    const scheduledForDay = vaccinations.filter(vax => 
      !vax.is_completed && 
      vax.due_date && 
      isSameDay(parseISO(vax.due_date), day)
    );
    
    return [...completedOnDay, ...scheduledForDay];
  };
  
  // Function to determine date styling for the calendar
  const getDayStyle = (day: Date) => {
    // Find if any vaccinations are scheduled or completed on this day
    const vaccinationsOnDay = vaccinations.filter(vax => {
      if (vax.is_completed && vax.vaccination_date) {
        return isSameDay(parseISO(vax.vaccination_date), day);
      }
      if (!vax.is_completed && vax.due_date) {
        return isSameDay(parseISO(vax.due_date), day);
      }
      return false;
    });
    
    // If no vaccinations, return undefined for default styling
    if (vaccinationsOnDay.length === 0) {
      return undefined;
    }
    
    // Check if there are any overdue vaccinations for this day
    const hasOverdue = vaccinationsOnDay.some(vax => 
      !vax.is_completed && 
      vax.due_date && 
      parseISO(vax.due_date) < new Date()
    );
    
    // Check if there are any completed vaccinations for this day
    const hasCompleted = vaccinationsOnDay.some(vax => vax.is_completed);
    
    // Return appropriate styling
    if (hasOverdue) {
      return { 
        className: 'bg-destructive/20 font-bold text-destructive rounded-full' 
      };
    }
    
    if (hasCompleted) {
      return { 
        className: 'bg-green-100 font-bold text-green-700 rounded-full' 
      };
    }
    
    // Otherwise it's an upcoming scheduled vaccination
    return { 
      className: 'bg-blue-100 font-bold text-blue-700 rounded-full' 
    };
  };
  
  // Get vaccinations for the selected date
  const selectedDayVaccinations = date ? getVaccinationsForDay(date) : [];
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="md:col-span-2">
        <CardHeader className="pb-2">
          <CardTitle>Vaccination Calendar</CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border"
            modifiers={{
              selected: date
            }}
            modifiersStyles={{}}
            components={{
              Day: ({ day, ...props }) => {
                const style = getDayStyle(day);
                return (
                  <div {...props} className={style?.className}>
                    {day.getDate()}
                  </div>
                );
              }
            }}
          />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>
            {date ? format(date, 'MMMM d, yyyy') : 'Select a Date'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {selectedDayVaccinations.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-muted-foreground mb-4">No vaccinations for this date</p>
              <Button onClick={onAddVaccination}>
                Schedule a Vaccination
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {selectedDayVaccinations.map((vax) => {
                const isOverdue = !vax.is_completed && 
                  vax.due_date && 
                  parseISO(vax.due_date) < new Date();
                
                return (
                  <div 
                    key={vax.id} 
                    className={`p-3 rounded-md border ${
                      vax.is_completed 
                        ? 'bg-green-50 border-green-200' 
                        : isOverdue 
                          ? 'bg-destructive/5 border-destructive/20' 
                          : 'bg-blue-50 border-blue-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{vax.vaccination_type}</span>
                      <Badge 
                        variant="outline" 
                        className={vax.is_completed 
                          ? 'bg-green-50 text-green-700 border-green-200' 
                          : isOverdue 
                            ? 'bg-destructive/10 text-destructive border-destructive/20' 
                            : 'bg-blue-50 text-blue-700 border-blue-200'
                        }
                      >
                        {vax.is_completed 
                          ? 'Completed' 
                          : isOverdue 
                            ? 'Overdue' 
                            : 'Scheduled'
                        }
                      </Badge>
                    </div>
                    
                    {vax.notes && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {vax.notes}
                      </p>
                    )}
                    
                    {!vax.is_completed && (
                      <div className="mt-2 flex justify-end">
                        <Button 
                          size="sm" 
                          variant={isOverdue ? 'destructive' : 'outline'} 
                          onClick={() => handleMarkComplete(vax)}
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Mark Complete
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VaccinationCalendar;
