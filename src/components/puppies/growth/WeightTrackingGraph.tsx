import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from '@radix-ui/react-icons';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
// Import the correct dependencies
import { Calendar } from '@/components/ui/calendar';

Chart.register(...registerables);

interface WeightTrackingGraphProps {
  puppyId: string;
}

const WeightTrackingGraph: React.FC<WeightTrackingGraphProps> = ({ puppyId }) => {
  const [weights, setWeights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [date, setDate] = useState<Date | undefined>(new Date());
  
  useEffect(() => {
    fetchWeights();
  }, [puppyId]);
  
  const fetchWeights = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('puppy_weights')
        .select('*')
        .eq('puppy_id', puppyId)
        .order('weight_date', { ascending: true });
      
      if (error) {
        setError(error.message);
      } else {
        setWeights(data || []);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const chartData = {
    labels: weights.map((w: any) => w.weight_date),
    datasets: [
      {
        label: 'Weight (grams)',
        data: weights.map((w: any) => w.weight_grams),
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
        display: false,
      },
      title: {
        display: true,
        text: 'Puppy Weight Over Time',
      },
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Date',
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Weight (grams)',
        },
      },
    },
  };
  
  const onSelect = (date: Date | undefined) => {
    setDate(date);
  };
  
  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {weights.length > 0 ? (
        <Line data={chartData} options={chartOptions} />
      ) : (
        <p>No weight data available for this puppy.</p>
      )}
    </div>
  );
};

export default WeightTrackingGraph;
