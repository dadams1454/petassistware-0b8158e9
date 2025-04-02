
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, AlertCircle } from 'lucide-react';
import { HistoricalCOIChartProps } from '@/types/genetics';
import { formatDate } from '../utils/healthUtils';
import { supabase } from '@/integrations/supabase/client';

export const HistoricalCOIChart: React.FC<HistoricalCOIChartProps> = ({ dogId, generations = [] }) => {
  const [coiData, setCOIData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [breedAverage, setBreedAverage] = useState<number | null>(null);
  
  useEffect(() => {
    async function fetchCOIData() {
      setLoading(true);
      try {
        // In a real implementation, we would fetch historical COI data from
        // the database, but for now we'll generate mock data
        const { data: dogDetails } = await supabase
          .from('dogs')
          .select('breed')
          .eq('id', dogId)
          .single();
        
        if (!dogDetails) throw new Error('Dog not found');
        
        // Get breed average (mock data)
        const breedAverages: Record<string, number> = {
          'Newfoundland': 5.2,
          'Labrador Retriever': 6.5,
          'Golden Retriever': 8.0,
          'German Shepherd': 7.2,
          'Poodle': 4.5
        };
        
        setBreedAverage(breedAverages[dogDetails.breed] || 5.0);
        
        // Generate mock historical data
        const startDate = new Date('2020-01-01');
        const endDate = new Date();
        const intervalMonths = 3;
        
        const mockData = [];
        let currentDate = new Date(startDate);
        let baseCOI = 3.5 + Math.random() * 2; // Random starting point
        
        while (currentDate <= endDate) {
          // Add some random variation
          baseCOI += (Math.random() - 0.5) * 0.5;
          
          mockData.push({
            date: new Date(currentDate).toISOString().split('T')[0],
            coi: parseFloat(baseCOI.toFixed(2)),
            breedAverage: breedAverages[dogDetails.breed] || 5.0
          });
          
          // Move to next interval
          currentDate.setMonth(currentDate.getMonth() + intervalMonths);
        }
        
        setCOIData(mockData);
      } catch (err) {
        console.error('Error fetching COI data:', err);
        setError('Failed to load COI data');
      } finally {
        setLoading(false);
      }
    }
    
    fetchCOIData();
  }, [dogId]);
  
  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-40 bg-gray-100 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (error || coiData.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <AlertCircle className="h-8 w-8 mx-auto text-yellow-500 mb-2" />
          <p className="text-sm text-muted-foreground">
            {error || "No COI data available for this dog."}
          </p>
        </CardContent>
      </Card>
    );
  }
  
  // Get the latest COI value
  const latestCOI = coiData[coiData.length - 1]?.coi || 0;
  
  // Determine if the COI is higher than the breed average
  const isHigherThanAverage = breedAverage !== null && latestCOI > breedAverage;
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-lg font-medium">
          <TrendingUp className="h-5 w-5 mr-2" /> COI Trend Analysis
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-muted-foreground">Current COI</div>
            <div className="text-2xl font-semibold">{latestCOI}%</div>
          </div>
          
          {breedAverage !== null && (
            <div>
              <div className="text-sm text-muted-foreground">Breed Average</div>
              <div className="text-2xl font-semibold">{breedAverage}%</div>
            </div>
          )}
          
          <div>
            <div className="text-sm text-muted-foreground">Status</div>
            <div className={`text-sm font-medium ${isHigherThanAverage ? 'text-yellow-600' : 'text-green-600'}`}>
              {isHigherThanAverage 
                ? 'Above breed average'
                : 'Below breed average'}
            </div>
          </div>
        </div>
        
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={coiData}
              margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(value) => formatDate(value).split(' ')[0]}
              />
              <YAxis 
                domain={[0, 'dataMax + 2']}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip 
                formatter={(value) => [`${value}%`, 'COI']}
                labelFormatter={(label) => formatDate(label)}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="coi" 
                name="COI" 
                stroke="#2563eb" 
                strokeWidth={2}
                activeDot={{ r: 8 }}
              />
              {breedAverage !== null && (
                <Line 
                  type="monotone" 
                  dataKey="breedAverage" 
                  name="Breed Average" 
                  stroke="#64748b" 
                  strokeDasharray="5 5"
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="text-xs text-muted-foreground">
          <p>
            The Coefficient of Inbreeding (COI) measures genetic diversity. 
            Lower values indicate more genetic diversity, which is generally healthier 
            for the breed and individual dogs.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default HistoricalCOIChart;
