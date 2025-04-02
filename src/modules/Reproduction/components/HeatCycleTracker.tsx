
import React, { useState } from 'react';
import { format } from 'date-fns';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { CalendarIcon, Plus, Clock, AlertTriangle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { HeatCycle, ReproductiveStatus, HeatStage } from '@/types/reproductive';
import { Dog } from '@/types/dog';
import { useReproductiveCycle } from '@/hooks/useReproductiveCycle';
import HeatCycleChart from './HeatCycleChart';

interface HeatCycleTrackerProps {
  dog: Dog;
  heatCycles: HeatCycle[];
  status: ReproductiveStatus;
  currentHeatCycle?: HeatCycle | null;
  currentHeatStage?: HeatStage | null;
  fertilityWindow?: { start: Date; end: Date } | null;
  nextHeatDate?: Date | null;
  averageCycleLength?: number | null;
}

const intensityOptions = [
  { value: 'mild', label: 'Mild' },
  { value: 'moderate', label: 'Moderate' },
  { value: 'severe', label: 'Severe' }
];

const symptomOptions = [
  { value: 'swelling', label: 'Vulva Swelling' },
  { value: 'discharge', label: 'Bloody Discharge' },
  { value: 'licking', label: 'Excessive Licking' },
  { value: 'attraction', label: 'Male Attraction' },
  { value: 'receptive', label: 'Receptive to Males' },
  { value: 'mood_changes', label: 'Mood Changes' },
  { value: 'appetite_changes', label: 'Appetite Changes' },
  { value: 'energy_changes', label: 'Energy Level Changes' }
];

const heatCycleSchema = z.object({
  start_date: z.date({
    required_error: "Start date is required",
  }),
  end_date: z.date().nullable().optional(),
  intensity: z.string().nullable().optional(),
  symptoms: z.array(z.string()).nullable().optional(),
  notes: z.string().nullable().optional(),
});

const HeatCycleTracker: React.FC<HeatCycleTrackerProps> = ({
  dog,
  heatCycles,
  status,
  currentHeatCycle,
  currentHeatStage,
  fertilityWindow,
  nextHeatDate,
  averageCycleLength
}) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEndDialogOpen, setIsEndDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('history');
  
  const { 
    addHeatCycle, 
    endHeatCycle, 
    isAddingHeatCycle, 
    isEndingHeatCycle 
  } = useReproductiveCycle(dog.id);
  
  const form = useForm<z.infer<typeof heatCycleSchema>>({
    resolver: zodResolver(heatCycleSchema),
    defaultValues: {
      start_date: new Date(),
      end_date: null,
      intensity: null,
      symptoms: [],
      notes: "",
    }
  });
  
  const endCycleForm = useForm({
    defaultValues: {
      end_date: new Date(),
      notes: ""
    }
  });
  
  const onSubmit = async (data: z.infer<typeof heatCycleSchema>) => {
    await addHeatCycle({
      start_date: format(data.start_date, 'yyyy-MM-dd'),
      end_date: data.end_date ? format(data.end_date, 'yyyy-MM-dd') : null,
      intensity: data.intensity,
      symptoms: data.symptoms,
      notes: data.notes
    });
    
    setIsAddDialogOpen(false);
    form.reset();
  };
  
  const onEndCycle = async (data: any) => {
    if (!currentHeatCycle) return;
    
    await endHeatCycle({
      id: currentHeatCycle.id,
      endDate: format(data.end_date, 'yyyy-MM-dd'),
      notes: data.notes
    });
    
    setIsEndDialogOpen(false);
    endCycleForm.reset();
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Heat Cycle Tracking</h2>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Record Heat Cycle
        </Button>
      </div>
      
      {status === ReproductiveStatus.IN_HEAT && currentHeatStage && (
        <Alert className="bg-red-50 border-red-200">
          <Clock className="h-4 w-4 text-red-500" />
          <AlertTitle className="text-red-700">In Heat - Day {currentHeatStage.day}</AlertTitle>
          <AlertDescription className="text-red-600">
            Current stage: {currentHeatStage.name} - {currentHeatStage.description}
            {fertilityWindow && (
              <p className="mt-1">
                Fertility window: {format(fertilityWindow.start, 'MMM d')} - {format(fertilityWindow.end, 'MMM d')}
              </p>
            )}
          </AlertDescription>
        </Alert>
      )}
      
      {status === ReproductiveStatus.IN_HEAT && currentHeatCycle && (
        <div className="flex justify-end">
          <Button 
            variant="outline" 
            onClick={() => setIsEndDialogOpen(true)}
          >
            End Current Heat Cycle
          </Button>
        </div>
      )}
      
      <div className="flex space-x-2 border-b">
        <Button 
          variant={activeTab === 'history' ? "default" : "ghost"}
          onClick={() => setActiveTab('history')}
          className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
          data-state={activeTab === 'history' ? 'active' : 'inactive'}
        >
          History
        </Button>
        <Button 
          variant={activeTab === 'chart' ? "default" : "ghost"}
          onClick={() => setActiveTab('chart')}
          className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
          data-state={activeTab === 'chart' ? 'active' : 'inactive'}
        >
          Chart
        </Button>
      </div>
      
      {activeTab === 'history' ? (
        <Card>
          <CardHeader>
            <CardTitle>Heat Cycle History</CardTitle>
            <CardDescription>
              {heatCycles.length > 0 
                ? `${dog.name}'s heat cycle history. Average cycle length: ${averageCycleLength || 'Unknown'} days.`
                : 'No heat cycles recorded yet.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {heatCycles.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Intensity</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {heatCycles.map((cycle) => (
                    <TableRow key={cycle.id}>
                      <TableCell>{format(new Date(cycle.start_date), 'MMM d, yyyy')}</TableCell>
                      <TableCell>
                        {cycle.end_date 
                          ? format(new Date(cycle.end_date), 'MMM d, yyyy')
                          : 'Ongoing'}
                      </TableCell>
                      <TableCell>
                        {cycle.cycle_length 
                          ? `${cycle.cycle_length} days` 
                          : cycle.end_date 
                            ? 'Unknown'
                            : 'Ongoing'}
                      </TableCell>
                      <TableCell className="capitalize">{cycle.intensity || 'Not recorded'}</TableCell>
                      <TableCell className="max-w-xs truncate">{cycle.notes || '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8">
                <AlertTriangle className="mx-auto h-12 w-12 text-amber-500 mb-3" />
                <h3 className="text-lg font-medium">No Heat Cycles Recorded</h3>
                <p className="text-muted-foreground mt-2 mb-4">
                  Record heat cycles to track {dog.name}'s reproductive health and predict future cycles.
                </p>
                <Button onClick={() => setIsAddDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Record First Heat Cycle
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Heat Cycle Analysis</CardTitle>
            <CardDescription>
              Visual representation of {dog.name}'s heat cycle patterns
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[400px]">
            <HeatCycleChart 
              heatCycles={heatCycles} 
              nextHeatDate={nextHeatDate} 
            />
          </CardContent>
        </Card>
      )}
      
      {/* Add Heat Cycle Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Record Heat Cycle</DialogTitle>
            <DialogDescription>
              Enter details about the heat cycle to help track {dog.name}'s reproductive health.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="start_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Start Date</FormLabel>
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
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      The date when the heat cycle began
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="intensity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Intensity</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      value={field.value || undefined}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select intensity" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {intensityOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      How intense the heat cycle appears to be
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter any notes or observations about this heat cycle" 
                        {...field} 
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormDescription>
                      Any additional information about this heat cycle
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsAddDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isAddingHeatCycle}>
                  {isAddingHeatCycle ? 'Saving...' : 'Save Heat Cycle'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* End Heat Cycle Dialog */}
      <Dialog open={isEndDialogOpen} onOpenChange={setIsEndDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>End Current Heat Cycle</DialogTitle>
            <DialogDescription>
              Record the end date for the current heat cycle.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={endCycleForm.handleSubmit(onEndCycle)} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">End Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    {endCycleForm.watch('end_date') ? (
                      format(endCycleForm.watch('end_date'), "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endCycleForm.watch('end_date')}
                    onSelect={(date) => endCycleForm.setValue('end_date', date!)}
                    disabled={(date) =>
                      date > new Date() || 
                      (currentHeatCycle && date < new Date(currentHeatCycle.start_date))
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Notes</label>
              <Textarea
                placeholder="Any additional notes about the end of this heat cycle"
                {...endCycleForm.register('notes')}
              />
            </div>
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsEndDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isEndingHeatCycle}>
                {isEndingHeatCycle ? 'Saving...' : 'End Heat Cycle'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HeatCycleTracker;
