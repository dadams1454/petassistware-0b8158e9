
import React from 'react';
import { TreeDeciduous } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PedigreeNode from './PedigreeNode';

interface PedigreeChartProps {
  dogId: string;
  relationships: any[];
  allDogs: any[];
}

const PedigreeChart = ({ dogId, relationships, allDogs }: PedigreeChartProps) => {
  const findParents = (currentDogId: string): { sire: any; dam: any } => {
    const parents = relationships
      .filter(r => 
        (r.dog_id === currentDogId && r.relationship_type === 'parent') ||
        (r.related_dog_id === currentDogId && r.relationship_type === 'offspring')
      )
      .map(r => {
        const parentId = r.dog_id === currentDogId ? r.related_dog_id : r.dog_id;
        return allDogs.find(d => d.id === parentId);
      });

    return {
      sire: parents.find(p => p?.gender === 'Male'),
      dam: parents.find(p => p?.gender === 'Female')
    };
  };

  const currentDog = allDogs.find(d => d.id === dogId);
  if (!currentDog) return null;

  const { sire: father, dam: mother } = findParents(dogId);
  const fatherParents = father ? findParents(father.id) : { sire: null, dam: null };
  const motherParents = mother ? findParents(mother.id) : { sire: null, dam: null };

  if (!relationships.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <TreeDeciduous className="h-5 w-5" />
            Pedigree Chart
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center text-muted-foreground py-8">
          No ancestry information available
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <TreeDeciduous className="h-5 w-5" />
          Pedigree Chart
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center">
          <div className="pedigree-tree">
            <div className="flex justify-center items-center gap-4">
              <PedigreeNode dog={currentDog} />
            </div>
            
            {/* First Generation Parents */}
            <div className="flex justify-center items-center gap-4 mt-8">
              <div className="flex-1 text-center">
                {father ? <PedigreeNode dog={father} /> : <PedigreeNode.Empty type="sire" />}
              </div>
              <div className="flex-1 text-center">
                {mother ? <PedigreeNode dog={mother} /> : <PedigreeNode.Empty type="dam" />}
              </div>
            </div>

            {/* Second Generation Parents */}
            <div className="flex justify-center items-center gap-2 mt-8">
              <div className="flex-1 text-center">
                {fatherParents.sire ? 
                  <PedigreeNode dog={fatherParents.sire} small /> : 
                  <PedigreeNode.Empty type="sire" small />
                }
              </div>
              <div className="flex-1 text-center">
                {fatherParents.dam ? 
                  <PedigreeNode dog={fatherParents.dam} small /> : 
                  <PedigreeNode.Empty type="dam" small />
                }
              </div>
              <div className="flex-1 text-center">
                {motherParents.sire ? 
                  <PedigreeNode dog={motherParents.sire} small /> : 
                  <PedigreeNode.Empty type="sire" small />
                }
              </div>
              <div className="flex-1 text-center">
                {motherParents.dam ? 
                  <PedigreeNode dog={motherParents.dam} small /> : 
                  <PedigreeNode.Empty type="dam" small />
                }
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PedigreeChart;
