
import React, { useState } from 'react';
import { format, isSameDay, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth } from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar, AlertTriangle, Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { usePuppyVaccinations } from '@/hooks/usePuppyVaccinations';
import { LoadingState } from '@/components/ui/standardized';

interface VaccinationCalendarProps {
  puppyId: string;
  onAddVaccination: () => void;
}

const VaccinationCalendar: React.FC<VaccinationCalendarProps> = ({ 
  puppyId, 
  onAddVaccination 
}) => {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [selectedVaccinations, setSelectedVaccinations] = useState<any[]>([]);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  
  const { 
    vaccinations, 
    isLoading
  } = usePuppyVaccinations(puppyId);
  
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  
  // Get days in the current month
  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });
  
  // Get vaccinations for a specific day
  const getVaccinationsForDay = (day: Date) => {
    const dayVaccinations = vaccinations.filter(vax => {
      const dateToCheck = vax.vaccination_date ? 
        new Date(vax.vaccination_date) : 
        vax.due_date ? new Date(vax.due_date) : null;
        
      return dateToCheck && isSameDay(dateToCheck, day);
    });
    
    return dayVaccinations;
  };
  
  // Check if a day has any vaccinations
  const hasVaccinations = (day: Date) => {
    return getVaccinationsForDay(day).length > 0;
  };
  
  // Check if a day has overdue vaccinations
  const hasOverdueVaccinations = (day: Date) => {
    return vaccinations.some(vax => {
      // Check if this is a due date that's in the past and not completed
      return vax.due_date && 
        isSameDay(new Date(vax.due_date), day) && 
        !vax.is_completed &&
        new Date(vax.due_date) < new Date();
    });
  };
  
  // Handle day click to show vaccinations
  const handleDayClick = (day: Date) => {
    const dayVaccinations = getVaccinationsForDay(day);
    if (dayVaccinations.length > 0) {
      setSelectedDay(day);
      setSelectedVaccinations(dayVaccinations);
      setDialogOpen(true);
    }
  };
  
  if (isLoading) {
    return <LoadingState message="Loading vaccination calendar..." />;
  }
  
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-md">Vaccination Calendar</CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={prevMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="font-medium">
              {format(currentMonth, 'MMMM yyyy')}
            </span>
            <Button variant="ghost" size="icon" onClick={nextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-px bg-muted rounded-lg overflow-hidden">
            {/* Day headers */}
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div 
                key={day} 
                className="h-10 flex items-center justify-center font-medium text-sm bg-muted/50"
              >
                {day}
              </div>
            ))}
            
            {/* Calendar days */}
            {days.map((day, index) => {
              const hasVax = hasVaccinations(day);
              const isOverdue = hasOverdueVaccinations(day);
              const isToday = isSameDay(day, new Date());
              const isCurrentMonth = isSameMonth(day, currentMonth);
              
              // Get the starting position for the first day of the month
              const startOffset = days[0].getDay();
              
              // Add empty cells for days before the first of the month
              const cells = [];
              if (index === 0) {
                for (let i = 0; i < startOffset; i++) {
                  cells.push(
                    <div 
                      key={`empty-${i}`} 
                      className="h-24 p-1 bg-white border-t border-l first:border-l-0"
                    />
                  );
                }
              }
              
              // Add the actual day cell
              cells.push(
                <div 
                  key={day.toISOString()} 
                  className={`h-24 p-1 relative bg-white border-t border-l first:border-l-0 ${
                    isToday ? 'bg-blue-50' : ''
                  } ${
                    !isCurrentMonth ? 'opacity-50' : ''
                  } ${
                    hasVax ? 'cursor-pointer hover:bg-muted/20' : ''
                  }`}
                  onClick={hasVax ? () => handleDayClick(day) : undefined}
                >
                  <div className="flex justify-between items-start">
                    <span className={`text-sm font-medium ${isToday ? 'text-blue-600' : ''}`}>
                      {format(day, 'd')}
                    </span>
                    
                    {hasVax && (
                      <div className="flex gap-1">
                        {isOverdue ? (
                          <Badge variant="destructive" className="text-[10px] px-1 py-0">
                            <AlertTriangle className="h-3 w-3" />
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-[10px] px-1 py-0">
                            <Calendar className="h-3 w-3" />
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {/* Small indicators for vaccinations */}
                  {hasVax && (
                    <div className="absolute bottom-1 left-1 right-1">
                      <div className="flex flex-wrap gap-1">
                        {getVaccinationsForDay(day).slice(0, 2).map((vax, vaxIndex) => (
                          <div 
                            key={vaxIndex}
                            className={`text-[10px] px-1 rounded-sm truncate ${
                              vax.is_completed 
                                ? 'bg-green-100 text-green-800'
                                : vax.due_date && new Date(vax.due_date) < new Date()
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {vax.vaccination_type}
                          </div>
                        ))}
                        {getVaccinationsForDay(day).length > 2 && (
                          <div className="text-[10px] px-1 bg-muted rounded-sm">
                            +{getVaccinationsForDay(day).length - 2}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
              
              return cells;
            })}
          </div>
          
          <div className="flex justify-between mt-4">
            <div className="flex gap-4">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-xs">Scheduled</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-xs">Completed</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-xs">Overdue</span>
              </div>
            </div>
            
            <Button size="sm" onClick={onAddVaccination}>
              Add Vaccination
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Vaccinations for {selectedDay ? format(selectedDay, 'MMMM d, yyyy') : ''}
            </DialogTitle>
            <DialogDescription>
              Scheduled and completed vaccinations for this date.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-3 mt-2">
            {selectedVaccinations.map((vax) => (
              <div key={vax.id} className="border rounded-md p-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium flex items-center gap-2">
                      {vax.vaccination_type}
                      {vax.is_completed ? (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          <Check className="h-3 w-3 mr-1" />
                          Completed
                        </Badge>
                      ) : (
                        <Badge variant={
                          vax.due_date && new Date(vax.due_date) < new Date() 
                            ? "destructive" 
                            : "outline"
                        }>
                          {vax.due_date && new Date(vax.due_date) < new Date() 
                            ? "Overdue" 
                            : "Scheduled"}
                        </Badge>
                      )}
                    </h4>
                    
                    {vax.administered_by && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Administered by: {vax.administered_by}
                      </p>
                    )}
                    
                    {vax.lot_number && (
                      <p className="text-sm text-muted-foreground">
                        Lot number: {vax.lot_number}
                      </p>
                    )}
                    
                    {vax.notes && (
                      <p className="text-sm mt-2 italic">
                        {vax.notes}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VaccinationCalendar;
