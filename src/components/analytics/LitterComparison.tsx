import React, { useState, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, LineChart, Line, Cell 
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { AlertCircle, Users, Scale, Palette, FilterX } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { DateRange } from "react-day-picker";
import { DateRangePicker } from '@/components/ui/date-range-picker';

interface LitterComparisonProps {
  className?: string;
  litters?: any[]; // Passing the litters data from parent component
  isLoading?: boolean; // Loading state from parent
}

const LitterComparison: React.FC<LitterComparisonProps> = ({ 
  className, 
  litters = [], // Default to empty array for type safety
  isLoading = false 
}) => {
  const [selectedDamId, setSelectedDamId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("counts");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [filterBreed, setFilterBreed] = useState<string | undefined>(undefined);

  // Fetch all breeds for filter dropdown
  const { data: breeds } = useQuery({
    queryKey: ['dog-breeds'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('dogs')
        .select('breed')
        .not('breed', 'is', null)
        .order('breed');
      
      if (error) throw error;
      
      // Extract unique breeds
      const uniqueBreeds = Array.from(new Set(data.map(dog => dog.breed)))
        .filter(Boolean)
        .map(breed => ({ id: breed, name: breed }));
      
      return uniqueBreeds;
    },
    staleTime: 60 * 60 * 1000, // Cache for 1 hour
  });

  // We'll still need this query to get all dams, but we can use the litters prop for optimization
  const { data: dams, isLoading: isLoadingDams } = useQuery({
    queryKey: ['dams-with-litters', dateRange, filterBreed],
    queryFn: async () => {
      let query = supabase
        .from('dogs')
        .select(`
          id, 
          name,
          breed,
          color,
          litters:litters!litters_dam_id_fkey(id, litter_name, birth_date, sire_id, sire:dogs!litters_sire_id_fkey(id, breed))
        `)
        .eq('gender', 'Female')
        .filter('litters.id', 'not.is', null);
      
      if (filterBreed) {
        query = query.eq('breed', filterBreed);
      }
      
      const { data, error } = await query.order('name');

      if (error) throw error;
      
      // Filter litters by date range if provided
      let filteredData = data;
      if (dateRange?.from || dateRange?.to) {
        filteredData = data.map(dam => {
          const filteredLitters = dam.litters.filter(litter => {
            const litterDate = new Date(litter.birth_date);
            if (dateRange.from && dateRange.to) {
              return litterDate >= dateRange.from && litterDate <= dateRange.to;
            } else if (dateRange.from) {
              return litterDate >= dateRange.from;
            } else if (dateRange.to) {
              return litterDate <= dateRange.to;
            }
            return true;
          });
          
          return { ...dam, litters: filteredLitters };
        });
      }
      
      // Filter to only include dams with at least one litter after date filtering
      return (filteredData || []).filter(dam => dam.litters && dam.litters.length > 0);
    },
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    refetchInterval: 10 * 60 * 1000, // Refetch every 10 minutes in the background
  });

  // Reset selected dam when filters change
  useEffect(() => {
    setSelectedDamId(null);
  }, [dateRange, filterBreed]);

  // Set the first dam as selected when data loads - removed selectedDamId from dependency array
  useEffect(() => {
    if (dams && dams.length > 0 && !selectedDamId) {
      setSelectedDamId(dams[0].id);
    }
  }, [dams]);

  // Reset active tab when dam changes
  useEffect(() => {
    setActiveTab("counts");
  }, [selectedDamId]);

  // Fetch litter details for the selected dam, with improved caching
  const { data: litterDetails, isLoading: isLoadingLitters } = useQuery({
    queryKey: ['dam-litters', selectedDamId, dateRange],
    queryFn: async () => {
      if (!selectedDamId) return [];

      let query = supabase
        .from('litters')
        .select(`
          id,
          litter_name,
          birth_date,
          sire:dogs!litters_sire_id_fkey(id, name, breed, color),
          puppies:puppies!puppies_litter_id_fkey(*)
        `)
        .eq('dam_id', selectedDamId);
      
      // Apply date range filter if provided
      if (dateRange?.from) {
        query = query.gte('birth_date', dateRange.from.toISOString().split('T')[0]);
      }
      
      if (dateRange?.to) {
        query = query.lte('birth_date', dateRange.to.toISOString().split('T')[0]);
      }
      
      const { data, error } = await query.order('birth_date', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!selectedDamId,
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    refetchInterval: 10 * 60 * 1000, // Refetch every 10 minutes in the background
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

  // Get the selected dam details
  const selectedDam = useMemo(() => {
    if (!dams || !selectedDamId) return null;
    return dams.find(dam => dam.id === selectedDamId);
  }, [dams, selectedDamId]);

  // Combined loading state from parent and local queries
  const isLoadingAll = isLoading || isLoadingDams;
  const isContentLoading = isLoadingAll || (selectedDamId && isLoadingLitters);

  // Reset all filters
  const resetFilters = () => {
    setDateRange(undefined);
    setFilterBreed(undefined);
    setSelectedDamId(null);
  };

  if (isLoadingAll) {
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

  // Render the loading skeleton when content is loading
  const renderLoadingState = () => (
    <div className="space-y-6">
      <Skeleton className="w-full h-10 mb-4" />
      <Skeleton className="w-full h-[300px]" />
    </div>
  );

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">Breeding History Comparison</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {/* Filter Controls */}
        <div className="flex flex-wrap gap-4 mb-6">
          <DateRangePicker
            dateRange={dateRange}
            onSelect={setDateRange}
          />
          
          <Select
            value={filterBreed}
            onValueChange={setFilterBreed}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter by breed" />
            </SelectTrigger>
            <SelectContent>
              {breeds?.map(breed => (
                <SelectItem key={breed.id} value={breed.id}>{breed.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button 
            variant="outline" 
            onClick={resetFilters}
            size="sm"
            className="flex items-center gap-1"
          >
            <FilterX className="h-4 w-4" />
            Reset Filters
          </Button>
        </div>
        
        {/* Dam Selector */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Select Dam:</label>
          <Select
            value={selectedDamId || ''}
            onValueChange={(value) => setSelectedDamId(value)}
            disabled={isContentLoading}
          >
            <SelectTrigger className="w-full md:w-[350px]">
              <SelectValue placeholder="Select a dam to view breeding history" />
            </SelectTrigger>
            <SelectContent>
              {dams.map(dam => (
                <SelectItem key={dam.id} value={dam.id}>
                  {dam.name} ({dam.litters?.length || 0} litters)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {isContentLoading ? (
          // Show a loading state for the entire component content
          renderLoadingState()
        ) : (
          <>
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
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
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
                  {puppiesPerLitterData.length > 0 ? (
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
                  {weightComparisonData.length > 0 ? (
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
                  {colorDistributionData.length > 0 ? (
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
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default LitterComparison;
