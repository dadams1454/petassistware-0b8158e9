
import React from 'react';
import { format } from 'date-fns';
import { CustomButton } from '@/components/ui/custom-button';
import { Calendar, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { DayPicker } from 'react-day-picker';

interface TableActionsProps {
  onAddGroup: () => void;
  isRefreshing: boolean;
  currentDate: Date;
  onDateChange?: (date: Date) => void;
}

const TableActions: React.FC<TableActionsProps> = ({ 
  onAddGroup, 
  isRefreshing,
  currentDate,
  onDateChange
}) => {
  const handlePrevDay = () => {
    if (onDateChange) {
      const prevDay = new Date(currentDate);
      prevDay.setDate(prevDay.getDate() - 1);
      onDateChange(prevDay);
    }
  };

  const handleNextDay = () => {
    if (onDateChange) {
      const nextDay = new Date(currentDate);
      nextDay.setDate(nextDay.getDate() + 1);
      onDateChange(nextDay);
    }
  };

  const handleSelectDate = (date: Date | undefined) => {
    if (date && onDateChange) {
      onDateChange(date);
    }
  };

  const isToday = currentDate.toDateString() === new Date().toDateString();

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
      <div>
        <h2 className="text-lg font-semibold">Dog Time Table</h2>
        <div className="flex items-center gap-2 mt-1">
          {onDateChange && (
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={handlePrevDay}
                className="h-7 w-7"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <Popover>
                <PopoverTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className={cn(
                      "flex items-center gap-2 px-2 py-1 h-7",
                      !isToday && "text-amber-600 dark:text-amber-500"
                    )}
                  >
                    <Calendar className="h-3 w-3" />
                    <span className="text-sm font-medium">
                      {format(currentDate, 'MMM d, yyyy')}
                    </span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <DayPicker
                    mode="single"
                    selected={currentDate}
                    onSelect={handleSelectDate}
                    defaultMonth={currentDate}
                    className="border-none"
                  />
                </PopoverContent>
              </Popover>
              
              <Button 
                variant="ghost" 
                size="icon"
                onClick={handleNextDay}
                className="h-7 w-7"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        {!isToday && onDateChange && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDateChange(new Date())}
            className="text-xs h-9"
          >
            Today
          </Button>
        )}
        
        <CustomButton onClick={onAddGroup} disabled={isRefreshing}>
          <Plus className="h-4 w-4 mr-2" />
          Add Group
        </CustomButton>
      </div>
    </div>
  );
};

export default TableActions;
