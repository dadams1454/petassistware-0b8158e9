
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { supabase } from '@/integrations/supabase/client';
import { format, parseISO } from 'date-fns';
import { WeightUnit, convertWeight } from '@/components/litters/puppies/weight/weightUnits';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface WeightTrackingGraphProps {
  puppyId: string;
  displayUnit?: WeightUnit;
}

interface WeightDataPoint {
  id: string;
  date: string;
  formattedDate: string;
  weight: number;
  weightUnit: WeightUnit;
  age: number;
}

const WeightTrackingGraph: React.FC<WeightTrackingGraphProps> = ({ 
  puppyId,
  displayUnit = 'oz'
}) => {
  const [weightsData, setWeightsData] = useState<WeightDataPoint[]>([]);
  const [birthDate, setBirthDate] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchWeightData = async () => {
      setIsLoading(true);
      
      // First, get the puppy's birth date for age calculation
      try {
        const { data: puppyData, error: puppyError } = await supabase
          .from('puppies')
          .select('birth_date')
          .eq('id', puppyId)
          .single();

        if (puppyError) throw puppyError;
        setBirthDate(puppyData?.birth_date || null);
        
        // Then get the weight records
        const { data: weightRecords, error: weightError } = await supabase
          .from('weight_records')
          .select('*')
          .eq('dog_id', puppyId)
          .order('date', { ascending: true });
        
        if (weightError) throw weightError;
        
        // Process the weight records
        if (weightRecords && weightRecords.length > 0) {
          const formattedData = weightRecords.map(record => {
            // Calculate age in days
            let age = 0;
            if (puppyData?.birth_date) {
              const birthDateTime = new Date(puppyData.birth_date).getTime();
              const recordDateTime = new Date(record.date).getTime();
              age = Math.floor((recordDateTime - birthDateTime) / (1000 * 60 * 60 * 24));
            }
            
            // Use either unit or weight_unit depending on which is available
            const recordUnit = record.unit || record.weight_unit || 'oz';
            
            return {
              id: record.id,
              date: record.date,
              formattedDate: format(parseISO(record.date), 'MMM d'),
              // Convert weight to display unit if needed
              weight: convertWeight(record.weight, recordUnit as WeightUnit, displayUnit),
              weightUnit: displayUnit,
              age
            };
          });
          
          setWeightsData(formattedData);
        } else {
          setWeightsData([]);
        }
      } catch (error) {
        console.error('Error fetching weight data:', error);
        setWeightsData([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (puppyId) {
      fetchWeightData();
    }
  }, [puppyId, displayUnit]);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex justify-center items-center h-[300px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  if (weightsData.length === 0) {
    return (
      <Card>
        <CardContent className="flex justify-center items-center h-[300px]">
          <p className="text-muted-foreground">No weight data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weight Growth Curve</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={weightsData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="formattedDate" 
                label={{ value: 'Date', position: 'insideBottomRight', offset: -10 }} 
              />
              <YAxis 
                label={{ value: `Weight (${displayUnit})`, angle: -90, position: 'insideLeft' }} 
              />
              <Tooltip 
                formatter={(value) => [`${value} ${displayUnit}`, 'Weight']}
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="weight"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
                name={`Weight (${displayUnit})`}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeightTrackingGraph;
