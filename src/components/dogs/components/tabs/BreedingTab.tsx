
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { CalendarIcon, AlertCircle, Check, X, Clock, Calendar } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { format, addDays, differenceInDays } from 'date-fns';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { HeatCycleManagement } from '../HeatCycleManagement';
import { DogGender } from '@/types/dog';

interface BreedingTabProps {
  form: UseFormReturn<any>;
  lastHeatDate?: Date;
  isPregnant?: boolean;
  nextHeatDate?: Date | null;
  hasSchedulingConflict?: boolean;
  dog: { id: string };
}

const BreedingTab: React.FC<BreedingTabProps> = ({
  form,
  lastHeatDate,
  isPregnant = false,
  nextHeatDate,
  hasSchedulingConflict = false,
  dog
}) => {
  // Get the current values from the form
  const currentLastHeatDate = form.watch('last_heat_date');
  const currentTieDate = form.watch('tie_date');
  const currentIsPregnant = form.watch('is_pregnant');
  
  // Format dates for display
  const formattedLastHeatDate = currentLastHeatDate 
    ? format(new Date(currentLastHeatDate), 'PPP')
    : 'Not recorded';
  
  const formattedTieDate = currentTieDate
    ? format(new Date(currentTieDate), 'PPP')
    : 'Not recorded';
  
  // Calculate estimated due date (63 days after tie date)
  const estimatedDueDate = currentTieDate
    ? format(addDays(new Date(currentTieDate), 63), 'PPP')
    : 'Unknown';
  
  // Calculate days until due date
  const daysUntilDue = currentTieDate && !isPregnant
    ? differenceInDays(addDays(new Date(currentTieDate), 63), new Date())
    : null;
  
  // Calculate next heat date (approximately 6 months after last heat)
  const calculatedNextHeatDate = currentLastHeatDate
    ? format(addDays(new Date(currentLastHeatDate), 180), 'PPP')
    : 'Unknown';
  
  // Calculate days until next heat
  const daysUntilNextHeat = currentLastHeatDate && !isPregnant
    ? differenceInDays(addDays(new Date(currentLastHeatDate), 180), new Date())
    : null;

  return (
    <div className="space-y-6">
      {/* Reproductive Status Section */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Reproductive Status</CardTitle>
          <CardDescription>
            Track reproductive cycle information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Pregnancy Checkbox */}
          <FormField
            control={form.control}
            name="is_pregnant"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="text-base font-semibold">
                    Currently Pregnant
                  </FormLabel>
                  <FormDescription>
                    Mark this dog as currently pregnant to track gestation
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
          
          {/* Last Heat Date */}
          <FormField
            control={form.control}
            name="last_heat_date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Last Heat Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(new Date(field.value), "PPP")
                        ) : (
                          <span>Select date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={field.onChange}
                      disabled={(date) => date > new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  This helps calculate the next expected heat cycle
                </FormDescription>
              </FormItem>
            )}
          />
          
          {/* Tie Date Selector */}
          <FormField
            control={form.control}
            name="tie_date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Breeding Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(new Date(field.value), "PPP")
                        ) : (
                          <span>Select date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={field.onChange}
                      disabled={(date) => date > new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  Date of successful breeding. Used to calculate due date.
                </FormDescription>
              </FormItem>
            )}
          />
          
          {/* Reproductive Notes */}
          <FormField
            control={form.control}
            name="reproductive_notes"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Reproductive Notes</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Notes about heat cycles, breeding, etc."
                    {...field}
                    rows={3}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
      
      {/* Reproductive Summary */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Reproductive Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">Last Heat Date</h4>
              <p className="text-sm font-medium">{formattedLastHeatDate}</p>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">Expected Next Heat</h4>
              <p className="text-sm font-medium flex items-center">
                {calculatedNextHeatDate}
                {daysUntilNextHeat !== null && !currentIsPregnant && (
                  <Badge className="ml-2" variant="outline">
                    <Clock className="mr-1 h-3 w-3" /> 
                    {daysUntilNextHeat > 0 
                      ? `In ${daysUntilNextHeat} days` 
                      : 'Overdue'}
                  </Badge>
                )}
              </p>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">Last Breeding Date</h4>
              <p className="text-sm font-medium">{formattedTieDate}</p>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">Estimated Due Date</h4>
              <p className="text-sm font-medium flex items-center">
                {estimatedDueDate}
                {daysUntilDue !== null && currentIsPregnant && (
                  <Badge className="ml-2" variant={daysUntilDue > 7 ? "outline" : "secondary"}>
                    <Calendar className="mr-1 h-3 w-3" /> 
                    {daysUntilDue > 0 
                      ? `In ${daysUntilDue} days` 
                      : 'Overdue'}
                  </Badge>
                )}
              </p>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">Pregnancy Status</h4>
              <p className="text-sm font-medium flex items-center">
                {currentIsPregnant ? (
                  <>
                    <Badge variant="success" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      <Check className="mr-1 h-3 w-3" /> Pregnant
                    </Badge>
                  </>
                ) : (
                  <>
                    <Badge variant="outline" className="text-muted-foreground">
                      <X className="mr-1 h-3 w-3" /> Not Pregnant
                    </Badge>
                  </>
                )}
              </p>
            </div>
          </div>
          
          {/* Scheduling Conflict Warning */}
          {hasSchedulingConflict && (
            <Alert variant="warning" className="bg-amber-50 dark:bg-amber-950">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Scheduling Notice</AlertTitle>
              <AlertDescription>
                The next vaccination and heat cycle dates are close to each other.
                Consider adjusting the vaccination schedule.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
      
      {/* Heat Cycle Management */}
      <div className="mt-8">
        <h3 className="text-lg font-medium mb-4">Heat Cycle History</h3>
        <Separator className="my-4" />
        {dog && dog.id && (
          <HeatCycleManagement dogId={dog.id} />
        )}
      </div>
    </div>
  );
};

export default BreedingTab;
