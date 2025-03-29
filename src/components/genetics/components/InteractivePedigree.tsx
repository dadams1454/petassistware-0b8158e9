
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Toggle } from '@/components/ui/toggle';
import { Family, AlertCircle, Filter, Dna } from 'lucide-react';
import { InteractivePedigreeProps } from '@/types/genetics';
import { supabase } from '@/integrations/supabase/client';
import { processGeneticData } from '@/services/genetics/processGeneticData';
import { getStatusColor } from '../utils/healthUtils';

export const InteractivePedigree: React.FC<InteractivePedigreeProps> = ({
  dogId,
  currentDog,
  generations = 3
}) => {
  const [pedigreeData, setPedigreeData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [availableFilters, setAvailableFilters] = useState<{id: string, name: string}[]>([]);
  const [visibleGenerations, setVisibleGenerations] = useState(3);
  
  useEffect(() => {
    async function fetchPedigree() {
      setLoading(true);
      try {
        const data = await buildPedigree(dogId, generations);
        setPedigreeData(data);
        
        // Extract available health tests for filters
        const allHealthMarkers = new Set<string>();
        
        // Recursively extract health markers
        function extractMarkers(node: any) {
          if (!node) return;
          
          // Check for genetic tests
          if (node.geneticTests && node.geneticTests.length > 0) {
            node.geneticTests.forEach((test: any) => {
              if (test.test_type !== 'Color Panel') {
                allHealthMarkers.add(test.test_type);
              }
            });
          }
          
          // Check children
          if (node.sire) extractMarkers(node.sire);
          if (node.dam) extractMarkers(node.dam);
        }
        
        extractMarkers(data);
        
        // Set available filters
        const filters = Array.from(allHealthMarkers).map(marker => ({
          id: marker,
          name: marker
        }));
        
        setAvailableFilters(filters);
      } catch (err) {
        console.error('Error fetching pedigree:', err);
        setError('Failed to load pedigree data');
      } finally {
        setLoading(false);
      }
    }
    
    fetchPedigree();
  }, [dogId, generations]);
  
  // Build pedigree tree recursively
  async function buildPedigree(id: string, depth: number): Promise<any> {
    if (depth <= 0 || !id) return null;
    
    try {
      // Get dog details
      const { data: dog, error: dogError } = await supabase
        .from('dogs')
        .select('*')
        .eq('id', id)
        .single();
      
      if (dogError) throw dogError;
      
      // Get genetic test data
      const { data: geneticTests, error: testError } = await supabase
        .from('dog_genetic_tests')
        .select('*')
        .eq('dog_id', id);
      
      if (testError) throw testError;
      
      // Process genetic data
      let processedGenetics = null;
      if (geneticTests && geneticTests.length > 0) {
        processedGenetics = processGeneticData({
          dogId: id,
          tests: geneticTests
        });
      }
      
      // Get relationship information
      const { data: relationships, error: relError } = await supabase
        .from('dog_relationships')
        .select('*')
        .eq('dog_id', id);
      
      if (relError) throw relError;
      
      // Find sire and dam
      let sireId = null;
      let damId = null;
      
      if (relationships) {
        relationships.forEach(rel => {
          if (rel.relationship_type === 'sire') {
            sireId = rel.related_dog_id;
          } else if (rel.relationship_type === 'dam') {
            damId = rel.related_dog_id;
          }
        });
      }
      
      // Recursively build sire and dam
      const [sire, dam] = await Promise.all([
        sireId ? buildPedigree(sireId, depth - 1) : null,
        damId ? buildPedigree(damId, depth - 1) : null
      ]);
      
      return {
        id,
        name: dog.name,
        gender: dog.gender,
        breed: dog.breed,
        color: dog.color,
        birthdate: dog.birthdate,
        photoUrl: dog.photo_url,
        geneticTests: geneticTests || [],
        processedGenetics,
        sire,
        dam,
        depth: generations - depth + 1
      };
    } catch (err) {
      console.error(`Error building pedigree for ${id}:`, err);
      return null;
    }
  }
  
  const toggleFilter = (filterId: string) => {
    setActiveFilters(prev => 
      prev.includes(filterId) 
        ? prev.filter(f => f !== filterId)
        : [...prev, filterId]
    );
  };
  
  // Check if a dog has a specific health marker status based on filters
  const hasFilteredStatus = (dog: any, filters: string[]) => {
    if (!dog || !dog.geneticTests || !filters.length) return false;
    
    return dog.geneticTests.some((test: any) => 
      filters.includes(test.test_type) && 
      test.result.toLowerCase().includes('affected')
    );
  };
  
  // Get genetic status for a specific filter
  const getGeneticStatus = (dog: any, filter: string) => {
    if (!dog || !dog.geneticTests) return null;
    
    const test = dog.geneticTests.find((t: any) => t.test_type === filter);
    if (!test) return null;
    
    const resultLower = test.result.toLowerCase();
    if (resultLower.includes('clear')) return 'clear';
    if (resultLower.includes('carrier')) return 'carrier';
    if (resultLower.includes('affected')) return 'affected';
    return null;
  };
  
  const renderPedigreeNode = (node: any, depth = 0) => {
    if (!node) {
      return (
        <div className="pedigree-node-empty">
          <div className="w-32 h-20 bg-gray-100 rounded-md border-2 border-dashed border-gray-300 flex items-center justify-center">
            <span className="text-gray-400 text-xs">Unknown</span>
          </div>
        </div>
      );
    }
    
    // Skip rendering if beyond visible generations
    if (node.depth > visibleGenerations) return null;
    
    // Check if this dog is highlighted by any active filters
    const isHighlighted = activeFilters.length > 0 && 
      activeFilters.some(filter => getGeneticStatus(node, filter) === 'affected');
    
    const hasCarrier = activeFilters.length > 0 && 
      activeFilters.some(filter => getGeneticStatus(node, filter) === 'carrier');
      
    let highlightClass = '';
    if (isHighlighted) highlightClass = 'ring-2 ring-red-500';
    else if (hasCarrier) highlightClass = 'ring-2 ring-yellow-500';
    
    return (
      <div className="pedigree-node">
        <div className={`w-32 p-2 border rounded-md bg-white ${highlightClass}`}>
          <div className="text-sm font-medium truncate mb-1">{node.name}</div>
          <div className="flex justify-between items-center">
            <Badge variant="outline" className="text-xs">
              {node.gender}
            </Badge>
            {node.geneticTests && node.geneticTests.length > 0 && (
              <Dna className="h-3 w-3 text-primary" />
            )}
          </div>
          
          {/* Display test statuses for active filters */}
          {activeFilters.length > 0 && (
            <div className="mt-1 flex flex-wrap gap-1">
              {activeFilters.map(filter => {
                const status = getGeneticStatus(node, filter);
                if (!status) return null;
                
                return (
                  <div 
                    key={filter}
                    className={`w-2 h-2 rounded-full ${getStatusColor(status)}`}
                    title={`${filter}: ${status}`}
                  />
                );
              })}
            </div>
          )}
        </div>
        
        {(node.sire || node.dam) && (
          <div className="pedigree-children">
            {renderPedigreeNode(node.sire, depth + 1)}
            {renderPedigreeNode(node.dam, depth + 1)}
          </div>
        )}
      </div>
    );
  };
  
  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }
  
  if (error || !pedigreeData) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h3 className="text-lg font-medium mb-2">Pedigree Data Not Available</h3>
          <p className="text-sm text-gray-600 mb-4">
            {error || "Unable to display pedigree for this dog."}
          </p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-lg font-medium">
          <Family className="h-5 w-5 mr-2" /> Interactive Pedigree
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="mb-4 space-y-2">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4" />
            <span className="text-sm font-medium">Health Filters:</span>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {availableFilters.map(filter => (
              <Toggle
                key={filter.id}
                pressed={activeFilters.includes(filter.id)}
                onPressedChange={() => toggleFilter(filter.id)}
                size="sm"
              >
                {filter.name}
              </Toggle>
            ))}
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">Generations:</span>
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map(gen => (
                <Button
                  key={gen}
                  variant={visibleGenerations === gen ? "default" : "outline"}
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => setVisibleGenerations(gen)}
                >
                  {gen}
                </Button>
              ))}
            </div>
          </div>
        </div>
        
        <div className="pedigree-tree">
          {renderPedigreeNode(pedigreeData)}
        </div>
        
        <div className="mt-4 border-t pt-4">
          <div className="text-sm font-medium mb-2">Legend:</div>
          <div className="flex flex-wrap gap-4 text-xs">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-1" />
              <span>Clear</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-yellow-500 mr-1" />
              <span>Carrier</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-red-500 mr-1" />
              <span>Affected</span>
            </div>
          </div>
        </div>
      </CardContent>
      
      <style jsx>
        {`
          .pedigree-tree {
            display: flex;
            padding: 1rem;
            min-width: 800px;
            overflow-x: auto;
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
            position: relative;
          }
          
          .pedigree-children::before {
            content: '';
            position: absolute;
            top: 50%;
            left: -1rem;
            width: 1rem;
            height: 1px;
            background-color: #d1d5db;
          }
          
          .pedigree-node-empty {
            margin: 0.5rem;
          }
        `}
      </style>
    </Card>
  );
};

export default InteractivePedigree;
