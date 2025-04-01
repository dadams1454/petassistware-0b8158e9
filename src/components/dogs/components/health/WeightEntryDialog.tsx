
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { WeightUnitEnum } from '@/types/health';

const weightSchema = z.object({
  weight: z.string().min(1, 'Weight is required').refine(
    (val) => !isNaN(Number(val)) && Number(val) > 0,
    {
      message: 'Weight must be a positive number',
    }
  ),
  unit: z.nativeEnum(WeightUnitEnum, {
    required_error: 'Unit is required',
  }),
  date: z.date({
    required_error: 'Date is required',
  }),
  notes: z.string().optional(),
});

type WeightFormValues = z.infer<typeof weightSchema>;

interface WeightEntryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dogId: string;
  initialData?: any;
  onSave: (data: any) => void;
}

const WeightEntryDialog: React.FC<WeightEntryDialogProps> = ({
  open,
  onOpenChange,
  dogId,
  initialData,
  onSave
}) => {
  const form = useForm<WeightFormValues>({
    resolver: zodResolver(weightSchema),
    defaultValues: initialData ? {
      weight: String(initialData.weight),
      unit: initialData.unit as WeightUnitEnum,
      date: new Date(initialData.date),
      notes: initialData.notes || '',
    } : {
      weight: '',
      unit: WeightUnitEnum.Pounds,
      date: new Date(),
      notes: '',
    },
  });
  
  const handleSubmit = (values: WeightFormValues) => {
    const weightData = {
      dog_id: dogId,
      weight: Number(values.weight),
      unit: values.unit,
      weight_unit: values.unit, // For database compatibility
      date: values.date.toISOString(),
      notes: values.notes,
    };
    
    onSave(weightData);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {initialData ? 'Edit Weight Record' : 'Add Weight Record'}
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Weight*</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0" 
                        step="0.1" 
                        placeholder="Enter weight" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="unit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unit*</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select unit" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={WeightUnitEnum.Pounds}>Pounds (lbs)</SelectItem>
                        <SelectItem value={WeightUnitEnum.Kilograms}>Kilograms (kg)</SelectItem>
                        <SelectItem value={WeightUnitEnum.Ounces}>Ounces (oz)</SelectItem>
                        <SelectItem value={WeightUnitEnum.Grams}>Grams (g)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date*</FormLabel>
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
                        disabled={(date) => date > new Date()}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
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
                      placeholder="Add any notes about this weight record"
                      className="min-h-[80px]" 
                      {...field} 
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter className="pt-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
              >
                Save Record
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default WeightEntryDialog;
