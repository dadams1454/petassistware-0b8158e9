
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { format, parseISO, differenceInDays } from 'date-fns';
import { CalendarIcon, Plus, Scale } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface WeightRecord {
  date: string;
  weight: number;
  age: number;
}

interface PuppyWeightHistoryProps {
  puppy: Puppy;
  litterId: string;
}

const PuppyWeightHistory: React.FC<PuppyWeightHistoryProps> = ({ puppy, litterId }) => {
  const [isAddingWeight, setIsAddingWeight] = useState(false);
  const [weightHistory, setWeightHistory] = useState<WeightRecord[]>([
    // Demo data - in a real app, this would come from the database
    puppy.birth_weight ? {
      date: puppy.birth_date || new Date().toISOString(),
      weight: parseFloat(puppy.birth_weight),
      age: 0
    } : null,
    puppy.current_weight ? {
      date: new Date().toISOString(),
      weight: parseFloat(puppy.current_weight),
      age: puppy.birth_date ? differenceInDays(new Date(), new Date(puppy.birth_date)) : 0
    } : null
  ].filter(Boolean) as WeightRecord[]);

  const form = useForm({
    defaultValues: {
      weight: '',
      date: new Date()
    }
  });

  const handleAddWeight = (data: { weight: string; date: Date }) => {
    const newWeight = parseFloat(data.weight);
    if (isNaN(newWeight) || newWeight <= 0) return;

    const newRecord: WeightRecord = {
      date: data.date.toISOString(),
      weight: newWeight,
      age: puppy.birth_date ? differenceInDays(data.date, new Date(puppy.birth_date)) : 0
    };

    setWeightHistory([...weightHistory, newRecord]);
    setIsAddingWeight(false);
    form.reset();
  };

  const formatXAxis = (tickItem: string) => {
    return format(new Date(tickItem), 'MM/dd');
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-3 border rounded-md shadow-md text-sm">
          <p className="font-medium">{format(new Date(label), 'MMMM d, yyyy')}</p>
          <p className="text-muted-foreground">Age: {payload[0].payload.age} days</p>
          <p className="text-primary">Weight: {payload[0].value} oz</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center gap-2">
            <Scale className="h-5 w-5" />
            Weight History
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsAddingWeight(!isAddingWeight)}
            className="h-8"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Weight
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isAddingWeight && (
          <form 
            onSubmit={form.handleSubmit(handleAddWeight)}
            className="bg-muted p-3 rounded-md mb-4 flex items-end gap-2"
          >
            <div className="w-full space-y-1">
              <label className="text-xs font-medium">Weight (oz)</label>
              <Input 
                {...form.register('weight')} 
                type="number" 
                step="0.1" 
                min="0" 
                placeholder="Enter weight in oz" 
              />
            </div>
            
            <div className="w-full space-y-1">
              <label className="text-xs font-medium">Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full pl-3 text-left font-normal",
                      !form.watch('date') && "text-muted-foreground"
                    )}
                  >
                    {form.watch('date') ? (
                      format(form.watch('date'), "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={form.watch('date')}
                    onSelect={(date) => form.setValue('date', date || new Date())}
                    disabled={(date) => date > new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <Button type="submit" size="sm" className="mb-0">Save</Button>
          </form>
        )}
        
        {weightHistory.length > 0 ? (
          <div className="h-64 w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={weightHistory.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())}
                margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={formatXAxis} 
                  stroke="#888888"
                  fontSize={12}
                />
                <YAxis 
                  label={{ value: 'Weight (oz)', angle: -90, position: 'insideLeft' }} 
                  stroke="#888888"
                  fontSize={12}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="weight" 
                  name="Weight (oz)"
                  stroke="#2563eb" 
                  strokeWidth={2}
                  dot={{ r: 4 }} 
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>No weight history available yet.</p>
            <p className="text-sm">Add weight records to track growth over time.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PuppyWeightHistory;
