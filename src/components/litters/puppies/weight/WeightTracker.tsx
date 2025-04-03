
import React, { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { WeightRecord } from '@/types/puppyTracking';
import { useWeightData } from '@/hooks/useWeightData';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import WeightTable from './WeightTable';
import WeightChart from './WeightChart';
import WeightStats from './WeightStats';

interface WeightTrackerProps {
  puppyId: string;
  birthDate?: string;
  onAddSuccess?: () => void;
}

const weightFormSchema = z.object({
  weight: z.coerce.number().positive('Weight must be positive'),
  weight_unit: z.enum(['oz', 'g', 'lb', 'kg']),
  date: z.string().default(() => new Date().toISOString().split('T')[0]),
  notes: z.string().optional(),
});

type WeightFormValues = z.infer<typeof weightFormSchema>;

const WeightTracker: React.FC<WeightTrackerProps> = ({
  puppyId,
  birthDate,
  onAddSuccess,
}) => {
  const [displayUnit, setDisplayUnit] = useState<'oz' | 'g' | 'lb' | 'kg'>('oz');
  const { 
    weightRecords, 
    stats, 
    isLoading, 
    addWeightRecord, 
    deleteWeightRecord 
  } = useWeightData({ puppyId });

  const form = useForm<WeightFormValues>({
    resolver: zodResolver(weightFormSchema),
    defaultValues: {
      weight: 0,
      weight_unit: 'oz',
      date: new Date().toISOString().split('T')[0],
      notes: '',
    },
  });

  const onSubmit = async (values: WeightFormValues) => {
    try {
      await addWeightRecord({
        ...values,
        birth_date: birthDate,
      });
      
      form.reset({
        weight: 0,
        weight_unit: values.weight_unit,
        date: new Date().toISOString().split('T')[0],
        notes: '',
      });
      
      if (onAddSuccess) {
        onAddSuccess();
      }
    } catch (error) {
      console.error('Error adding weight record:', error);
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="chart" className="w-full">
        <TabsList>
          <TabsTrigger value="chart">Chart</TabsTrigger>
          <TabsTrigger value="table">Records</TabsTrigger>
          <TabsTrigger value="add">Add Weight</TabsTrigger>
        </TabsList>
        
        <TabsContent value="chart" className="space-y-6">
          <WeightStats stats={stats} />
          
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Weight Growth Chart</CardTitle>
                <Select
                  defaultValue={displayUnit}
                  onValueChange={(value) => setDisplayUnit(value as any)}
                >
                  <SelectTrigger className="w-24">
                    <SelectValue placeholder="Unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="oz">oz</SelectItem>
                    <SelectItem value="g">g</SelectItem>
                    <SelectItem value="lb">lb</SelectItem>
                    <SelectItem value="kg">kg</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <WeightChart 
                weightRecords={weightRecords} 
                displayUnit={displayUnit} 
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="table">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Weight Records</CardTitle>
                <Select
                  defaultValue={displayUnit}
                  onValueChange={(value) => setDisplayUnit(value as any)}
                >
                  <SelectTrigger className="w-24">
                    <SelectValue placeholder="Unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="oz">oz</SelectItem>
                    <SelectItem value="g">g</SelectItem>
                    <SelectItem value="lb">lb</SelectItem>
                    <SelectItem value="kg">kg</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <WeightTable 
                weightRecords={weightRecords} 
                onDelete={deleteWeightRecord} 
                displayUnit={displayUnit}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="add">
          <Card>
            <CardHeader>
              <CardTitle>Add New Weight Record</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="weight"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Weight</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" min="0" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="weight_unit"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Unit</FormLabel>
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
                              <SelectItem value="oz">Ounces (oz)</SelectItem>
                              <SelectItem value="g">Grams (g)</SelectItem>
                              <SelectItem value="lb">Pounds (lb)</SelectItem>
                              <SelectItem value="kg">Kilograms (kg)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
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
                          <Textarea 
                            placeholder="Any observations or notes about this weight measurement"
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button type="submit">Record Weight</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WeightTracker;
