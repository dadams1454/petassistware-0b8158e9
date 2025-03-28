
import React from 'react';
import { FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import WeightInput from '@/components/dogs/form/WeightInput';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Scale, TrendingUp } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';

interface WeightsTabProps {
  form: UseFormReturn<any>;
}

const WeightsTab: React.FC<WeightsTabProps> = ({ form }) => {
  return (
    <>
      <Card className="mb-4 bg-amber-50 border-amber-200 dark:bg-amber-950/10 dark:border-amber-800">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <span className="mt-0.5">
              <Scale className="h-5 w-5 text-amber-600" />
            </span>
            <div>
              <h3 className="font-medium text-amber-800">Weight Tracking Importance</h3>
              <p className="text-sm text-amber-700 mt-1">
                Puppies should gain 5-10% of their body weight daily in the first weeks. 
                Daily weighing helps identify health issues early.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <WeightInput 
          form={form} 
          name="birth_weight" 
          label="Birth Weight"
          defaultUnit="oz" 
        />
        
        <WeightInput 
          form={form} 
          name="current_weight" 
          label="Current Weight"
          defaultUnit="oz" 
        />
      </div>

      <div className="mt-4">
        <FormField
          control={form.control}
          name="weight_notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Weight Progress Notes</FormLabel>
              <Input 
                placeholder="Document weight milestones or concerns" 
                {...field} 
              />
            </FormItem>
          )}
        />
      </div>

      <Alert className="mt-4 bg-blue-50 border-blue-200 dark:bg-blue-950/10 dark:border-blue-800">
        <TrendingUp className="h-4 w-4 text-blue-600" />
        <AlertTitle className="text-blue-700">Healthy Growth Target</AlertTitle>
        <AlertDescription className="text-blue-600">
          Puppies should double their birth weight by 7-10 days and triple it by 3 weeks.
          Any weight loss or stagnation for more than 24 hours requires attention.
        </AlertDescription>
      </Alert>
    </>
  );
};

export default WeightsTab;
