
import React from 'react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { WeightUnitEnum } from '@/types/health';
import { useWeightEntryForm } from './useWeightEntryForm';
import { DialogFooterButtons } from '../../profile/records/form-fields/DialogFooterButtons';

interface WeightEntryFormProps {
  dogId: string;
  onSave: (formData: any) => void;
  onCancel: () => void;
}

const WeightEntryForm: React.FC<WeightEntryFormProps> = ({
  dogId,
  onSave,
  onCancel
}) => {
  const { form, isSubmitting, handleSubmit } = useWeightEntryForm(dogId, onSave);
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
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
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex gap-4">
          <FormField
            control={form.control}
            name="weight"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Weight*</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
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
              <FormItem className="w-24">
                <FormLabel>Unit*</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={WeightUnitEnum.Pounds}>lbs</SelectItem>
                    <SelectItem value={WeightUnitEnum.Kilograms}>kg</SelectItem>
                    <SelectItem value={WeightUnitEnum.Grams}>g</SelectItem>
                    <SelectItem value={WeightUnitEnum.Ounces}>oz</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Optional notes" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end gap-2 pt-2">
          <DialogFooterButtons
            onCancel={onCancel}
            isSubmitting={isSubmitting}
            isEditing={false}
            submitLabel="Save Weight"
          />
        </div>
      </form>
    </Form>
  );
};

export default WeightEntryForm;
