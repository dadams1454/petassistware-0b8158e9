import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, LineChart, Line, Cell 
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { AlertCircle, Users, Scale, Palette, ArrowLeftRight } from 'lucide-react';

interface LitterComparisonProps {
  className?: string;
}

interface Dam {
  id: string;
  name: string;
  breed: string;
  color: string;
  litters: {
    id: string;
    litter_name: string | null;
    birth_date: string;
  }[];
}

const LitterComparison: React.FC<LitterComparisonProps> = ({ className }) => {
  const [selectedDamId, setSelectedDamId] = useState<string | null>(null);

  // Fetch female dogs that have had litters
  const { data: dams, isLoading: isLoadingDams } = useQuery({
    queryKey: ['dams-with-litters'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('dogs')
        .select(`
          id, 
          name,
          breed,
          color,
          litters:litters!litters_dam_id_fkey(id, litter_name, birth_date)
        `)
        .eq('gender', 'Female')
        .filter('litters.id', 'not.is', null)
        .order('name');

      if (error) throw error;
      
      // Filter to only include dams with at least one litter
      return (data || []).filter(dam => dam.litters && dam.litters.length > 0) as Dam[];
    }
  });

  // Set the first dam as selected when data loads
  React.useEffect(() => {
    if (dams && dams.length > 0 && !selectedDamId) {
      setSelectedDamId(dams[0].id);
    }
  }, [dams, selectedDamId]);

  // Get the selected dam details
  const selectedDam = useMemo(() => {
    if (!dams || !selectedDamId) return null;
    return dams.find(dam => dam.id === selectedDamId);
  }, [dams, selectedDamId]);

  // Fetch litter details for the selected dam
  const { data: litterDetails, isLoading: isLoadingLitters } = useQuery({
    queryKey: ['dam-litters', selectedDamId],
    queryFn: async () => {
      if (!selectedDamId) return [];

      const { data, error } = await supabase
        .from('litters')
        .select(`
          id,
          litter_name,
          birth_date,
          sire:dogs!litters_sire_id_fkey(id, name, breed, color),
          puppies:puppies!puppies_litter_id_fkey(*)
        `)
        .eq('dam_id', selectedDamId)
        .order('birth_date', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!selectedDamId
  });

  // Generate comparison data for puppies per litter
  const puppiesPerLitterData = useMemo(() => {
    if (!litterDetails) return [];
    
    return litterDetails.map(litter => ({
      name: litter.litter_name || `Litter (${new Date(litter.birth_date).toLocaleDateString()})`,
      count: litter.puppies.length,
      male: litter.puppies.filter(puppy => puppy.gender?.toLowerCase() === 'male').length,
      female: litter.puppies.filter(puppy => puppy.gender?.toLowerCase() === 'female').length,
      sire: litter.sire?.name || 'Unknown'
    }));
  }, [litterDetails]);

  // Generate comparison data for weight averages per litter
  const weightComparisonData = useMemo(() => {
    if (!litterDetails) return [];
    
    return litterDetails.map(litter => {
      const birthWeights = litter.puppies
        .filter(puppy => puppy.birth_weight)
        .map(puppy => parseFloat(puppy.birth_weight));
      
      const currentWeights = litter.puppies
        .filter(puppy => puppy.current_weight)
        .map(puppy => parseFloat(puppy.current_weight));
      
      const avgBirthWeight = birthWeights.length 
        ? birthWeights.reduce((sum, weight) => sum + weight, 0) / birthWeights.length
        : 0;
      
      const avgCurrentWeight = currentWeights.length 
        ? currentWeights.reduce((sum, weight) => sum + weight, 0) / currentWeights.length
        : 0;
      
      return {
        name: litter.litter_name || `Litter (${new Date(litter.birth_date).toLocaleDateString()})`,
        birthWeight: avgBirthWeight,
        currentWeight: avgCurrentWeight,
        sire: litter.sire?.name || 'Unknown',
        puppyCount: litter.puppies.length
      };
    });
  }, [litterDetails]);

  // Generate comparison data for color distribution across all litters
  const colorDistributionData = useMemo(() => {
    if (!litterDetails) return [];

    const colorCounts: { [key: string]: number } = {};
    let totalPuppies = 0;

    litterDetails.forEach(litter => {
      litter.puppies.forEach(puppy => {
        if (puppy.color) {
          colorCounts[puppy.color] = (colorCounts[puppy.color] || 0) + 1;
          totalPuppies++;
        }
      });
    });

    return Object.keys(colorCounts).map(color => ({
      name: color,
      count: colorCounts[color],
      percentage: Math.round((colorCounts[color] / totalPuppies) * 100)
    }));
  }, [litterDetails]);

  // Generate colors for charts
  const COLORS = ['#2563eb', '#db2777', '#16a34a', '#ea580c', '#9333ea', '#ca8a04', '#0891b2', '#4f46e5'];

  if (isLoadingDams) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="text-center py-8">
            <p className="text-muted-foreground">Loading dam breeding data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!dams || dams.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="flex items-center gap-2 text-amber-500 mb-4">
            <AlertCircle className="h-5 w-5" />
            <p>No female dogs with litters found in the database.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">Breeding History Comparison</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {/* Dam Selector */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Select Dam:</label>
          <Select
            value={selectedDamId || ''}
            onValueChange={(value) => setSelectedDamId(value)}
          >
            <SelectTrigger className="w-full md:w-[350px]">
              <SelectValue placeholder="Select a dam to view breeding history" />
            </SelectTrigger>
            <SelectContent>
              {dams && dams.map(dam => (
                <SelectItem key={dam.id} value={dam.id}>
                  {dam.name} ({dam.litters?.length || 0} litters)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedDam && (
          <div className="mb-4 p-4 bg-muted rounded-lg">
            <h3 className="font-medium">{selectedDam.name}</h3>
            <p className="text-sm text-muted-foreground">
              Breed: {selectedDam.breed} • Color: {selectedDam.color || 'Not specified'} • 
              Total Litters: {selectedDam.litters?.length || 0}
            </p>
          </div>
        )}

        {/* Comparison Tabs */}
        {selectedDamId && (
          <Tabs defaultValue="counts" className="w-full">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="counts" className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Puppy Counts</span>
              </TabsTrigger>
              <TabsTrigger value="weights" className="flex items-center gap-1">
                <Scale className="h-4 w-4" />
                <span className="hidden sm:inline">Weight Comparison</span>
              </TabsTrigger>
              <TabsTrigger value="colors" className="flex items-center gap-1">
                <Palette className="h-4 w-4" />
                <span className="hidden sm:inline">Color Distribution</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="counts">
              {isLoadingLitters ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Loading litter data...</p>
                </div>
              ) : puppiesPerLitterData.length > 0 ? (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={puppiesPerLitterData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 70 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="name" 
                        tick={{ fontSize: 12 }}
                        angle={-45}
                        textAnchor="end"
                        interval={0}
                      />
                      <YAxis 
                        label={{ value: 'Number of Puppies', angle: -90, position: 'insideLeft' }}
                      />
                      <Tooltip 
                        formatter={(value, name) => {
                          if (name === 'male') return [`${value} males`, 'Males'];
                          if (name === 'female') return [`${value} females`, 'Females'];
                          return [`${value} puppies`, 'Total'];
                        }}
                        labelFormatter={(label) => {
                          const item = puppiesPerLitterData.find(d => d.name === label);
                          return `${label} (Sire: ${item?.sire})`;
                        }}
                      />
                      <Legend />
                      <Bar dataKey="male" name="Males" fill="#2563eb" />
                      <Bar dataKey="female" name="Females" fill="#db2777" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="text-center py-8 border border-dashed rounded-md">
                  <p className="text-muted-foreground">No litter data available for this dam.</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="weights">
              {isLoadingLitters ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Loading weight data...</p>
                </div>
              ) : weightComparisonData.length > 0 ? (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={weightComparisonData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 70 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="name" 
                        tick={{ fontSize: 12 }}
                        angle={-45}
                        textAnchor="end"
                        interval={0}
                      />
                      <YAxis 
                        label={{ value: 'Average Weight (oz)', angle: -90, position: 'insideLeft' }}
                      />
                      <Tooltip 
                        formatter={(value, name) => {
                          if (name === 'birthWeight') return [`${Number(value).toFixed(1)} oz`, 'Birth Weight'];
                          return [`${Number(value).toFixed(1)} oz`, 'Current Weight'];
                        }}
                        labelFormatter={(label) => {
                          const item = weightComparisonData.find(d => d.name === label);
                          return `${label} (Sire: ${item?.sire}, Puppies: ${item?.puppyCount})`;
                        }}
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="birthWeight" 
                        name="Avg. Birth Weight" 
                        stroke="#9333ea" 
                        strokeWidth={2} 
                        activeDot={{ r: 8 }} 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="currentWeight" 
                        name="Avg. Current Weight" 
                        stroke="#16a34a" 
                        strokeWidth={2} 
                        activeDot={{ r: 8 }} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="text-center py-8 border border-dashed rounded-md">
                  <p className="text-muted-foreground">No weight data available for puppies of this dam.</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="colors">
              {isLoadingLitters ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Loading color data...</p>
                </div>
              ) : colorDistributionData.length > 0 ? (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={colorDistributionData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="name" 
                        tick={{ fontSize: 12 }}
                        interval={0}
                      />
                      <YAxis
                        yAxisId="left"
                        label={{ value: 'Count', angle: -90, position: 'insideLeft' }}
                      />
                      <YAxis
                        yAxisId="right"
                        orientation="right"
                        label={{ value: 'Percentage', angle: 90, position: 'insideRight' }}
                        unit="%"
                      />
                      <Tooltip 
                        formatter={(value, name, props) => {
                          if (name === 'percentage') return [`${value}%`, 'Percentage'];
                          return [`${value} puppies`, 'Count'];
                        }}
                      />
                      <Legend />
                      <Bar 
                        dataKey="count" 
                        name="Number of Puppies" 
                        fill="#2563eb"
                        yAxisId="left"
                      >
                        {colorDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                      <Bar 
                        dataKey="percentage" 
                        name="Percentage" 
                        fill="#16a34a"
                        yAxisId="right"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="text-center py-8 border border-dashed rounded-md">
                  <p className="text-muted-foreground">No color data available for puppies of this dam.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
};

export default LitterComparison;
