
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DogGenotype } from '@/types/genetics';
import { Skeleton } from '@/components/ui/skeleton';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { formatConditionName } from '../utils/healthUtils';

interface MultiTraitMatrixProps {
  sireGenotype?: DogGenotype;
  damGenotype?: DogGenotype;
  dogId?: string;
}

export const MultiTraitMatrix: React.FC<MultiTraitMatrixProps> = ({ 
  sireGenotype,
  damGenotype,
  dogId
}) => {
  const [selectedGeneSets, setSelectedGeneSets] = useState<string[]>(['color', 'health']);
  
  // If dogId is provided, fetch its genetic data
  const { data: dogGenetics, isLoading, error } = useQuery({
    queryKey: ['dog-genetics', dogId],
    queryFn: async () => {
      if (!dogId) return null;
      
      // Fetch genetic test data
      const { data: tests, error } = await supabase
        .from('dog_genetic_tests')
        .select('*')
        .eq('dog_id', dogId);
      
      if (error) throw error;
      return tests || [];
    },
    enabled: !!dogId
  });
  
  // Generate Punnett square for 2 genes
  const renderPunnettSquare = (geneA: string[], geneB: string[]) => {
    return (
      <div className="punnet-square">
        <div className="grid grid-cols-3">
          <div className="col-span-1"></div>
          <div className="col-span-2 grid grid-cols-2">
            {geneB.map((allele, idx) => (
              <div key={idx} className="text-center font-medium p-2 bg-gray-100">
                {allele}
              </div>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-3">
          <div className="col-span-1 space-y-2">
            {geneA.map((allele, idx) => (
              <div key={idx} className="text-center font-medium p-2 bg-gray-100">
                {allele}
              </div>
            ))}
          </div>
          
          <div className="col-span-2 grid grid-cols-2 grid-rows-2 gap-1">
            {geneA.map((alleleA) => (
              geneB.map((alleleB, idx) => {
                // This would be more complex in a real implementation,
                // accounting for actual inheritance patterns
                const combination = sortAlleles(alleleA[0] + alleleB[0]) + '/' + 
                                    sortAlleles(alleleA[1] + alleleB[1]);
                
                return (
                  <div key={`${alleleA}-${alleleB}-${idx}`} className="p-2 bg-white border text-center">
                    {combination}
                  </div>
                );
              })
            )).flat()}
          </div>
        </div>
      </div>
    );
  };
  
  // Helper function to sort alleles (dominant first)
  const sortAlleles = (genotype: string): string => {
    if (genotype.length !== 2) return genotype;
    
    const alleles = genotype.split('');
    
    // Sort so capital (dominant) letters come first
    alleles.sort((a, b) => {
      if (a === a.toUpperCase() && b !== b.toUpperCase()) return -1;
      if (a !== a.toUpperCase() && b === b.toUpperCase()) return 1;
      return a.localeCompare(b);
    });
    
    return alleles.join('');
  };
  
  // Create a trait map for visualization
  const createHeatMap = () => {
    if ((!sireGenotype || !damGenotype) && !dogGenetics) {
      return (
        <div className="text-center p-4 text-gray-500">
          Select both a sire and a dam to view trait combinations
        </div>
      );
    }
    
    // Extract health markers
    let healthMarkers: any = {};
    
    if (dogGenetics && dogGenetics.length > 0) {
      // Process health markers from a single dog's test results
      dogGenetics.forEach((test: any) => {
        if (test.test_type !== 'Color Panel') {
          // Extract status and genotype from result string
          const resultMatch = test.result.match(/^(\w+)\s*\(([^)]+)\)$/);
          if (resultMatch) {
            const [, status, genotype] = resultMatch;
            
            // Map status text to our standard format
            let standardStatus: 'clear' | 'carrier' | 'affected' = 'clear';
            if (status.toLowerCase().includes('carrier')) {
              standardStatus = 'carrier';
            } else if (status.toLowerCase().includes('affected')) {
              standardStatus = 'affected';
            }
            
            healthMarkers[test.test_type] = {
              status: standardStatus,
              genotype
            };
          }
        }
      });
      
      // Render single dog health marker heatmap
      return (
        <div className="space-y-6">
          <h3 className="font-medium">Health Markers</h3>
          
          <div className="grid grid-cols-1 gap-4">
            {Object.entries(healthMarkers).length === 0 ? (
              <div className="text-center p-4 text-gray-500">
                No health test data available
              </div>
            ) : (
              <div className="space-y-2">
                {Object.entries(healthMarkers).map(([condition, data]: [string, any]) => (
                  <div key={condition} className="flex items-center border-b pb-2">
                    <div className="flex-1 font-medium">{formatConditionName(condition)}</div>
                    <div className="flex items-center">
                      <span className={`px-2 py-1 rounded-md text-sm ${
                        data.status === 'clear' ? 'bg-green-100 text-green-800' : 
                        data.status === 'carrier' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'
                      }`}>
                        {data.status}
                      </span>
                      <span className="ml-2 px-2 py-1 bg-gray-100 rounded-md text-sm font-mono">
                        {data.genotype}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      );
    }
    
    // If we have both parents, show trait inheritance visualization
    if (sireGenotype && damGenotype) {
      // In a real implementation, this would use the actual genetic data
      // to calculate probabilities of different trait combinations
      return (
        <div className="space-y-6">
          <div>
            <h3 className="font-medium mb-4">Color Inheritance Matrix</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="py-3">
                  <CardTitle className="text-sm">Base Color (E Locus)</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  {renderPunnettSquare(
                    sireGenotype.baseColor.split('/'),
                    damGenotype.baseColor.split('/')
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="py-3">
                  <CardTitle className="text-sm">Brown (B Locus)</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  {renderPunnettSquare(
                    sireGenotype.brownDilution.split('/'),
                    damGenotype.brownDilution.split('/')
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="py-3">
                  <CardTitle className="text-sm">Dilution (D Locus)</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  {renderPunnettSquare(
                    sireGenotype.dilution.split('/'),
                    damGenotype.dilution.split('/')
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium mb-4">Health Marker Inheritance</h3>
            <div className="space-y-4">
              {Object.keys(sireGenotype.healthMarkers).length === 0 && 
                Object.keys(damGenotype.healthMarkers).length === 0 ? (
                <div className="text-center p-4 text-gray-500">
                  No health test data available for comparison
                </div>
              ) : (
                Object.entries({
                  ...sireGenotype.healthMarkers,
                  ...damGenotype.healthMarkers
                }).map(([condition, _]) => {
                  const sireMarker = sireGenotype.healthMarkers[condition];
                  const damMarker = damGenotype.healthMarkers[condition];
                  
                  // Skip if either parent doesn't have this marker
                  if (!sireMarker || !damMarker) return null;
                  
                  let riskLevel = 'low';
                  let offspringStatus = 'Unknown';
                  
                  // Basic inheritance calculation
                  if (sireMarker.status === 'clear' && damMarker.status === 'clear') {
                    offspringStatus = '100% Clear';
                  } else if (sireMarker.status === 'affected' && damMarker.status === 'affected') {
                    offspringStatus = '100% Affected';
                    riskLevel = 'high';
                  } else if (
                    (sireMarker.status === 'carrier' && damMarker.status === 'carrier')
                  ) {
                    offspringStatus = '25% Affected, 50% Carrier, 25% Clear';
                    riskLevel = 'medium';
                  } else if (
                    (sireMarker.status === 'carrier' && damMarker.status === 'affected') ||
                    (sireMarker.status === 'affected' && damMarker.status === 'carrier')
                  ) {
                    offspringStatus = '50% Affected, 50% Carrier';
                    riskLevel = 'high';
                  } else if (
                    (sireMarker.status === 'clear' && damMarker.status === 'carrier') ||
                    (sireMarker.status === 'carrier' && damMarker.status === 'clear')
                  ) {
                    offspringStatus = '50% Carrier, 50% Clear';
                    riskLevel = 'low';
                  } else if (
                    (sireMarker.status === 'clear' && damMarker.status === 'affected') ||
                    (sireMarker.status === 'affected' && damMarker.status === 'clear')
                  ) {
                    offspringStatus = '100% Carrier';
                    riskLevel = 'medium';
                  }
                  
                  return (
                    <Card key={condition}>
                      <CardHeader className="py-3">
                        <CardTitle className="text-sm flex justify-between">
                          <span>{formatConditionName(condition)}</span>
                          <span className={`text-xs px-2 py-0.5 rounded ${
                            riskLevel === 'low' ? 'bg-green-100 text-green-800' :
                            riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1)} Risk
                          </span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="grid grid-cols-3 gap-4">
                          <div className="text-center">
                            <div className="font-medium text-sm mb-1">Sire</div>
                            <span className={`inline-block px-2 py-1 rounded-md text-xs ${
                              sireMarker.status === 'clear' ? 'bg-green-100 text-green-800' :
                              sireMarker.status === 'carrier' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {sireMarker.status}
                            </span>
                            <div className="text-xs mt-1 font-mono">{sireMarker.genotype}</div>
                          </div>
                          
                          <div className="text-center">
                            <div className="font-medium text-sm mb-1">Dam</div>
                            <span className={`inline-block px-2 py-1 rounded-md text-xs ${
                              damMarker.status === 'clear' ? 'bg-green-100 text-green-800' :
                              damMarker.status === 'carrier' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {damMarker.status}
                            </span>
                            <div className="text-xs mt-1 font-mono">{damMarker.genotype}</div>
                          </div>
                          
                          <div className="text-center">
                            <div className="font-medium text-sm mb-1">Offspring</div>
                            <div className="text-xs">{offspringStatus}</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                }).filter(Boolean)
              )}
            </div>
          </div>
        </div>
      );
    }
    
    return (
      <div className="text-center p-4 text-gray-500">
        No genetic data available
      </div>
    );
  };
  
  if (isLoading && dogId) {
    return <Skeleton className="h-80 w-full" />;
  }
  
  if (error && dogId) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="text-red-500 mb-2">Failed to load genetic data</div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Multi-Trait Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="heatmap">
          <TabsList>
            <TabsTrigger value="heatmap">Trait Matrix</TabsTrigger>
            <TabsTrigger value="punnett">Punnett Squares</TabsTrigger>
          </TabsList>
          
          <TabsContent value="heatmap" className="pt-4">
            {createHeatMap()}
          </TabsContent>
          
          <TabsContent value="punnett" className="pt-4">
            <div className="space-y-4">
              <div className="border-b pb-2">
                <div className="font-medium mb-2">Select traits to analyze:</div>
                <div className="flex flex-wrap gap-2">
                  {['color', 'health', 'size', 'coat'].map(category => (
                    <button
                      key={category}
                      className={`px-3 py-1 rounded-full text-sm ${
                        selectedGeneSets.includes(category) 
                          ? 'bg-primary text-white' 
                          : 'bg-gray-100 text-gray-700'
                      }`}
                      onClick={() => {
                        if (selectedGeneSets.includes(category)) {
                          setSelectedGeneSets(selectedGeneSets.filter(c => c !== category));
                        } else {
                          setSelectedGeneSets([...selectedGeneSets, category]);
                        }
                      }}
                    >
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              
              {(!sireGenotype || !damGenotype) ? (
                <div className="text-center p-4 text-gray-500">
                  Select both a sire and a dam to view Punnett squares
                </div>
              ) : (
                <>
                  {selectedGeneSets.includes('color') && (
                    <div>
                      <h3 className="font-medium mb-2">Color Genetics</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card>
                          <CardHeader className="py-2">
                            <CardTitle className="text-sm">E Locus (Black/Red)</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-3 gap-2">
                              <div className="col-span-1 bg-gray-100 p-2 flex justify-center items-center text-sm">
                                <div>
                                  <div>Sire: {sireGenotype.baseColor}</div>
                                  <div>Dam: {damGenotype.baseColor}</div>
                                </div>
                              </div>
                              <div className="col-span-2 p-2 border">
                                <table className="w-full">
                                  <thead>
                                    <tr>
                                      <th className="w-1/6"></th>
                                      {damGenotype.baseColor.split('/').map((allele, i) => (
                                        <th key={i} className="w-2/6 text-center p-1 bg-gray-50">{allele}</th>
                                      ))}
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {sireGenotype.baseColor.split('/').map((sireAllele, i) => (
                                      <tr key={i}>
                                        <th className="text-center p-1 bg-gray-50">{sireAllele}</th>
                                        {damGenotype.baseColor.split('/').map((damAllele, j) => {
                                          const offspring = sortAlleles(sireAllele + damAllele);
                                          return (
                                            <td key={j} className="text-center p-1 border">
                                              {offspring}
                                            </td>
                                          );
                                        })}
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardHeader className="py-2">
                            <CardTitle className="text-sm">D Locus (Dilution)</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-3 gap-2">
                              <div className="col-span-1 bg-gray-100 p-2 flex justify-center items-center text-sm">
                                <div>
                                  <div>Sire: {sireGenotype.dilution}</div>
                                  <div>Dam: {damGenotype.dilution}</div>
                                </div>
                              </div>
                              <div className="col-span-2 p-2 border">
                                <table className="w-full">
                                  <thead>
                                    <tr>
                                      <th className="w-1/6"></th>
                                      {damGenotype.dilution.split('/').map((allele, i) => (
                                        <th key={i} className="w-2/6 text-center p-1 bg-gray-50">{allele}</th>
                                      ))}
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {sireGenotype.dilution.split('/').map((sireAllele, i) => (
                                      <tr key={i}>
                                        <th className="text-center p-1 bg-gray-50">{sireAllele}</th>
                                        {damGenotype.dilution.split('/').map((damAllele, j) => {
                                          const offspring = sortAlleles(sireAllele + damAllele);
                                          return (
                                            <td key={j} className="text-center p-1 border">
                                              {offspring}
                                            </td>
                                          );
                                        })}
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  )}
                  
                  {selectedGeneSets.includes('health') && (
                    <div>
                      <h3 className="font-medium mb-2">Health Genetics</h3>
                      {/* Similar Punnett square displays for health markers */}
                      <div className="text-sm text-gray-500 italic">
                        Health markers would display similar Punnett squares for each tested condition
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default MultiTraitMatrix;
