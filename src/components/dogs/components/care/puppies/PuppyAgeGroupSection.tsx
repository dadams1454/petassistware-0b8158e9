
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronUp, ListChecks, Baby } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PuppyWithAge, PuppyAgeGroupData } from '@/types/puppyTracking';
import PuppyCard from './PuppyCard';

interface PuppyAgeGroupSectionProps {
  ageGroup: PuppyAgeGroupData;
  puppies: PuppyWithAge[];
  onRefresh: () => void;
}

const PuppyAgeGroupSection: React.FC<PuppyAgeGroupSectionProps> = ({ 
  ageGroup, 
  puppies,
  onRefresh
}) => {
  const [isOpen, setIsOpen] = React.useState(true);
  
  if (puppies.length === 0) return null;
  
  return (
    <Card className="overflow-hidden">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardHeader className="pb-0">
          <CollapsibleTrigger asChild>
            <div className="flex items-center justify-between cursor-pointer py-2">
              <CardTitle className="flex items-center">
                <Baby className="h-5 w-5 mr-2 text-primary" />
                {ageGroup.name} ({puppies.length})
              </CardTitle>
              <Button variant="ghost" size="sm">
                {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </div>
          </CollapsibleTrigger>
          <p className="text-sm text-muted-foreground mt-1">{ageGroup.description}</p>
        </CardHeader>
        
        <CollapsibleContent>
          <CardContent className="pt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {puppies.map((puppy) => (
                <PuppyCard 
                  key={puppy.id} 
                  puppy={puppy} 
                  ageGroup={ageGroup}
                  onRefresh={onRefresh} 
                />
              ))}
            </div>
            
            <div className="mt-4 pt-3 border-t">
              <h4 className="text-sm font-medium mb-2 flex items-center">
                <ListChecks className="h-4 w-4 mr-1 text-muted-foreground" />
                Care Checklist
              </h4>
              <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                {ageGroup.careChecks?.map((check, index) => (
                  <li key={index}>{check}</li>
                )) || (
                  <li>No care checks defined for this age group</li>
                )}
              </ul>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default PuppyAgeGroupSection;
