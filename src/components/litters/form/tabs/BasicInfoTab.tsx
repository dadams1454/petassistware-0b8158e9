
import React, { useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import DogSelector from '../DogSelector';
import LitterDatePicker from '../LitterDatePicker';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

interface BasicInfoTabProps {
  form: UseFormReturn<any>;
}

const BasicInfoTab: React.FC<BasicInfoTabProps> = ({ form }) => {
  // Watch male and female count to update total puppy count
  const maleCount = form.watch('male_count');
  const femaleCount = form.watch('female_count');
  
  // Update total puppy count when male or female count changes
  useEffect(() => {
    const total = (maleCount || 0) + (femaleCount || 0);
    form.setValue('puppy_count', total > 0 ? total : 0);
  }, [maleCount, femaleCount, form]);

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="litter_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Litter Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter litter name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DogSelector 
              form={form} 
              name="dam_id" 
              label="Dam (Mother)"
              filterGender="Female"
            />
            
            <DogSelector 
              form={form} 
              name="sire_id" 
              label="Sire (Father)"
              filterGender="Male"
            />
            
            <LitterDatePicker
              form={form}
              name="birth_date"
              label="Birth Date"
            />
            
            <LitterDatePicker
              form={form}
              name="expected_go_home_date"
              label="Expected Go Home Date"
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="male_count"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Male Puppies</FormLabel>
                    <FormControl>
                      <Input 
                        type="number"
                        min="0"
                        placeholder="0"
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value === '' ? null : parseInt(e.target.value);
                          field.onChange(value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="female_count"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Female Puppies</FormLabel>
                    <FormControl>
                      <Input 
                        type="number"
                        min="0"
                        placeholder="0"
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value === '' ? null : parseInt(e.target.value);
                          field.onChange(value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div>
              <Label>Total Puppies</Label>
              <div className="mt-2 p-2 bg-muted/50 rounded text-center font-medium">
                {form.watch('puppy_count') || 0}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Enter any notes about this litter" 
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default BasicInfoTab;
