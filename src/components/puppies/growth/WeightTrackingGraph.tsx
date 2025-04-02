
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { supabase } from '@/integrations/supabase/client';
import { differenceInDays, format, parseISO } from 'date-fns';
import { AlertCircle, TrendingUp, TrendingDown } from 'lucide-react';
import { WeightUnit } from '@/types/puppyTracking';
import { convertWeight } from '@/components/litters/puppies/weight/weightUnits';
import { WeightRecord } from '@/types/health';

interface WeightTrackingGraphProps {
  puppyId: string;
  birthDate?: string;
}

const WeightTrackingGraph: React.FC<WeightTrackingGraphProps> = ({ puppyId, birthDate }) => {
  const [weightRecords, setWeightRecords] = useState<WeightRecord[]>([]);
  const [displayUnit, setDisplayUnit] = useState<WeightUnit>('oz');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [healthStatus, setHealthStatus] = useState<'healthy' | 'warning' | 'danger'>('healthy');
  const [growthRate, setGrowthRate] = useState<number | null>(null);

  useEffect(() => {
    fetchWeightRecords();
  }, [puppyId]);

  useEffect(() => {
    if (weightRecords.length > 0) {
      prepareChartData();
      calculateGrowthTrends();
    }
  }, [weightRecords, displayUnit]);

  const fetchWeightRecords = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('weight_records')
        .select('*')
        .eq('puppy_id', puppyId)
        .order('date', { ascending: true });

      if (error) throw error;
      
      // Add age_days property to each record if birthDate is available
      const enrichedData = data.map(record => {
        let age_days = 0;
        if (birthDate && record.date) {
          const birthDateTime = new Date(birthDate);
          const recordDateTime = new Date(record.date);
          age_days = differenceInDays(recordDateTime, birthDateTime);
        }
        
        return {
          ...record,
          age_days
        };
      });
      
      setWeightRecords(enrichedData);
    } catch (err) {
      console.error('Error fetching weight records:', err);
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
    } finally {
      setIsLoading(false);
    }
  };

  const prepareChartData = () => {
    const formatted = weightRecords.map(record => {
      // Convert weight to selected display unit
      const weight = convertWeight(
        record.weight,
        record.weight_unit as WeightUnit,
        displayUnit
      );
      
      return {
        date: record.date,
        age: record.age_days || 0,
        weight: Number(weight.toFixed(2)),
        formattedDate: format(new Date(record.date), 'MMM d')
      };
    });
    
    setChartData(formatted);
  };

  const calculateGrowthTrends = () => {
    if (weightRecords.length < 2) {
      setHealthStatus('healthy');
      setGrowthRate(null);
      return;
    }
    
    // Get the two most recent weights
    const sortedRecords = [...weightRecords].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    const latest = sortedRecords[0];
    const previous = sortedRecords[1];
    
    // Convert both to same unit
    const latestWeight = convertWeight(
      latest.weight,
      latest.weight_unit as WeightUnit,
      'oz'
    );
    
    const previousWeight = convertWeight(
      previous.weight,
      previous.weight_unit as WeightUnit,
      'oz'
    );
    
    // Calculate days between
    const latestDate = new Date(latest.date);
    const previousDate = new Date(previous.date);
    const daysDiff = Math.max(1, differenceInDays(latestDate, previousDate));
    
    // Calculate daily growth rate
    const weightDiff = latestWeight - previousWeight;
    const dailyGrowth = weightDiff / daysDiff;
    setGrowthRate(dailyGrowth);
    
    // Determine health status based on growth rate
    // For puppies, they should gain weight daily
    if (dailyGrowth < 0) {
      setHealthStatus('danger');
    } else if (dailyGrowth < 0.25) { // Less than 0.25 oz per day is concerning for small breed puppies
      setHealthStatus('warning');
    } else {
      setHealthStatus('healthy');
    }
  };

  const getHealthStatusMessage = () => {
    if (!growthRate) return null;
    
    const growthRateDisplay = Math.abs(growthRate).toFixed(2);
    
    if (healthStatus === 'danger') {
      return (
        <Alert variant="destructive" className="mt-2">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center">
            <TrendingDown className="h-4 w-4 mr-1" />
            Weight loss of {growthRateDisplay} {displayUnit}/day. Immediate attention required!
          </AlertDescription>
        </Alert>
      );
    } else if (healthStatus === 'warning') {
      return (
        <Alert variant="warning" className="mt-2 bg-yellow-50 text-yellow-800 border-yellow-200">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center">
            <TrendingUp className="h-4 w-4 mr-1" />
            Slow growth rate of {growthRateDisplay} {displayUnit}/day. Monitor closely.
          </AlertDescription>
        </Alert>
      );
    } else {
      return (
        <Alert variant="success" className="mt-2 bg-green-50 text-green-800 border-green-200">
          <AlertDescription className="flex items-center">
            <TrendingUp className="h-4 w-4 mr-1" />
            Healthy growth rate of {growthRateDisplay} {displayUnit}/day.
          </AlertDescription>
        </Alert>
      );
    }
  };

  const getHealthyWeightRange = (age: number) => {
    // This is a simplified formula - in a real app, this would be based on breed standards
    // and more complex calculations
    const minWeight = age * 0.3; // Minimum healthy weight gain per day in oz
    const maxWeight = age * 0.7; // Maximum healthy weight gain per day in oz
    
    // Convert to the selected display unit
    return {
      min: convertWeight(minWeight, 'oz', displayUnit),
      max: convertWeight(maxWeight, 'oz', displayUnit)
    };
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl">Weight Tracking</CardTitle>
        <Select value={displayUnit} onValueChange={(val: WeightUnit) => setDisplayUnit(val)}>
          <SelectTrigger className="w-24">
            <SelectValue placeholder="Unit" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="oz">oz</SelectItem>
            <SelectItem value="g">g</SelectItem>
            <SelectItem value="lbs">lbs</SelectItem>
            <SelectItem value="kg">kg</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center h-[300px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="text-center py-6 text-destructive">
            Error loading weight data: {error.message}
          </div>
        ) : weightRecords.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            No weight records found for this puppy
          </div>
        ) : (
          <>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey={birthDate ? "age" : "formattedDate"} 
                    label={birthDate ? { value: 'Age (days)', position: 'insideBottomRight', offset: 0 } : undefined}
                  />
                  <YAxis 
                    domain={['auto', 'auto']}
                    label={{ value: `Weight (${displayUnit})`, angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip 
                    formatter={(value) => [`${value} ${displayUnit}`, 'Weight']}
                    labelFormatter={(value) => birthDate ? `Age: ${value} days` : `Date: ${value}`}
                  />
                  {birthDate && (
                    <>
                      <ReferenceLine 
                        y={getHealthyWeightRange(chartData[chartData.length - 1]?.age || 0).min} 
                        stroke="#ffc107" 
                        strokeDasharray="3 3" 
                        label={{ value: 'Min Healthy', position: 'right', fill: '#ffc107' }} 
                      />
                      <ReferenceLine 
                        y={getHealthyWeightRange(chartData[chartData.length - 1]?.age || 0).max} 
                        stroke="#4caf50" 
                        strokeDasharray="3 3" 
                        label={{ value: 'Max Healthy', position: 'right', fill: '#4caf50' }} 
                      />
                    </>
                  )}
                  <Line
                    type="monotone"
                    dataKey="weight"
                    stroke="#8884d8"
                    strokeWidth={2}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            {getHealthStatusMessage()}
            <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
              <div className="bg-gray-50 p-2 rounded">
                <span className="text-muted-foreground">Latest Weight:</span>{' '}
                <strong>
                  {weightRecords.length > 0 
                    ? `${convertWeight(
                        weightRecords[weightRecords.length - 1].weight,
                        weightRecords[weightRecords.length - 1].weight_unit as WeightUnit,
                        displayUnit
                      ).toFixed(2)} ${displayUnit}`
                    : 'N/A'}
                </strong>
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <span className="text-muted-foreground">Total Gain:</span>{' '}
                <strong>
                  {weightRecords.length > 1
                    ? `${(convertWeight(
                        weightRecords[weightRecords.length - 1].weight,
                        weightRecords[weightRecords.length - 1].weight_unit as WeightUnit,
                        displayUnit
                      ) - 
                      convertWeight(
                        weightRecords[0].weight,
                        weightRecords[0].weight_unit as WeightUnit,
                        displayUnit
                      )).toFixed(2)} ${displayUnit}`
                    : 'N/A'}
                </strong>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default WeightTrackingGraph;
