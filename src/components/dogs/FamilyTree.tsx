
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import DogTreeDialog from './DogTreeDialog';
import { Tables } from '@/integrations/supabase/types';

interface FamilyTreeProps {
  dogId: string;
}

// Define a proper type for our relationship data
interface DogRelationship {
  dog_id: string;
  relationship_type: string;
  related_dog: Tables<'dogs'>;
}

const FamilyTree = ({ dogId }: FamilyTreeProps) => {
  const [selectedDog, setSelectedDog] = useState<Tables<'dogs'> | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: familyTree, isLoading } = useQuery({
    queryKey: ['dogFamilyTree', dogId],
    queryFn: async () => {
      // Specify the exact relationship column with the 'related_dog_id' hint
      const { data, error } = await supabase
        .from('dog_relationships')
        .select(`
          dog_id,
          relationship_type,
          related_dog:dogs!related_dog_id(*)
        `)
        .eq('dog_id', dogId);

      if (error) throw error;
      return data as DogRelationship[];
    },
  });

  const handleDogClick = (dog: Tables<'dogs'>) => {
    setSelectedDog(dog);
    setIsDialogOpen(true);
  };

  if (isLoading) {
    return <div className="flex justify-center items-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>;
  }

  if (!familyTree || familyTree.length === 0) {
    return <div className="p-4 text-center text-gray-500">No family relationships found for this dog.</div>;
  }

  return (
    <div className="p-4">
      <div className="space-y-4">
        {familyTree.map((relation) => (
          <div 
            key={relation.related_dog.id}
            className="p-4 border rounded-lg shadow-sm hover:bg-gray-50 cursor-pointer"
            onClick={() => handleDogClick(relation.related_dog)}
          >
            <h3 className="font-medium">{relation.related_dog.name}</h3>
            <p className="text-sm text-gray-500">{relation.relationship_type}</p>
          </div>
        ))}
      </div>

      {selectedDog && (
        <DogTreeDialog
          dog={selectedDog}
          isOpen={isDialogOpen}
          onClose={() => {
            setIsDialogOpen(false);
            setSelectedDog(null);
          }}
        />
      )}
    </div>
  );
};

export default FamilyTree;
