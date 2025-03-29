
import React, { useState } from 'react';
import { DogGenotype } from '@/types/genetics';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { formatConditionName } from '../utils/healthUtils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Toggle } from '@/components/ui/toggle';
import { Skeleton } from '@/components/ui/skeleton';
import { Info } from 'lucide-react';

interface InteractivePedigreeProps {
  dogId: string;
  generations?: number;
}

interface PedigreeNode {
  id: string;
  name: string;
  color?: string;
  breed?: string;
  gender?: string;
  healthMarkers?: Record<string, { status: string; genotype: string }>;
  children?: PedigreeNode[];
}

export const InteractivePedigree: React.FC<InteractivePedigreeProps> = ({ 
  dogId,
  generations = 3
}) => {
  const [selectedHealthMarker, setSelectedHealthMarker] = useState<string | null>(null);
  const [showCarriers, setShowCarriers] = useState(true);
  const [showAffected, setShowAffected] = useState(true);
  const [showClear, setShowClear] = useState(true);
  
  // Fetch pedigree data
  const { data: pedigree, isLoading, error } = useQuery({
    queryKey: ['pedigree', dogId, generations],
    queryFn: async () => {
      // Function to recursively fetch ancestors
      async function fetchAncestors(id: string, gen: number): Promise<PedigreeNode | null> {
        if (gen > generations || !id) return null;
        
        // Fetch the dog
        const { data: dog, error: dogError } = await supabase
          .from('dogs')
          .select('id, name, breed, gender, color')
          .eq('id', id)
          .single();
        
        if (dogError || !dog) return null;
        
        // Fetch genetic data
        const { data: geneticTests, error: geneticError } = await supabase
          .from('dog_genetic_tests')
          .select('*')
          .eq('dog_id', id);
          
        // Process health markers
        const healthMarkers: Record<string, { status: string; genotype: string }> = {};
        if (!geneticError && geneticTests) {
          geneticTests.forEach(test => {
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
        }
        
        // Fetch relationships
        const { data: relationships, error: relError } = await supabase
          .from('dog_relationships')
          .select('related_dog_id, relationship_type')
          .eq('dog_id', id);
        
        if (relError) return { ...dog, healthMarkers };
        
        // Find sire and dam
        const sireRel = relationships?.find(r => r.relationship_type === 'sire');
        const damRel = relationships?.find(r => r.relationship_type === 'dam');
        
        // Recursively fetch parents
        const sire = sireRel ? await fetchAncestors(sireRel.related_dog_id, gen + 1) : null;
        const dam = damRel ? await fetchAncestors(damRel.related_dog_id, gen + 1) : null;
        
        // Create node with children
        return {
          ...dog,
          healthMarkers,
          children: [sire, dam].filter(Boolean) as PedigreeNode[]
        };
      }
      
      return await fetchAncestors(dogId, 1);
    }
  });
  
  // Get unique health markers across the pedigree
  const allHealthMarkers = React.useMemo(() => {
    const markers = new Set<string>();
    
    function traversePedigree(node: PedigreeNode | null) {
      if (!node) return;
      
      if (node.healthMarkers) {
        Object.keys(node.healthMarkers).forEach(marker => markers.add(marker));
      }
      
      if (node.children) {
        node.children.forEach(child => traversePedigree(child));
      }
    }
    
    traversePedigree(pedigree || null);
    return Array.from(markers);
  }, [pedigree]);
  
  // Render a pedigree node
  const renderNode = (node: PedigreeNode | null, depth: number = 0) => {
    if (!node) {
      return (
        <div className="pedigree-node-empty">
          <div className="h-24 w-48 border border-dashed rounded-md flex items-center justify-center text-gray-400">
            Unknown
          </div>
        </div>
      );
    }
    
    // Get color class based on health marker if selected
    let healthStatus = null;
    if (selectedHealthMarker && node.healthMarkers && node.healthMarkers[selectedHealthMarker]) {
      const status = node.healthMarkers[selectedHealthMarker].status;
      
      // Only show nodes based on filter settings
      if ((status === 'carrier' && !showCarriers) ||
          (status === 'affected' && !showAffected) ||
          (status === 'clear' && !showClear)) {
        healthStatus = 'filtered';
      } else {
        healthStatus = status;
      }
    }
    
    // Style based on health status
    const getNodeClass = () => {
      if (!healthStatus) return 'bg-white';
      if (healthStatus === 'filtered') return 'opacity-30 bg-gray-100';
      if (healthStatus === 'carrier') return 'bg-yellow-50 border-yellow-300';
      if (healthStatus === 'affected') return 'bg-red-50 border-red-300';
      if (healthStatus === 'clear') return 'bg-green-50 border-green-300';
      return 'bg-white';
    };
    
    return (
      <div className="pedigree-node">
        <div 
          className={`h-24 w-48 p-2 border rounded-md shadow-sm flex flex-col justify-between ${getNodeClass()}`}
        >
          <div className="font-medium truncate">{node.name}</div>
          <div className="text-xs text-gray-500 flex flex-col">
            <span>{node.breed}</span>
            <span>{node.gender} • {node.color}</span>
            
            {healthStatus && healthStatus !== 'filtered' && (
              <Badge 
                className={`mt-1 self-start ${
                  healthStatus === 'carrier' ? 'bg-yellow-100 text-yellow-800' :
                  healthStatus === 'affected' ? 'bg-red-100 text-red-800' :
                  'bg-green-100 text-green-800'
                }`}
              >
                {healthStatus}
              </Badge>
            )}
          </div>
        </div>
        
        {depth < generations - 1 && node.children?.length > 0 && (
          <div className="pedigree-children">
            {renderNode(node.children[0], depth + 1)}
            {renderNode(node.children[1], depth + 1)}
          </div>
        )}
      </div>
    );
  };
  
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }
  
  if (error || !pedigree) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="text-red-500 mb-2">Failed to load pedigree data</div>
          <p className="text-sm text-gray-500">
            Please make sure the dog has relationship data available.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-4">
      <Tabs defaultValue="pedigree">
        <TabsList>
          <TabsTrigger value="pedigree">Pedigree View</TabsTrigger>
          <TabsTrigger value="health">Health Analysis</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pedigree" className="space-y-4">
          <div className="flex flex-wrap gap-2 items-center">
            <div className="font-medium">Highlight health marker:</div>
            <select 
              className="border rounded-md px-2 py-1"
              value={selectedHealthMarker || ''}
              onChange={e => setSelectedHealthMarker(e.target.value || null)}
            >
              <option value="">None</option>
              {allHealthMarkers.map(marker => (
                <option key={marker} value={marker}>
                  {formatConditionName(marker)}
                </option>
              ))}
            </select>
            
            {selectedHealthMarker && (
              <div className="flex items-center gap-2 ml-4">
                <Toggle 
                  pressed={showClear} 
                  onPressedChange={setShowClear}
                  className="bg-green-100 data-[state=on]:bg-green-200"
                >
                  Clear
                </Toggle>
                <Toggle 
                  pressed={showCarriers} 
                  onPressedChange={setShowCarriers}
                  className="bg-yellow-100 data-[state=on]:bg-yellow-200"
                >
                  Carriers
                </Toggle>
                <Toggle 
                  pressed={showAffected} 
                  onPressedChange={setShowAffected}
                  className="bg-red-100 data-[state=on]:bg-red-200"
                >
                  Affected
                </Toggle>
              </div>
            )}
          </div>
          
          <div className="pedigree-container overflow-auto border rounded-lg p-4">
            <div className="pedigree-tree">
              {renderNode(pedigree)}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="health" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Genetic Health Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {allHealthMarkers.length === 0 ? (
                  <div className="flex items-center justify-center p-4 text-gray-500">
                    <Info className="h-5 w-5 mr-2" />
                    <span>No health test data available for this pedigree</span>
                  </div>
                ) : (
                  allHealthMarkers.map(marker => {
                    // Count occurrences of each status for this marker
                    let totalDogs = 0;
                    let clearCount = 0;
                    let carrierCount = 0;
                    let affectedCount = 0;
                    
                    function countStatuses(node: PedigreeNode | null) {
                      if (!node) return;
                      
                      totalDogs++;
                      if (node.healthMarkers && node.healthMarkers[marker]) {
                        const status = node.healthMarkers[marker].status;
                        if (status === 'clear') clearCount++;
                        else if (status === 'carrier') carrierCount++;
                        else if (status === 'affected') affectedCount++;
                      }
                      
                      if (node.children) {
                        node.children.forEach(child => countStatuses(child));
                      }
                    }
                    
                    countStatuses(pedigree);
                    
                    // Calculate percentages
                    const testedDogs = clearCount + carrierCount + affectedCount;
                    const clearPercent = testedDogs ? (clearCount / testedDogs * 100).toFixed(1) : "0";
                    const carrierPercent = testedDogs ? (carrierCount / testedDogs * 100).toFixed(1) : "0";
                    const affectedPercent = testedDogs ? (affectedCount / testedDogs * 100).toFixed(1) : "0";
                    
                    return (
                      <div key={marker} className="space-y-2">
                        <h3 className="font-medium">{formatConditionName(marker)}</h3>
                        
                        <div className="h-4 w-full rounded-full bg-gray-100 overflow-hidden flex">
                          {clearCount > 0 && (
                            <div 
                              className="h-full bg-green-500" 
                              style={{ width: `${clearPercent}%` }}
                              title={`${clearCount} dogs clear (${clearPercent}%)`}
                            />
                          )}
                          {carrierCount > 0 && (
                            <div 
                              className="h-full bg-yellow-500" 
                              style={{ width: `${carrierPercent}%` }}
                              title={`${carrierCount} dogs carriers (${carrierPercent}%)`}
                            />
                          )}
                          {affectedCount > 0 && (
                            <div 
                              className="h-full bg-red-500" 
                              style={{ width: `${affectedPercent}%` }}
                              title={`${affectedCount} dogs affected (${affectedPercent}%)`}
                            />
                          )}
                        </div>
                        
                        <div className="flex justify-between text-xs text-gray-500">
                          <div>
                            <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-1"></span>
                            Clear: {clearCount} ({clearPercent}%)
                          </div>
                          <div>
                            <span className="inline-block w-3 h-3 bg-yellow-500 rounded-full mr-1"></span>
                            Carriers: {carrierCount} ({carrierPercent}%)
                          </div>
                          <div>
                            <span className="inline-block w-3 h-3 bg-red-500 rounded-full mr-1"></span>
                            Affected: {affectedCount} ({affectedPercent}%)
                          </div>
                        </div>
                        
                        <div className="text-sm text-gray-600">
                          {testedDogs} of {totalDogs} dogs tested ({(testedDogs / totalDogs * 100).toFixed(1)}%)
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <style jsx>{`
        .pedigree-tree {
          display: flex;
          padding: 1rem;
        }
        
        .pedigree-node {
          display: flex;
          flex-direction: row;
          align-items: flex-start;
          margin: 0.5rem;
        }
        
        .pedigree-children {
          display: flex;
          flex-direction: column;
          margin-left: 2rem;
        }
        
        .pedigree-node-empty {
          margin: 0.5rem;
        }
      `}</style>
    </div>
  );
};

export default InteractivePedigree;
