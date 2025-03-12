
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import DogTreeDialog from './DogTreeDialog';

interface FamilyTreeProps {
  dogId: string;
}

const FamilyTree = ({ dogId }: FamilyTreeProps) => {
  const [selectedDog, setSelectedDog] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: familyTree, isLoading } = useQuery({
    queryKey: ['dogFamilyTree', dogId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('dog_relationships')
        .select(`
          dog_id,
          relationship_type,
          related_dog:dogs(*)
        `)
        .eq('dog_id', dogId);

      if (error) throw error;
      return data;
    },
  });

  const handleDogClick = (dog: any) => {
    setSelectedDog(dog);
    setIsDialogOpen(true);
  };

  if (isLoading) {
    return <div>Loading family tree...</div>;
  }

  return (
    <div className="p-4">
      <div className="space-y-4">
        {familyTree?.map((relation) => (
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
