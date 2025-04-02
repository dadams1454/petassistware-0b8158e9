import React, { useState, useEffect, useCallback } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { format, parseISO } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from 'lucide-react';
import { DatePicker } from '@/components/ui/date-picker';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface WeightData {
  id: string;
  weight_date: string;
  weight_grams: number;
  weight_unit: string;
}

interface WeightTrackingGraphProps {
  puppyId: string;
  puppyName: string;
}

const WeightTrackingGraph: React.FC<WeightTrackingGraphProps> = ({ puppyId, puppyName }) => {
  const { toast } = useToast();
  const [weightData, setWeightData] = useState<WeightData[]>([]);
  const [newWeight, setNewWeight] = useState('');
  const [weightUnit, setWeightUnit] = useState('grams');
  const [weightDate, setWeightDate] = useState<Date | undefined>(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const fetchWeightData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('puppy_weights')
        .select('*')
        .eq('puppy_id', puppyId)
        .order('weight_date', { ascending: true });
        
      if (error) {
        console.error("Error fetching weight data:", error);
        setError(error.message);
      } else {
        setWeightData(data || []);
      }
    } catch (err) {
      console.error("Unexpected error fetching weight data:", err);
      setError("Failed to load weight data.");
    } finally {
      setLoading(false);
    }
  }, [puppyId]);
  
  useEffect(() => {
    fetchWeightData();
  }, [fetchWeightData]);
  
  const handleAddWeight = async () => {
    if (!newWeight || isNaN(Number(newWeight)) || !weightDate) {
      toast({
        title: "Error",
        description: "Please enter a valid weight and date.",
        variant: "destructive",
      });
      return;
    }
    
    const weight = Number(newWeight);
    
    try {
      const { error } = await supabase
        .from('puppy_weights')
        .insert([
          {
            puppy_id: puppyId,
            weight_grams: weightUnit === 'grams' ? weight : weight * 453.592,
            weight_unit: weightUnit,
            weight_date: format(weightDate, 'yyyy-MM-dd'),
          },
        ]);
        
      if (error) {
        console.error("Error adding weight:", error);
        toast({
          title: "Error",
          description: "Failed to record weight.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Weight recorded",
          description: `${weight} ${weightUnit} recorded for ${puppyName}`,
          variant: "default",
        });
        setNewWeight('');
        fetchWeightData(); // Refresh data
      }
    } catch (err) {
      console.error("Unexpected error adding weight:", err);
      toast({
        title: "Error",
        description: "Failed to record weight.",
        variant: "destructive",
      });
    }
  };
  
  const chartData = {
    labels: weightData.map(item => format(parseISO(item.weight_date), 'MMM dd')),
    datasets: [
      {
        label: 'Weight (grams)',
        data: weightData.map(item => item.weight_grams),
        fill: false,
        backgroundColor: 'rgb(75, 192, 192)',
        borderColor: 'rgba(75, 192, 192, 0.2)',
      },
    ],
  };
  
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Puppy Weight Chart',
      },
    },
  };
  
  if (loading) {
    return <div className="text-center">Loading weight data...</div>;
  }
  
  if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>;
  }
  
  return (
    <div className="space-y-4">
      <div>
        <Line data={chartData} options={chartOptions} />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="weight">Weight</Label>
          <Input
            type="number"
            id="weight"
            placeholder="Enter weight"
            value={newWeight}
            onChange={(e) => setNewWeight(e.target.value)}
          />
        </div>
        
        <div>
          <Label htmlFor="unit">Unit</Label>
          <Select value={weightUnit} onValueChange={setWeightUnit}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select unit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="grams">Grams</SelectItem>
              <SelectItem value="pounds">Pounds</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label>Weight Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={
                  "w-full justify-start text-left font-normal" +
                  (weightDate ? "pl-3.5" : "text-muted-foreground")
                }
              >
                <Calendar className="mr-2 h-4 w-4" />
                {weightDate ? format(weightDate, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <DatePicker
                mode="single"
                selected={weightDate}
                onSelect={setWeightDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      
      <Button onClick={handleAddWeight}>Add Weight</Button>
    </div>
  );
};

export default WeightTrackingGraph;
