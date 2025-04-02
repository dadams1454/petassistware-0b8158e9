
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WeightData, WeightRecord } from '@/types/puppyTracking';
import { FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { DatePicker } from '@/components/ui/date-picker';
import { useFieldArray } from 'react-hook-form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Weight Form component using passed form context
export const WeightForm = ({ form, control }) => {
  const { fields, append } = useFieldArray({
    control,
    name: "weightData",
  });

  const handleAddWeight = () => {
    append({
      date: new Date(),
      weight: '',
      unit: 'oz', // Default to ounces for puppies
      notes: ''
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        {fields.map((field, index) => (
          <div key={field.id} className="border p-4 rounded-md grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={control}
              name={`weightData.${index}.date`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <DatePicker
                    date={field.value ? new Date(field.value) : undefined}
                    setDate={(date) => field.onChange(date)}
                  />
                </FormItem>
              )}
            />
            
            <FormField
              control={control}
              name={`weightData.${index}.weight`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Weight</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={control}
              name={`weightData.${index}.unit`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Unit</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="oz">Ounces (oz)</SelectItem>
                      <SelectItem value="g">Grams (g)</SelectItem>
                      <SelectItem value="lbs">Pounds (lbs)</SelectItem>
                      <SelectItem value="kg">Kilograms (kg)</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            
            <FormField
              control={control}
              name={`weightData.${index}.notes`}
              render={({ field }) => (
                <FormItem className="md:col-span-3">
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        ))}
      </div>
      
      <Button type="button" variant="outline" onClick={handleAddWeight}>
        Add Weight Entry
      </Button>
    </div>
  );
};

// Convert WeightData to WeightRecord for compatibility
const convertToWeightRecord = (data: WeightData): WeightRecord => {
  return {
    id: data.id || '',
    dog_id: data.dog_id || '',
    puppy_id: data.puppy_id,
    weight: data.weight,
    weight_unit: data.weight_unit || data.unit || 'oz',
    date: data.date,
    notes: data.notes || '',
    created_at: data.created_at || new Date().toISOString(),
  };
};

// Weight history component
export const WeightHistory = ({ weightData = [] }) => {
  // Convert WeightData to WeightRecord
  const weightRecords = weightData.map(convertToWeightRecord);
  
  return (
    <div className="space-y-4">
      <Tabs defaultValue="table">
        <TabsList>
          <TabsTrigger value="table">Table</TabsTrigger>
          <TabsTrigger value="chart">Chart</TabsTrigger>
        </TabsList>
        
        <TabsContent value="table">
          {/* Table view of weight history */}
          <Card>
            <CardContent className="pt-6">
              {weightRecords.length === 0 ? (
                <p className="text-center text-muted-foreground">No weight records yet</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Date</th>
                        <th className="text-left py-2">Weight</th>
                        <th className="text-left py-2">Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {weightRecords.map((record, index) => (
                        <tr key={index} className="border-b">
                          <td className="py-2">{new Date(record.date).toLocaleDateString()}</td>
                          <td className="py-2">{record.weight} {record.weight_unit}</td>
                          <td className="py-2">{record.notes}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="chart">
          {/* Chart view of weight history */}
          <Card>
            <CardContent className="pt-6">
              {weightRecords.length === 0 ? (
                <p className="text-center text-muted-foreground">No weight records yet</p>
              ) : (
                <div className="h-64">
                  <p className="text-center text-muted-foreground">Weight chart would be displayed here</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Main Weight Tab component
export const WeightTab = ({ form, control }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Weight Tracking</h3>
      <WeightForm form={form} control={control} />
    </div>
  );
};

export default WeightTab;
