
import React from 'react';
import { 
  Form, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormDescription,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';

interface AddVaccinationFormProps {
  puppyId: string;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  existingData?: any;
}

const AddVaccinationForm: React.FC<AddVaccinationFormProps> = ({ 
  puppyId,
  onSubmit,
  onCancel,
  existingData
}) => {
  const form = useForm({
    defaultValues: existingData || {
      vaccination_type: '',
      vaccination_date: new Date().toISOString().split('T')[0],
      administered_by: '',
      lot_number: '',
      notes: ''
    }
  });
  
  const handleSubmit = (data: any) => {
    onSubmit({
      ...data,
      puppy_id: puppyId
    });
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="vaccination_type"
          rules={{ required: 'Vaccination type is required' }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Vaccination Type</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a vaccination type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="DHPP (First)">DHPP (First Dose)</SelectItem>
                  <SelectItem value="DHPP (Second)">DHPP (Second Dose)</SelectItem>
                  <SelectItem value="DHPP (Third)">DHPP (Third Dose)</SelectItem>
                  <SelectItem value="Bordetella">Bordetella (Kennel Cough)</SelectItem>
                  <SelectItem value="Rabies">Rabies</SelectItem>
                  <SelectItem value="Leptospirosis">Leptospirosis</SelectItem>
                  <SelectItem value="Lyme Disease">Lyme Disease</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="vaccination_date"
          rules={{ required: 'Date is required' }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Vaccination Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="administered_by"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Administered By</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Veterinarian or person who administered the vaccine"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="lot_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lot Number</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Vaccine lot number for tracking"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Recording lot numbers helps for recall tracking
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
                  placeholder="Any additional information about the vaccination"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button type="submit">
            Save Vaccination
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AddVaccinationForm;
