
import React, { useEffect } from 'react';
import { format, addDays, isWithinInterval } from 'date-fns';
import { UseFormReturn } from 'react-hook-form';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Calendar, AlertTriangle } from 'lucide-react';
import DatePicker from '../../form/DatePicker';
import TextInput from '../../form/TextInput';
import CheckboxInput from '../../form/CheckboxInput';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface BreedingTabProps {
  form: UseFormReturn<any>;
  lastHeatDate: Date | null;
  isPregnant: boolean;
  nextHeatDate: Date | null;
  hasSchedulingConflict: boolean;
}

const BreedingTab = ({ 
  form, 
  lastHeatDate, 
  isPregnant, 
  nextHeatDate, 
  hasSchedulingConflict 
}: BreedingTabProps) => {
  
  // Function to handle litter number input
  const handleLitterNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value >= 0 && value <= 4) {
      form.setValue('litter_number', value);
    } else {
      form.setValue('litter_number', value < 0 ? 0 : 4);
    }
  };

  // Handle pregnancy status change
  useEffect(() => {
    if (!isPregnant) {
      // Reset tie_date when not pregnant
      form.setValue('tie_date', null);
    }
  }, [isPregnant, form]);

  return (
    <div className="space-y-4 py-4">
      <div className="mt-2">
        <div className="p-4 rounded-lg border-2 border-purple-200 bg-purple-50 dark:bg-purple-900/20 dark:border-purple-800">
          <h3 className="text-lg font-semibold mb-4 text-purple-800 dark:text-purple-300">Breeding Information</h3>
          <Separator className="mb-4 bg-purple-200 dark:bg-purple-700" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <DatePicker
                form={form}
                name="last_heat_date"
                label="Last Heat Date"
              />
              {nextHeatDate && !isPregnant && (
                <div className="flex items-center mt-1 text-xs">
                  <Calendar className="h-3 w-3 mr-1 text-purple-600" />
                  <span className="text-muted-foreground mr-1">Next heat:</span>
                  <Badge variant="outline" className={`font-normal ${hasSchedulingConflict ? "text-amber-600 bg-amber-50" : "text-purple-600 bg-purple-50"}`}>
                    {format(nextHeatDate, 'MMM d, yyyy')}
                  </Badge>
                  
                  {hasSchedulingConflict && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="ml-1.5">
                            <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Warning: Heat cycle is predicted within 1 month of next vaccination. Consider rescheduling one of these.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
              )}
            </div>
            
            <TextInput
              form={form}
              name="litter_number"
              label="Litter Number (out of 4)"
              type="number"
              onChange={handleLitterNumberChange}
            />
            
            <CheckboxInput
              form={form}
              name="is_pregnant"
              label="Currently Pregnant"
            />
            
            {isPregnant && (
              <div className="space-y-1">
                <DatePicker
                  form={form}
                  name="tie_date"
                  label="Tie Date"
                />
                {form.watch('tie_date') && (
                  <div className="flex items-center mt-1 text-xs">
                    <Calendar className="h-3 w-3 mr-1 text-pink-600" />
                    <span className="text-muted-foreground mr-1">Due date:</span>
                    <Badge variant="outline" className="font-normal text-pink-600 bg-pink-50">
                      {format(addDays(form.watch('tie_date'), 65), 'MMM d, yyyy')}
                    </Badge>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BreedingTab;
