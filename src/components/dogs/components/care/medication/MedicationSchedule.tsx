
import React, { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isWeekend, isToday, isPast } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  ChevronLeft, 
  ChevronRight, 
  CalendarIcon, 
  AlertOctagon, 
  Check 
} from 'lucide-react';
import { MedicationRecord } from '@/types/medication';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { useUser } from '@/contexts/UserContext';
import { recordMedicationAdministration } from '@/services/medicationService';

interface MedicationScheduleProps {
  dogId: string;
  dogName: string;
  medications: MedicationRecord[];
  onRefresh: () => void;
}

// Interface for grouped medication entries
interface DaySchedule {
  date: Date;
  medications: MedicationRecord[];
}

const MedicationSchedule: React.FC<MedicationScheduleProps> = ({ 
  dogId, 
  dogName, 
  medications, 
  onRefresh 
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [schedule, setSchedule] = useState<DaySchedule[]>([]);
  const { toast } = useToast();
  const { user } = useUser();

  // Generate schedule for the current month
  useEffect(() => {
    const firstDay = startOfMonth(currentMonth);
    const lastDay = endOfMonth(currentMonth);
    const daysInMonth = eachDayOfInterval({ start: firstDay, end: lastDay });
    
    // Create a mapping of each day to medications due on that day
    const dailySchedule: DaySchedule[] = daysInMonth.map(date => {
      // Find medications due on this date
      const dueOnThisDate = medications.filter(med => {
        if (!med.next_due_date) return false;
        const dueDate = new Date(med.next_due_date);
        return isSameDay(date, dueDate);
      });
      
      return {
        date,
        medications: dueOnThisDate
      };
    });
    
    setSchedule(dailySchedule);
  }, [currentMonth, medications]);

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prevMonth => {
      const newMonth = new Date(prevMonth);
      if (direction === 'prev') {
        newMonth.setMonth(prevMonth.getMonth() - 1);
      } else {
        newMonth.setMonth(prevMonth.getMonth() + 1);
      }
      return newMonth;
    });
  };

  const handleAdminister = async (medication: MedicationRecord, date: Date) => {
    if (!user?.id) {
      toast({
        title: "Authentication error",
        description: "You must be logged in to perform this action",
        variant: "destructive"
      });
      return;
    }
    
    try {
      await recordMedicationAdministration(
        medication.id,
        date,
        `Administered on ${format(date, 'PP')}`,
        user.id
      );
      
      toast({
        title: "Medication administered",
        description: `${medication.medication_name} has been marked as administered.`
      });
      
      onRefresh();
    } catch (error) {
      console.error("Error administering medication:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred while recording administration",
        variant: "destructive"
      });
    }
  };

  // Only show days with medications
  const daysWithMedications = schedule.filter(day => day.medications.length > 0);
  const hasMedications = daysWithMedications.length > 0;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <CalendarIcon className="mr-2 h-5 w-5" />
          <h2 className="text-xl font-semibold">
            Medication Schedule for {format(currentMonth, 'MMMM yyyy')}
          </h2>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateMonth('prev')}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentMonth(new Date())}
          >
            Today
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateMonth('next')}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {!hasMedications ? (
        <Card>
          <CardContent className="py-8 flex flex-col items-center justify-center text-center">
            <div className="bg-primary/10 p-3 rounded-full mb-4">
              <CalendarIcon className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No Medications Scheduled</h3>
            <p className="text-muted-foreground max-w-md">
              There are no medications scheduled for {dogName} in {format(currentMonth, 'MMMM yyyy')}.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {daysWithMedications.map(day => {
            const isWeekendDay = isWeekend(day.date);
            const isTodayDate = isToday(day.date);
            const isPastDate = isPast(day.date) && !isTodayDate;
            
            return (
              <Card 
                key={day.date.toISOString()} 
                className={`
                  ${isTodayDate ? 'border-primary bg-primary/5' : ''}
                  ${isPastDate ? 'border-muted bg-muted/30' : ''}
                  ${isWeekendDay && !isTodayDate && !isPastDate ? 'bg-muted/10' : ''}
                `}
              >
                <CardContent className="py-4">
                  <div className="flex items-center mb-2">
                    <div className={`
                      text-lg font-semibold mr-2
                      ${isTodayDate ? 'text-primary' : ''}
                      ${isPastDate ? 'text-muted-foreground' : ''}
                    `}>
                      {format(day.date, 'EEEE, MMMM d')}
                    </div>
                    {isTodayDate && (
                      <Badge variant="outline" className="bg-primary text-white">Today</Badge>
                    )}
                    {isPastDate && (
                      <Badge variant="outline" className="bg-muted">Past</Badge>
                    )}
                  </div>
                  
                  <div className="space-y-3">
                    {day.medications.map(medication => (
                      <div 
                        key={medication.id}
                        className="flex justify-between items-center p-2 rounded-md bg-background"
                      >
                        <div>
                          <div className="font-medium">{medication.medication_name}</div>
                          <div className="text-sm text-muted-foreground">
                            {medication.dosage} {medication.dosage_unit} {medication.route ? `- ${medication.route}` : ''}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {isPastDate ? (
                            <Badge variant="outline" className="flex items-center">
                              <AlertOctagon className="h-3 w-3 mr-1 text-amber-500" />
                              Missed
                            </Badge>
                          ) : (
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="text-xs"
                              onClick={() => handleAdminister(medication, day.date)}
                            >
                              <Check className="h-3 w-3 mr-1" />
                              Administer
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MedicationSchedule;
