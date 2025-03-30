import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, Grid2X2 } from 'lucide-react';
import { MultiTraitMatrixProps, DogGenotype } from '@/types/genetics';
import { useDogGenetics } from '@/hooks/useDogGenetics';
import { supabase } from '@/integrations/supabase/client';

export const MultiTraitMatrix: React.FC<MultiTraitMatrixProps> = ({ dogId, dogGenetics }) => {
  const { geneticData, loading, error } = useDogGenetics(dogId);
  const [selectedTrait1, setSelectedTrait1] = useState('baseColor');
  const [selectedTrait2, setSelectedTrait2] = useState('dilution');
  const [otherDogs, setOtherDogs] = useState<any[]>([]);
  const [isLoadingOtherDogs, setIsLoadingOtherDogs] = useState(false);
  const [breedFilter, setBreedFilter] = useState('');
  
  const data = dogGenetics || geneticData;
  
  // Fetch test data for other dogs of the same breed
  useEffect(() => {
    async function fetchOtherDogs() {
      setIsLoadingOtherDogs(true);
      try {
        // First get dog details to know the breed
        const { data: dogDetails } = await supabase
          .from('dogs')
          .select('*')
          .eq('id', dogId)
          .single();
          
        if (dogDetails) {
          setBreedFilter(dogDetails.breed);
          
          // Get other dogs of same breed
          const { data: otherDogsOfBreed } = await supabase
            .from('dogs')
            .select('*')
            .eq('breed', dogDetails.breed)
            .neq('id', dogId)
            .limit(20);
            
          if (otherDogsOfBreed) {
            // Get genetic test data
            const dogGeneticPromises = otherDogsOfBreed.map(dog => 
              supabase
                .from('dog_genetic_tests')
                .select('*')
                .eq('dog_id', dog.id)
            );
            
            const results = await Promise.all(dogGeneticPromises);
            
            // Process results
            const dogsWithGenetics = otherDogsOfBreed
              .filter((dog, index) => results[index].data && results[index].data.length > 0)
              .map((dog, index) => ({
                ...dog,
                tests: results[index].data
              }));
              
            setOtherDogs(dogsWithGenetics);
          }
        }
      } catch (err) {
        console.error('Error fetching other dogs:', err);
      } finally {
        setIsLoadingOtherDogs(false);
      }
    }
    
    fetchOtherDogs();
  }, [dogId]);
  
  if (loading || isLoadingOtherDogs) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded"></div>
        <div className="grid grid-cols-3 gap-4">
          <div className="h-64 bg-gray-200 rounded-md col-span-3"></div>
        </div>
      </div>
    );
  }
  
  if (error || !data) {
    return (
      <div className="text-center p-8">
        <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-lg font-medium mb-2">Error Loading Genetic Data</h3>
        <p className="text-sm text-gray-600">
          There was a problem loading the genetic data for trait analysis.
        </p>
      </div>
    );
  }
  
  const getTraitValue = (dog: any, trait: string) => {
    if (!dog) return 'Unknown';
    
    if (trait === 'baseColor') return dog.baseColor || 'Unknown';
    if (trait === 'brownDilution') return dog.brownDilution || 'Unknown';
    if (trait === 'dilution') return dog.dilution || 'Unknown';
    if (trait === 'agouti') return dog.agouti || 'Unknown';
    
    // For health markers
    if (dog.healthMarkers && dog.healthMarkers[trait]) {
      return dog.healthMarkers[trait].status;
    }
    
    return 'Unknown';
  };
  
  // Get available traits for selection
  const availableTraits = [
    { id: 'baseColor', name: 'Base Color (E Locus)' },
    { id: 'brownDilution', name: 'Brown Dilution (B Locus)' },
    { id: 'dilution', name: 'Dilution (D Locus)' },
    { id: 'agouti', name: 'Agouti (A Locus)' },
    ...Object.keys(data.healthMarkers || {}).map(marker => ({
      id: marker,
      name: marker
    }))
  ];
  
  const getColorForHealthStatus = (status: string) => {
    switch (status) {
      case 'clear': return 'bg-green-100 border-green-300';
      case 'carrier': return 'bg-yellow-100 border-yellow-300';
      case 'affected': return 'bg-red-100 border-red-300';
      default: return 'bg-gray-100 border-gray-300';
    }
  };
  
  const renderColor = (trait: string, value: string) => {
    // For health markers
    if (['clear', 'carrier', 'affected'].includes(value)) {
      return getColorForHealthStatus(value);
    }
    
    // For color loci, basic colors for now
    if (trait === 'baseColor') {
      if (value.includes('E/E')) return 'bg-amber-900 border-amber-950 text-white';
      if (value.includes('E/e')) return 'bg-amber-700 border-amber-800 text-white';
      if (value.includes('e/e')) return 'bg-amber-300 border-amber-400';
    }
    
    if (trait === 'brownDilution') {
      if (value.includes('B/B')) return 'bg-brown-900 border-brown-950 text-white';
      if (value.includes('B/b')) return 'bg-brown-700 border-brown-800 text-white';
      if (value.includes('b/b')) return 'bg-brown-300 border-brown-400';
    }
    
    if (trait === 'dilution') {
      if (value.includes('D/D')) return 'bg-slate-900 border-slate-950 text-white';
      if (value.includes('D/d')) return 'bg-slate-700 border-slate-800 text-white';
      if (value.includes('d/d')) return 'bg-slate-300 border-slate-400';
    }
    
    if (trait === 'agouti') {
      if (value.includes('a/a')) return 'bg-gray-900 border-gray-950 text-white';
      if (value.includes('A/a')) return 'bg-gray-700 border-gray-800 text-white';
      if (value.includes('A/A')) return 'bg-gray-300 border-gray-400';
    }
    
    return 'bg-white border-gray-200';
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-lg font-medium">
          <Grid2X2 className="h-5 w-5 mr-2" /> Multi-Trait Analysis
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <Tabs defaultValue="matrix">
          <TabsList>
            <TabsTrigger value="matrix">Matrix View</TabsTrigger>
            <TabsTrigger value="punnett">Punnett Squares</TabsTrigger>
          </TabsList>
          
          <TabsContent value="matrix" className="pt-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="trait1">Primary Trait</Label>
                <Select
                  value={selectedTrait1}
                  onValueChange={setSelectedTrait1}
                >
                  <SelectTrigger id="trait1">
                    <SelectValue placeholder="Select trait" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableTraits.map(trait => (
                      <SelectItem key={trait.id} value={trait.id}>
                        {trait.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="trait2">Secondary Trait</Label>
                <Select
                  value={selectedTrait2}
                  onValueChange={setSelectedTrait2}
                >
                  <SelectTrigger id="trait2">
                    <SelectValue placeholder="Select trait" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableTraits.map(trait => (
                      <SelectItem key={trait.id} value={trait.id}>
                        {trait.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="breedFilter">Breed Filter</Label>
              <Input
                id="breedFilter"
                value={breedFilter}
                onChange={(e) => setBreedFilter(e.target.value)}
                placeholder="Filter by breed"
              />
            </div>
            
            <div className="mt-4 overflow-x-auto">
              <div className="trait-matrix border rounded-md p-4">
                {/* Current dog */}
                <div className={`p-3 border rounded-md text-center ${renderColor(selectedTrait1, getTraitValue(data, selectedTrait1))}`}>
                  <div className="font-bold">{data ? data.dogId.substring(0, 8) : 'Unknown'}</div>
                  <div className="text-xs">
                    {getTraitValue(data, selectedTrait1)} / {getTraitValue(data, selectedTrait2)}
                  </div>
                </div>
                
                {/* Other dogs */}
                {otherDogs.filter(dog => !breedFilter || dog.breed.toLowerCase().includes(breedFilter.toLowerCase())).map(dog => {
                  const processedDog = {
                    dogId: dog.id,
                    baseColor: 'Unknown',
                    brownDilution: 'Unknown',
                    dilution: 'Unknown',
                    agouti: 'Unknown',
                    healthMarkers: {}
                  };
                  
                  // Process color traits from tests
                  if (dog.tests) {
                    const colorTest = dog.tests.find((t: any) => t.test_type === 'Color Panel');
                    if (colorTest) {
                      const colorResults = colorTest.result.split(', ');
                      colorResults.forEach((result: string) => {
                        if (result.startsWith('E')) processedDog.baseColor = result;
                        if (result.startsWith('B')) processedDog.brownDilution = result;
                        if (result.startsWith('D')) processedDog.dilution = result;
                        if (result.startsWith('a')) processedDog.agouti = result;
                      });
                    }
                    
                    // Process health markers
                    dog.tests.forEach((test: any) => {
                      if (test.test_type !== 'Color Panel') {
                        const resultMatch = test.result.match(/^(\w+)\s*\(([^)]+)\)$/);
                        if (resultMatch) {
                          const [, status, genotype] = resultMatch;
                          
                          let standardStatus: 'clear' | 'carrier' | 'affected' | 'unknown' = 'unknown';
                          if (status.toLowerCase() === 'clear' || status.toLowerCase() === 'normal') {
                            standardStatus = 'clear';
                          } else if (status.toLowerCase() === 'carrier') {
                            standardStatus = 'carrier';
                          } else if (status.toLowerCase() === 'affected' || status.toLowerCase() === 'positive') {
                            standardStatus = 'affected';
                          }
                          
                          // @ts-ignore - Dynamic property
                          processedDog.healthMarkers[test.test_type] = {
                            status: standardStatus,
                            genotype
                          };
                        }
                      }
                    });
                  }
                  
                  return (
                    <div 
                      key={dog.id}
                      className={`p-3 border rounded-md text-center ${renderColor(selectedTrait1, getTraitValue(processedDog, selectedTrait1))}`}
                    >
                      <div className="font-bold">{dog.name}</div>
                      <div className="text-xs">
                        {getTraitValue(processedDog, selectedTrait1)} / {getTraitValue(processedDog, selectedTrait2)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="punnett" className="pt-4">
            <div className="text-center p-8 text-muted-foreground">
              Punnett square analysis coming soon
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default MultiTraitMatrix;
