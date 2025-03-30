
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase, customSupabase } from '@/integrations/supabase/client';
import { GeneticHealthStatus } from '@/types/genetics';
import { getStatusColor } from '../utils/healthUtils';

interface FamilyMember {
  id: string;
  name: string;
  gender: 'male' | 'female';
  birthdate?: string;
  genetic_health?: Record<string, GeneticHealthStatus>;
  parentId?: string;
  level: number;
  position: number;
}

export interface InteractivePedigreeProps {
  dogId: string;
  currentDog?: any;
  generations?: number;
}

export const InteractivePedigree: React.FC<InteractivePedigreeProps> = ({
  dogId,
  currentDog,
  generations = 3
}) => {
  const [pedigreeData, setPedigreeData] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleGenerations, setVisibleGenerations] = useState(generations);
  const [healthMarkers, setHealthMarkers] = useState<Record<string, Record<string, GeneticHealthStatus>>>({});
  
  // Fetch pedigree data when the component mounts
  useEffect(() => {
    const fetchPedigree = async () => {
      if (!dogId) return;
      
      try {
        setLoading(true);
        
        // Get the dog's relationships
        const { data: relationships, error: relationshipsError } = await supabase
          .from('dog_relationships')
          .select('*')
          .or(`dog_id.eq.${dogId},related_dog_id.eq.${dogId}`);
        
        if (relationshipsError) throw relationshipsError;
        
        // Get the related dogs
        const relatedDogIds = relationships.map(rel => 
          rel.dog_id === dogId ? rel.related_dog_id : rel.dog_id
        );
        
        // Add the current dog
        relatedDogIds.push(dogId);
        
        // Fetch all the dogs
        const { data: dogData, error: dogError } = await supabase
          .from('dogs')
          .select('*')
          .in('id', relatedDogIds);
        
        if (dogError) throw dogError;
        
        // Fetch genetic health data
        const healthData: Record<string, Record<string, GeneticHealthStatus>> = {};
        
        for (const id of relatedDogIds) {
          try {
            const { data: geneticTests, error: geneticError } = await supabase
              .from('dog_genetic_tests')
              .select('*')
              .eq('dog_id', id);
            
            if (!geneticError && geneticTests) {
              healthData[id] = {};
              
              geneticTests.forEach((test: any) => {
                if (test.test_type !== 'Color Panel') {
                  // Extract status from result string
                  const resultMatch = test.result?.match(/^(clear|carrier|affected)/i);
                  if (resultMatch) {
                    const status = resultMatch[1].toLowerCase() as GeneticHealthStatus;
                    healthData[id][test.test_type] = status;
                  }
                }
              });
            }
          } catch (err) {
            console.error('Error fetching genetic data:', err);
          }
        }
        
        setHealthMarkers(healthData);
        
        // Create the pedigree data structure
        const buildPedigree = (dogs: any[], relationships: any[]) => {
          // Find the current dog
          const currentDogData = dogs.find(dog => dog.id === dogId);
          if (!currentDogData) return [];
          
          // Create the family tree
          const familyTree: FamilyMember[] = [
            {
              id: currentDogData.id,
              name: currentDogData.name,
              gender: currentDogData.gender,
              birthdate: currentDogData.birthdate,
              level: 0,
              position: 0,
            }
          ];
          
          // Function to find parents
          const findParents = (dogId: string, level: number, position: number) => {
            // Find sire (father) relationship
            const sireRel = relationships.find(rel => 
              (rel.dog_id === dogId && rel.relationship_type === 'sire') || 
              (rel.related_dog_id === dogId && rel.relationship_type === 'offspring' && 
               dogs.find(d => d.id === rel.dog_id)?.gender === 'male')
            );
            
            // Find dam (mother) relationship
            const damRel = relationships.find(rel => 
              (rel.dog_id === dogId && rel.relationship_type === 'dam') || 
              (rel.related_dog_id === dogId && rel.relationship_type === 'offspring' && 
               dogs.find(d => d.id === rel.dog_id)?.gender === 'female')
            );
            
            // Add sire if found
            if (sireRel) {
              const sireId = sireRel.dog_id === dogId ? sireRel.related_dog_id : sireRel.dog_id;
              const sireData = dogs.find(dog => dog.id === sireId);
              
              if (sireData && level < visibleGenerations) {
                const newPosition = position * 2 - 1;
                familyTree.push({
                  id: sireData.id,
                  name: sireData.name,
                  gender: 'male',
                  birthdate: sireData.birthdate,
                  parentId: dogId,
                  level: level + 1,
                  position: newPosition,
                });
                
                // Recursive call to find this sire's parents
                findParents(sireData.id, level + 1, newPosition);
              }
            }
            
            // Add dam if found
            if (damRel) {
              const damId = damRel.dog_id === dogId ? damRel.related_dog_id : damRel.dog_id;
              const damData = dogs.find(dog => dog.id === damId);
              
              if (damData && level < visibleGenerations) {
                const newPosition = position * 2;
                familyTree.push({
                  id: damData.id,
                  name: damData.name,
                  gender: 'female',
                  birthdate: damData.birthdate,
                  parentId: dogId,
                  level: level + 1,
                  position: newPosition,
                });
                
                // Recursive call to find this dam's parents
                findParents(damData.id, level + 1, newPosition);
              }
            }
          };
          
          // Start finding parents from the current dog
          findParents(dogId, 0, 0);
          
          return familyTree;
        };
        
        const pedigree = buildPedigree(dogData, relationships);
        setPedigreeData(pedigree);
      } catch (error) {
        console.error('Error fetching pedigree:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPedigree();
  }, [dogId, visibleGenerations]);
  
  const renderPedigreeTree = () => {
    if (loading) {
      return (
        <div className="animate-pulse space-y-4">
          <div className="h-64 bg-gray-200 rounded-md"></div>
        </div>
      );
    }
    
    if (pedigreeData.length === 0) {
      return (
        <div className="text-center p-8">
          <h3 className="text-lg font-medium mb-2">No Pedigree Data Available</h3>
          <p className="text-gray-500">There is no pedigree information available for this dog.</p>
        </div>
      );
    }
    
    const maxLevel = Math.min(visibleGenerations, 
      pedigreeData.reduce((max, member) => Math.max(max, member.level), 0)
    );
    
    // Calculate the width based on the maximum generation level
    const totalWidth = Math.pow(2, maxLevel) * 120;
    
    const calculatePosition = (level: number, position: number, totalWidth: number) => {
      const cellsInLevel = Math.pow(2, level);
      const cellWidth = totalWidth / cellsInLevel;
      return (position + 0.5) * cellWidth;
    };
    
    return (
      <div className="pedigree-container relative overflow-x-auto" style={{ minHeight: (maxLevel + 1) * 100 + 'px' }}>
        <svg className="pedigree-connections absolute" width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0, zIndex: 0 }}>
          {pedigreeData.map((member) => {
            if (member.parentId) {
              const parent = pedigreeData.find(p => p.id === member.parentId);
              if (parent) {
                const parentX = calculatePosition(parent.level, parent.position, totalWidth);
                const memberX = calculatePosition(member.level, member.position, totalWidth);
                const parentY = parent.level * 100 + 40;
                const memberY = member.level * 100 + 40;
                
                return (
                  <line 
                    key={`line-${parent.id}-${member.id}`}
                    x1={parentX} 
                    y1={parentY} 
                    x2={memberX} 
                    y2={memberY}
                    stroke="#CBD5E1"
                    strokeWidth="1.5"
                  />
                );
              }
            }
            return null;
          })}
        </svg>
        
        <div className="pedigree-nodes" style={{ width: totalWidth + 'px' }}>
          {pedigreeData.map((member) => {
            // Health indicators
            const hasHealthMarkers = healthMarkers[member.id] && Object.keys(healthMarkers[member.id]).length > 0;
            
            const dogHealthMarkers = healthMarkers[member.id] || {};
            
            return (
              <div 
                key={member.id}
                className="pedigree-node absolute"
                style={{ 
                  left: calculatePosition(member.level, member.position, totalWidth) - 60 + 'px',
                  top: member.level * 100 + 'px',
                  width: '120px',
                  zIndex: 1
                }}
              >
                <div 
                  className={`
                    flex flex-col items-center p-2 border rounded-md shadow-sm
                    ${member.gender === 'male' ? 'bg-blue-50 border-blue-200' : 'bg-pink-50 border-pink-200'}
                  `}
                >
                  <div className="text-sm font-medium truncate w-full text-center">{member.name}</div>
                  
                  {hasHealthMarkers && (
                    <div className="flex gap-1 mt-1">
                      {Object.entries(dogHealthMarkers).slice(0, 3).map(([test, status]) => (
                        <div 
                          key={test} 
                          className={`w-3 h-3 rounded-full ${getStatusColor(status)}`}
                          title={`${test}: ${status}`}
                        ></div>
                      ))}
                      {Object.keys(dogHealthMarkers).length > 3 && (
                        <div className="text-xs">+{Object.keys(dogHealthMarkers).length - 3}</div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg">Interactive Pedigree</CardTitle>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setVisibleGenerations(Math.max(1, visibleGenerations - 1))}
            disabled={visibleGenerations <= 1}
          >
            - Gen
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setVisibleGenerations(visibleGenerations + 1)}
            disabled={visibleGenerations >= 5}
          >
            + Gen
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {renderPedigreeTree()}
        
        <style>
          {`
          .pedigree-container {
            position: relative;
            overflow-x: auto;
            margin-top: 1rem;
          }
          
          .pedigree-nodes {
            position: relative;
            min-height: 400px;
          }
          
          .pedigree-node {
            transition: all 0.3s ease;
          }
          
          .health-marker-clear {
            background-color: #10B981;
          }
          
          .health-marker-carrier {
            background-color: #F59E0B;
          }
          
          .health-marker-affected {
            background-color: #EF4444;
          }
          `}
        </style>
      </CardContent>
    </Card>
  );
};

export default InteractivePedigree;
