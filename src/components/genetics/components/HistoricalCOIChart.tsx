
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import { useQuery } from '@tanstack/react-query';
import { DogGenotype } from '@/types/genetics';

interface HistoricalCOIChartProps {
  dogId: string;
  breedAverage?: number;
}

// Sample data structure for COI history
interface COIDataPoint {
  generation: number;
  coi: number;
  breedAverage?: number;
}

export const HistoricalCOIChart: React.FC<HistoricalCOIChartProps> = ({ dogId, breedAverage = 6.5 }) => {
  // Fetch COI data - this could come from calculations stored in the database
  const { data: coiData, isLoading, error } = useQuery({
    queryKey: ['coi-history', dogId],
    queryFn: async () => {
      // This is placeholder data - in a real implementation, this would come from your database
      // of pre-calculated values or calculated on the fly
      return [
        { generation: 1, coi: 0.0 },
        { generation: 2, coi: 0.0 },
        { generation: 3, coi: 3.125 },
        { generation: 4, coi: 4.2 },
        { generation: 5, coi: 5.8 },
        { generation: 6, coi: 7.1 },
        { generation: 7, coi: 9.3 },
        { generation: 8, coi: 12.6 },
        { generation: 10, coi: 15.8 },
      ] as COIDataPoint[];
    }
  });
  
  // Add breed average to the data for visualization
  const dataWithAverage = React.useMemo(() => {
    if (!coiData) return [];
    return coiData.map(point => ({
      ...point,
      breedAverage
    }));
  }, [coiData, breedAverage]);
  
  // Define risk levels
  const lowRisk = 6.25;  // Equivalent to first cousin mating
  const highRisk = 12.5; // Equivalent to half-sibling mating
  
  if (isLoading) {
    return <Skeleton className="h-80 w-full" />;
  }
  
  if (error || !coiData) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="text-red-500 mb-2">Failed to load COI data</div>
          <p className="text-sm text-gray-500">
            Please make sure the dog's pedigree data is properly configured.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Coefficient of Inbreeding (COI) Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="chart">
          <TabsList>
            <TabsTrigger value="chart">COI Chart</TabsTrigger>
            <TabsTrigger value="predictions">Predictions</TabsTrigger>
            <TabsTrigger value="info">About COI</TabsTrigger>
          </TabsList>
          
          <TabsContent value="chart" className="pt-4">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={dataWithAverage}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="generation" 
                    label={{ value: 'Generation Depth', position: 'insideBottomRight', offset: -5 }} 
                  />
                  <YAxis 
                    label={{ value: 'COI (%)', angle: -90, position: 'insideLeft' }}
                    domain={[0, 'dataMax + 2']}
                  />
                  <Tooltip 
                    formatter={(value: number) => [`${value.toFixed(2)}%`, 'COI']}
                    labelFormatter={(value) => `Generation ${value}`}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="coi" 
                    stroke="#4f46e5" 
                    strokeWidth={2} 
                    activeDot={{ r: 8 }} 
                    name="Dog's COI"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="breedAverage" 
                    stroke="#9ca3af" 
                    strokeDasharray="5 5" 
                    name="Breed Average"
                  />
                  <ReferenceLine y={lowRisk} stroke="#f59e0b" strokeDasharray="3 3" label={{ value: 'Moderate Risk', position: 'insideTopLeft', fill: '#f59e0b' }} />
                  <ReferenceLine y={highRisk} stroke="#ef4444" strokeDasharray="3 3" label={{ value: 'High Risk', position: 'insideTopLeft', fill: '#ef4444' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-4 p-4 bg-gray-50 rounded-md">
              <h4 className="font-medium mb-2">COI Analysis</h4>
              <p className="text-sm text-gray-700">
                {coiData[coiData.length - 1].coi < lowRisk ? (
                  <>
                    This dog's COI of <strong>{coiData[coiData.length - 1].coi.toFixed(2)}%</strong> (10-gen) is below the recommended maximum of <strong>{lowRisk}%</strong>, which is good for genetic health.
                  </>
                ) : coiData[coiData.length - 1].coi < highRisk ? (
                  <>
                    This dog's COI of <strong>{coiData[coiData.length - 1].coi.toFixed(2)}%</strong> (10-gen) is above the ideal level of <strong>{lowRisk}%</strong> but below the critical threshold of <strong>{highRisk}%</strong>. Consider selecting breeding partners with lower COI values.
                  </>
                ) : (
                  <>
                    This dog's COI of <strong>{coiData[coiData.length - 1].coi.toFixed(2)}%</strong> (10-gen) exceeds the recommended maximum of <strong>{highRisk}%</strong>. When breeding, it's strongly recommended to select partners with low COI values and no common ancestors.
                  </>
                )}
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="predictions" className="pt-4 space-y-4">
            <div className="p-4 bg-gray-50 rounded-md">
              <h4 className="font-medium mb-2">Breeding Recommendations</h4>
              <p className="text-sm text-gray-700">
                Based on this dog's COI trend, future breeding should focus on partners with:
              </p>
              <ul className="list-disc list-inside text-sm text-gray-700 mt-2">
                <li>No common ancestors within 4-5 generations</li>
                <li>Low individual COI values (ideally below {lowRisk}%)</li>
                <li>Different founder bloodlines</li>
              </ul>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-md">
                <h4 className="font-medium mb-2">Expected Offspring COI</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">With low-COI mate:</span>
                    <span className="font-medium">{(coiData[coiData.length - 1].coi / 2).toFixed(2)}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">With average mate:</span>
                    <span className="font-medium">{((coiData[coiData.length - 1].coi + breedAverage) / 2).toFixed(2)}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">With related mate:</span>
                    <span className="font-medium text-red-600">+{Math.min(25, coiData[coiData.length - 1].coi + 10).toFixed(2)}%</span>
                  </div>
                </div>
              </div>
              
              <div className="p-4 border rounded-md">
                <h4 className="font-medium mb-2">Impact on Health & Longevity</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Genetic diversity:</span>
                    <span className={`font-medium ${coiData[coiData.length - 1].coi < lowRisk ? 'text-green-600' : coiData[coiData.length - 1].coi < highRisk ? 'text-yellow-600' : 'text-red-600'}`}>
                      {coiData[coiData.length - 1].coi < lowRisk ? 'Good' : coiData[coiData.length - 1].coi < highRisk ? 'Moderate' : 'Reduced'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Immune function:</span>
                    <span className={`font-medium ${coiData[coiData.length - 1].coi < lowRisk ? 'text-green-600' : coiData[coiData.length - 1].coi < highRisk ? 'text-yellow-600' : 'text-red-600'}`}>
                      {coiData[coiData.length - 1].coi < lowRisk ? 'Strong' : coiData[coiData.length - 1].coi < highRisk ? 'Average' : 'Potentially compromised'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Recessive disorders:</span>
                    <span className={`font-medium ${coiData[coiData.length - 1].coi < lowRisk ? 'text-green-600' : coiData[coiData.length - 1].coi < highRisk ? 'text-yellow-600' : 'text-red-600'}`}>
                      {coiData[coiData.length - 1].coi < lowRisk ? 'Low risk' : coiData[coiData.length - 1].coi < highRisk ? 'Moderate risk' : 'Elevated risk'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="info" className="pt-4">
            <div className="prose max-w-none text-sm text-gray-700">
              <p>
                <strong>Coefficient of Inbreeding (COI)</strong> measures the probability that two copies of a gene are identical by descent due to common ancestors. It ranges from 0% (no inbreeding) to 100% (complete inbreeding).
              </p>
              
              <h4 className="text-base font-medium mt-4 mb-2">COI Interpretation:</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li><span className="text-green-600 font-medium">Below {lowRisk}%</span>: Represents good genetic diversity, comparable to first cousin mating or less.</li>
                <li><span className="text-yellow-600 font-medium">{lowRisk}% - {highRisk}%</span>: Moderate inbreeding, may increase risk of recessive disorders.</li>
                <li><span className="text-red-600 font-medium">Above {highRisk}%</span>: High inbreeding, equivalent to half-sibling mating, increases risk of health issues.</li>
              </ul>
              
              <h4 className="text-base font-medium mt-4 mb-2">Why COI Matters:</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>Higher COI values correlate with reduced genetic diversity</li>
                <li>Increases risk of expression of recessive genetic disorders</li>
                <li>Can affect fertility, immune function, and longevity</li>
                <li>Impacts litter size and puppy viability</li>
              </ul>
              
              <h4 className="text-base font-medium mt-4 mb-2">Best Practices:</h4>
              <p>
                Generally, breeders should aim to keep COI below {lowRisk}% while 
                maintaining desired breed traits. Genetic testing for specific health 
                markers should be used in conjunction with COI analysis for optimal 
                breeding decisions.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default HistoricalCOIChart;
