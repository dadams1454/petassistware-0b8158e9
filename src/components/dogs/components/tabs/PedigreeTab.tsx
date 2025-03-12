
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, TreeDeciduous } from 'lucide-react';
import { useDogRelationships } from '../../hooks/useDogRelationships';
import RelationshipSection from '../pedigree/RelationshipSection';
import AddRelationshipForm from '../pedigree/AddRelationshipForm';

interface PedigreeTabProps {
  dogId: string;
  currentDog: any;
}

const PedigreeTab = ({ dogId, currentDog }: PedigreeTabProps) => {
  const { relationships, isLoading, addRelationship, removeRelationship } = useDogRelationships(dogId);
  const [isAdding, setIsAdding] = useState(false);

  // Filter relationships by type
  const parentRelationships = relationships?.filter(r => 
    (r.dog_id === dogId && r.relationship_type === 'parent') ||
    (r.related_dog_id === dogId && r.relationship_type === 'offspring')
  ) || [];

  const childRelationships = relationships?.filter(r => 
    (r.dog_id === dogId && r.relationship_type === 'offspring') ||
    (r.related_dog_id === dogId && r.relationship_type === 'parent')
  ) || [];

  const handleSubmit = async (values: any) => {
    await addRelationship.mutateAsync({
      relatedDogId: values.relatedDogId,
      type: values.type
    });
    setIsAdding(false);
  };

  const handleAddParent = () => {
    setIsAdding(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-pulse text-gray-400">Loading pedigree information...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TreeDeciduous className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Family Tree</h2>
        </div>
        
        {!isAdding && (
          <Button 
            onClick={() => setIsAdding(true)}
            size="sm"
            className="gap-1"
          >
            <Plus className="h-4 w-4" /> 
            Add Relationship
          </Button>
        )}
      </div>

      {isAdding && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Add New Relationship</CardTitle>
            <CardDescription>
              Connect {currentDog.name} with other dogs in your kennel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AddRelationshipForm 
              dogName={currentDog.name}
              onSubmit={handleSubmit}
              onCancel={() => setIsAdding(false)}
            />
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Parents Section */}
        <RelationshipSection
          title="Parents"
          description={parentRelationships.length > 0 
            ? `${currentDog.name}'s parents` 
            : `No parents recorded for ${currentDog.name}`}
          emptyText={`No parents have been added yet`}
          dogId={dogId}
          currentDog={currentDog}
          relationships={parentRelationships}
          relationshipType="parent"
          onRemoveRelationship={(id) => removeRelationship.mutate(id)}
          onAddClick={() => {
            setIsAdding(true);
          }}
        />

        {/* Offspring Section */}
        <RelationshipSection
          title="Offspring"
          description={childRelationships.length > 0 
            ? `${currentDog.name}'s offspring` 
            : `No offspring recorded for ${currentDog.name}`}
          emptyText={`No offspring have been added yet`}
          dogId={dogId}
          currentDog={currentDog}
          relationships={childRelationships}
          relationshipType="offspring"
          onRemoveRelationship={(id) => removeRelationship.mutate(id)}
          onAddClick={() => {
            setIsAdding(true);
          }}
        />
      </div>
    </div>
  );
};

export default PedigreeTab;
