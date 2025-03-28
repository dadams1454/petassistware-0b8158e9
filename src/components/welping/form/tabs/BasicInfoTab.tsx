
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import WeightInput from '@/components/dogs/form/WeightInput';

interface BasicInfoTabProps {
  form: UseFormReturn<any>;
}

const BasicInfoTab: React.FC<BasicInfoTabProps> = ({ form }) => {
  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Puppy Name/ID</FormLabel>
              <FormControl>
                <Input placeholder="Enter puppy name or ID" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Gender</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <FormField
          control={form.control}
          name="color"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Color/Pattern</FormLabel>
              <FormControl>
                <Input placeholder="Enter color description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="markings"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Markings (optional)</FormLabel>
              <FormControl>
                <Input placeholder="Distinctive markings" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <Card className="bg-blue-50 border-blue-200 dark:bg-blue-950/10 dark:border-blue-800 mt-2 mb-4">
        <CardContent className="pt-4 pb-3">
          <div className="flex items-center gap-2 text-blue-700">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm font-medium">Weight tracking is critical for monitoring puppy health</span>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <WeightInput
          form={form}
          name="birth_weight"
          label="Birth Weight"
          defaultUnit="oz"
        />

        <FormField
          control={form.control}
          name="birth_time"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Birth Time</FormLabel>
              <FormControl>
                <Input type="time" {...field} />
              </FormControl>
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
              <Input 
                placeholder="Any observations about the puppy at birth" 
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

export default BasicInfoTab;
