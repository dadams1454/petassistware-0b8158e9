
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import DogRelationshipCard from './DogRelationshipCard';
import EmptyRelationshipState from './EmptyRelationshipState';
import { DogRelationship } from '../../hooks/useDogRelationships';

interface RelationshipSectionProps {
  title: string;
  description: string;
  emptyText: string;
  dogId: string;
  currentDog: any;
  relationships: DogRelationship[];
  relationshipType: 'parent' | 'offspring';
  onRemoveRelationship: (relationshipId: string) => void;
  onAddClick: () => void;
}

const RelationshipSection = ({
  title,
  description,
  emptyText,
  dogId,
  currentDog,
  relationships,
  relationshipType,
  onRemoveRelationship,
  onAddClick
}: RelationshipSectionProps) => {
  // Fetch dog details for each related dog
  const { data: allDogs } = useQuery({
    queryKey: ['allDogs'],
    queryFn: async () => {
      const { data } = await supabase
        .from('dogs')
        .select('id, name, breed, gender, color, photo_url');
      return data || [];
    }
  });

  // Get dog details from ID
  const getDogDetails = (dogId: string) => {
    return allDogs?.find(dog => dog.id === dogId) || null;
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {relationships.length > 0 ? (
          <div className="space-y-3">
            {relationships.map((relationship) => {
              const relatedDogId = relationship.dog_id === dogId 
                ? relationship.related_dog_id 
                : relationship.dog_id;
              const relatedDog = getDogDetails(relatedDogId);
              
              return (
                <DogRelationshipCard
                  key={relationship.id}
                  dogId={dogId}
                  relatedDog={relatedDog}
                  relationshipId={relationship.id}
                  onRemove={onRemoveRelationship}
                />
              );
            })}
          </div>
        ) : (
          <EmptyRelationshipState
            entityName={relationshipType === 'parent' ? 'parents' : 'offspring'}
            dogName={currentDog?.name || ''}
            relationshipType={relationshipType}
            onAddClick={onAddClick}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default RelationshipSection;
