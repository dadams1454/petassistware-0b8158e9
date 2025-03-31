
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { UseFormReturn } from 'react-hook-form';
import { InspectionFormValues, inspectionTypes } from './inspectionFormSchema';
import DatePickerField from './DatePickerField';

interface InspectionFormFieldsProps {
  form: UseFormReturn<InspectionFormValues>;
}

const InspectionFormFields: React.FC<InspectionFormFieldsProps> = ({ form }) => {
  return (
    <>
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Inspection Type</FormLabel>
            <Select 
              onValueChange={field.onChange} 
              defaultValue={field.value} 
              value={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select inspection type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {inspectionTypes.map(type => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="status"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Status</FormLabel>
            <Select 
              onValueChange={field.onChange} 
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="passed">Passed</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="inspector"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Inspector Name</FormLabel>
            <FormControl>
              <Input placeholder="Enter inspector name" {...field} value={field.value || ''} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div className="grid grid-cols-2 gap-4">
        <DatePickerField 
          form={form} 
          name="inspection_date" 
          label="Inspection Date" 
        />
        
        <DatePickerField 
          form={form} 
          name="next_date" 
          label="Next Inspection Date" 
        />
      </div>
      
      {form.watch('status') === 'failed' && (
        <FormField
          control={form.control}
          name="follow_up"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Follow-up Required</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Describe required follow-up actions" 
                  className="resize-none" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
      
      <FormField
        control={form.control}
        name="notes"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Notes (optional)</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Add any additional notes about this inspection" 
                className="resize-none" 
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default InspectionFormFields;
