
import React from 'react';
import { PuppyWithAge, PuppyAgeGroupInfo } from '@/types';
import PuppyCard from './PuppyCard';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface PuppyAgeGroupListProps {
  puppiesByAgeGroup: Record<string, PuppyWithAge[]>;
  ageGroups: PuppyAgeGroupInfo[];
}

const PuppyAgeGroupList: React.FC<PuppyAgeGroupListProps> = ({ 
  puppiesByAgeGroup, 
  ageGroups 
}) => {
  // Filter out empty age groups
  const nonEmptyGroups = ageGroups.filter(group => 
    puppiesByAgeGroup[group.id] && puppiesByAgeGroup[group.id].length > 0
  );

  if (nonEmptyGroups.length === 0) {
    return null;
  }

  return (
    <Accordion 
      type="multiple" 
      defaultValue={nonEmptyGroups.map(g => g.id)} 
      className="space-y-4"
    >
      {nonEmptyGroups.map((group) => {
        const puppiesInGroup = puppiesByAgeGroup[group.id] || [];
        return (
          <AccordionItem value={group.id} key={group.id} className="border rounded-lg overflow-hidden">
            <AccordionTrigger className="px-4 py-3 hover:no-underline bg-muted/30">
              <div className="flex justify-between items-center w-full pr-4">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{group.displayName}</span>
                  <Badge variant="outline" className="ml-2">
                    {puppiesInGroup.length} {puppiesInGroup.length === 1 ? 'puppy' : 'puppies'}
                  </Badge>
                </div>
                <Badge variant="outline" className="bg-primary/10">
                  {group.startDay}-{group.endDay} days
                </Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="p-4 pt-2">
                <div className="text-sm mb-3 text-muted-foreground">
                  <p>{group.description}</p>
                  {group.milestones && (
                    <div className="mt-2 p-2 bg-muted/20 rounded-md">
                      <p className="font-medium mb-1">Key Milestones:</p>
                      <p>{group.milestones}</p>
                    </div>
                  )}
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                  {puppiesInGroup.map((puppy) => (
                    <PuppyCard 
                      key={puppy.id} 
                      puppy={puppy} 
                      ageGroup={group} 
                    />
                  ))}
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
};

export default PuppyAgeGroupList;
